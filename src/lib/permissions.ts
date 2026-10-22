import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { roleModulePermissions, userModulePermissions } from "../db/schema";

import { MODULE_KEYS, defaultModulesForRole, type ManageableRole, type ModuleKey } from "./modules";

export * from "./modules";

export async function getEffectiveModules(user: { id: number | string; role: string }): Promise<ModuleKey[]> {
  if (user.role === "SuperAdmin") return [...MODULE_KEYS];
  const roleRows = await db
    .select({ module: roleModulePermissions.module, enabled: roleModulePermissions.enabled })
    .from(roleModulePermissions)
    .where(eq(roleModulePermissions.role, user.role));
  const userRows = await db
    .select({ module: userModulePermissions.module, enabled: userModulePermissions.enabled })
    .from(userModulePermissions)
    .where(eq(userModulePermissions.userId, Number(user.id)));
  const values = new Map<ModuleKey, boolean>(
    MODULE_KEYS.map((module) => [module, defaultModulesForRole(user.role).includes(module)]),
  );
  for (const row of roleRows) if (MODULE_KEYS.includes(row.module as ModuleKey)) values.set(row.module as ModuleKey, row.enabled);
  for (const row of userRows) if (MODULE_KEYS.includes(row.module as ModuleKey)) values.set(row.module as ModuleKey, row.enabled);
  return MODULE_KEYS.filter((module) => values.get(module));
}

export async function hasModuleAccess(user: { id: number | string; role: string }, module: ModuleKey) {
  return (await getEffectiveModules(user)).includes(module);
}

export async function requireModuleAccess(user: { id: number | string; role: string }, module: ModuleKey) {
  if (!(await hasModuleAccess(user, module))) throw new Error("You do not have permission to use this module.");
}

export async function setRoleModule(role: ManageableRole, module: ModuleKey, enabled: boolean, actorId: number) {
  await db
    .insert(roleModulePermissions)
    .values({ role, module, enabled, updatedBy: actorId, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: [roleModulePermissions.role, roleModulePermissions.module],
      set: { enabled, updatedBy: actorId, updatedAt: new Date() },
    });
}

export async function setUserModule(userId: number, module: ModuleKey, enabled: boolean | null, actorId: number) {
  if (enabled === null) {
    await db.delete(userModulePermissions).where(and(eq(userModulePermissions.userId, userId), eq(userModulePermissions.module, module)));
    return;
  }
  await db
    .insert(userModulePermissions)
    .values({ userId, module, enabled, updatedBy: actorId, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: [userModulePermissions.userId, userModulePermissions.module],
      set: { enabled, updatedBy: actorId, updatedAt: new Date() },
    });
}
