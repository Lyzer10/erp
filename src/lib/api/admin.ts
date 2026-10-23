import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import bcrypt from "bcryptjs";
import { and, eq, inArray, ne, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { auditLogs, roleModulePermissions, userModulePermissions, users } from "../../db/schema";
import { authenticateRequest } from "../auth";
import {
  MANAGEABLE_ROLES,
  MODULE_KEYS,
  defaultModulesForRole,
  getEffectiveModules,
  setRoleModule,
  setUserModule,
  requireModuleAccess,
} from "../permissions";
import { ASSIGNABLE_ROLES, canAssignRole, canManageRole } from "../user-access";

async function requireAdministrator() {
  const user = await authenticateRequest(getRequest());
  if (!user) throw new Error("UNAUTHENTICATED");
  if (user.isTestUser || !["SuperAdmin", "Admin"].includes(user.role))
    throw new Error("Administrator permission is required.");
  await requireModuleAccess(user, "administration");
  return user;
}

async function requireSuperAdmin() {
  const user = await requireAdministrator();
  if (user.role !== "SuperAdmin") throw new Error("SuperAdmin permission is required.");
  return user;
}

async function getManageableTarget(actor: { id: number | string; role: string }, userId: number) {
  const [target] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!target || target.status === "Removed" || !canManageRole(actor.role, target.role))
    throw new Error("This account is not available to you.");
  return target;
}

const returnedUser = {
  id: users.id,
  username: users.username,
  email: users.email,
  role: users.role,
  department: users.department,
  status: users.status,
  createdAt: users.createdAt,
};

export const getUsersFn = createServerFn({ method: "GET" }).handler(async () => {
  const actor = await requireAdministrator();
  const conditions = [ne(users.status, "Removed")];
  if (actor.role === "Admin") conditions.push(inArray(users.role, ["Pharmacist", "Cashier", "Storekeeper", "Accountant"]));
  return db.select(returnedUser).from(users).where(and(...conditions)).orderBy(users.username);
});

const accountFields = z.object({
  username: z.string().trim().min(3).max(100).regex(/^[a-zA-Z0-9._-]+$/),
  email: z.string().trim().email(),
  role: z.enum(ASSIGNABLE_ROLES),
  department: z.string().trim().max(100).optional(),
});

export const createUserFn = createServerFn({ method: "POST" })
  .validator(accountFields.extend({ password: z.string().min(12).max(200) }))
  .handler(async ({ data }) => {
    const actor = await requireAdministrator();
    if (!canAssignRole(actor.role, data.role)) throw new Error("You cannot assign that role.");
    const passwordHash = await bcrypt.hash(data.password, 12);
    return db.transaction(async (tx) => {
      const [created] = await tx.insert(users).values({
        username: data.username,
        email: data.email.toLowerCase(),
        passwordHash,
        role: data.role,
        department: data.department || null,
        isTestUser: false,
        status: "Active",
      }).returning(returnedUser);
      await tx.insert(auditLogs).values({
        userId: Number(actor.id), action: "CREATE", entityType: "USER", entityId: String(created.id), summary: `${created.username}, ${created.role}`,
      });
      return created;
    });
  });

export const updateUserFn = createServerFn({ method: "POST" })
  .validator(accountFields.extend({ userId: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const actor = await requireAdministrator();
    const target = await getManageableTarget(actor, data.userId);
    if (!canAssignRole(actor.role, data.role)) throw new Error("You cannot assign that role.");
    return db.transaction(async (tx) => {
      const [updated] = await tx.update(users).set({
        username: data.username,
        email: data.email.toLowerCase(),
        role: data.role,
        department: data.department || null,
      }).where(eq(users.id, target.id)).returning(returnedUser);
      await tx.insert(auditLogs).values({
        userId: Number(actor.id), action: "UPDATE", entityType: "USER", entityId: String(target.id), summary: `${updated.username}, ${updated.role}`,
      });
      return updated;
    });
  });

export const setUserStatusFn = createServerFn({ method: "POST" })
  .validator(z.object({ userId: z.number().int().positive(), status: z.enum(["Active", "Inactive"]) }))
  .handler(async ({ data }) => {
    const actor = await requireAdministrator();
    const target = await getManageableTarget(actor, data.userId);
    if (Number(actor.id) === target.id && data.status === "Inactive") throw new Error("You cannot deactivate your own account.");
    await db.transaction(async (tx) => {
      await tx.update(users).set({ status: data.status }).where(eq(users.id, target.id));
      await tx.insert(auditLogs).values({ userId: Number(actor.id), action: "STATUS_CHANGE", entityType: "USER", entityId: String(target.id), summary: data.status });
    });
    return { success: true };
  });

export const resetUserPasswordFn = createServerFn({ method: "POST" })
  .validator(z.object({ userId: z.number().int().positive(), password: z.string().min(12).max(200) }))
  .handler(async ({ data }) => {
    const actor = await requireAdministrator();
    const target = await getManageableTarget(actor, data.userId);
    const passwordHash = await bcrypt.hash(data.password, 12);
    await db.transaction(async (tx) => {
      await tx.update(users).set({ passwordHash }).where(eq(users.id, target.id));
      await tx.insert(auditLogs).values({ userId: Number(actor.id), action: "PASSWORD_RESET", entityType: "USER", entityId: String(target.id), summary: "Password reset by administrator" });
    });
    return { success: true };
  });

export const removeUserFn = createServerFn({ method: "POST" })
  .validator(z.object({ userId: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const actor = await requireAdministrator();
    const target = await getManageableTarget(actor, data.userId);
    if (Number(actor.id) === target.id) throw new Error("You cannot remove your own account.");
    const removedPassword = await bcrypt.hash(crypto.randomUUID(), 12);
    await db.transaction(async (tx) => {
      await tx.delete(userModulePermissions).where(eq(userModulePermissions.userId, target.id));
      await tx.update(users).set({
        username: `removed-${target.id}-${Date.now()}`,
        email: `removed-${target.id}-${Date.now()}@invalid.local`,
        passwordHash: removedPassword,
        department: null,
        status: "Removed",
      }).where(eq(users.id, target.id));
      await tx.insert(auditLogs).values({ userId: Number(actor.id), action: "REMOVE", entityType: "USER", entityId: String(target.id), summary: `${target.username}, ${target.role}` });
    });
    return { success: true };
  });

export const getAuditLogsFn = createServerFn({ method: "GET" }).handler(async () => {
  const actor = await requireAdministrator();
  const logs = await db.select().from(auditLogs).orderBy(sql`${auditLogs.createdAt} desc`).limit(500);
  if (actor.role === "SuperAdmin") return logs;
  const protectedUsers = await db.select({ id: users.id }).from(users).where(inArray(users.role, ["SuperAdmin", "Admin"]));
  const protectedIds = new Set(protectedUsers.map((user) => String(user.id)));
  return logs.filter((log) =>
    (Number(log.userId) === Number(actor.id) || !protectedIds.has(String(log.userId))) &&
    !(log.entityType === "USER" && log.entityId && protectedIds.has(log.entityId)),
  );
});

export const getPermissionMatrixFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireSuperAdmin();
  const roleRows = await db.select().from(roleModulePermissions);
  const userRows = await db.select().from(userModulePermissions);
  const accountRows = await db.select(returnedUser).from(users).where(and(ne(users.status, "Removed"), ne(users.role, "SuperAdmin"))).orderBy(users.username);
  return {
    modules: MODULE_KEYS,
    roles: MANAGEABLE_ROLES.map((role) => ({
      role,
      permissions: Object.fromEntries(MODULE_KEYS.map((module) => [module, roleRows.find((row) => row.role === role && row.module === module)?.enabled ?? defaultModulesForRole(role).includes(module)])),
    })),
    users: await Promise.all(accountRows.map(async (user) => ({
      ...user,
      effectiveModules: await getEffectiveModules(user),
      overrides: Object.fromEntries(userRows.filter((row) => row.userId === user.id).map((row) => [row.module, row.enabled])),
    }))),
  };
});

export const setRolePermissionFn = createServerFn({ method: "POST" })
  .validator(z.object({ role: z.enum(MANAGEABLE_ROLES), module: z.enum(MODULE_KEYS), enabled: z.boolean() }))
  .handler(async ({ data }) => {
    const actor = await requireSuperAdmin();
    await setRoleModule(data.role, data.module, data.enabled, Number(actor.id));
    await db.insert(auditLogs).values({ userId: Number(actor.id), action: "PERMISSION_CHANGE", entityType: "ROLE", entityId: data.role, summary: `${data.module}: ${data.enabled ? "enabled" : "disabled"}` });
    return { success: true };
  });

export const setUserPermissionFn = createServerFn({ method: "POST" })
  .validator(z.object({ userId: z.number().int().positive(), module: z.enum(MODULE_KEYS), enabled: z.boolean().nullable() }))
  .handler(async ({ data }) => {
    const actor = await requireSuperAdmin();
    const target = await getManageableTarget(actor, data.userId);
    await setUserModule(target.id, data.module, data.enabled, Number(actor.id));
    await db.insert(auditLogs).values({ userId: Number(actor.id), action: "PERMISSION_CHANGE", entityType: "USER", entityId: String(target.id), summary: `${data.module}: ${data.enabled === null ? "role default" : data.enabled ? "enabled" : "disabled"}` });
    return { success: true };
  });

const permissionChange = z.discriminatedUnion("scope", [
  z.object({ scope: z.literal("role"), role: z.enum(MANAGEABLE_ROLES), module: z.enum(MODULE_KEYS), enabled: z.boolean() }),
  z.object({ scope: z.literal("user"), userId: z.number().int().positive(), module: z.enum(MODULE_KEYS), enabled: z.boolean().nullable() }),
]);

export const savePermissionChangesFn = createServerFn({ method: "POST" })
  .validator(z.object({ changes: z.array(permissionChange).min(1).max(200) }))
  .handler(async ({ data }) => {
    const actor = await requireSuperAdmin();
    const allowedUserIds = new Set(
      (await db.select({ id: users.id }).from(users).where(and(ne(users.status, "Removed"), ne(users.role, "SuperAdmin")))).map((row) => row.id),
    );
    await db.transaction(async (tx) => {
      for (const change of data.changes) {
        if (change.scope === "role") {
          await tx.insert(roleModulePermissions).values({ role: change.role, module: change.module, enabled: change.enabled, updatedBy: Number(actor.id), updatedAt: new Date() }).onConflictDoUpdate({
            target: [roleModulePermissions.role, roleModulePermissions.module],
            set: { enabled: change.enabled, updatedBy: Number(actor.id), updatedAt: new Date() },
          });
        } else {
          if (!allowedUserIds.has(change.userId)) throw new Error("A selected user is not available.");
          if (change.enabled === null) {
            await tx.delete(userModulePermissions).where(and(eq(userModulePermissions.userId, change.userId), eq(userModulePermissions.module, change.module)));
          } else {
            await tx.insert(userModulePermissions).values({ userId: change.userId, module: change.module, enabled: change.enabled, updatedBy: Number(actor.id), updatedAt: new Date() }).onConflictDoUpdate({
              target: [userModulePermissions.userId, userModulePermissions.module],
              set: { enabled: change.enabled, updatedBy: Number(actor.id), updatedAt: new Date() },
            });
          }
        }
      }
      const details = data.changes.map((change) =>
        change.scope === "role"
          ? `${change.role}.${change.module}=${change.enabled ? "on" : "off"}`
          : `user ${change.userId}.${change.module}=${change.enabled === null ? "role default" : change.enabled ? "on" : "off"}`,
      );
      await tx.insert(auditLogs).values({
        userId: Number(actor.id), action: "PERMISSIONS_SAVED", entityType: "ACCESS_CONTROL", entityId: null,
        summary: details.join("; "),
      });
    });
    return { success: true, changed: data.changes.length };
  });
