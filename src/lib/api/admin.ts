import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { auditLogs, users } from "../../db/schema";
import { authenticateRequest } from "../auth";

async function requireAdmin() {
  const user = await authenticateRequest(getRequest());
  if (!user) throw new Error("UNAUTHENTICATED");
  if (user.isTestUser || !["SuperAdmin", "Admin"].includes(user.role))
    throw new Error("Administrator permission is required.");
  return user;
}

export const getUsersFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  return db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role,
      department: users.department,
      status: users.status,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(users.username);
});

const userInput = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(100)
    .regex(/^[a-zA-Z0-9._-]+$/),
  email: z.string().trim().email(),
  password: z.string().min(12).max(200),
  role: z.enum(["Admin", "Pharmacist", "Cashier", "Storekeeper", "Accountant"]),
  department: z.string().trim().max(100).optional(),
});

export const createUserFn = createServerFn({ method: "POST" })
  .validator(userInput)
  .handler(async ({ data }) => {
    const actor = await requireAdmin();
    const passwordHash = await bcrypt.hash(data.password, 12);
    return db.transaction(async (tx) => {
      const [created] = await tx
        .insert(users)
        .values({
          username: data.username,
          email: data.email.toLowerCase(),
          passwordHash,
          role: data.role,
          department: data.department || null,
          isTestUser: false,
          status: "Active",
        })
        .returning({
          id: users.id,
          username: users.username,
          email: users.email,
          role: users.role,
          department: users.department,
          status: users.status,
          createdAt: users.createdAt,
        });
      await tx.insert(auditLogs).values({
        userId: Number(actor.id),
        action: "CREATE",
        entityType: "USER",
        entityId: String(created.id),
        summary: created.username,
      });
      return created;
    });
  });

export const setUserStatusFn = createServerFn({ method: "POST" })
  .validator(
    z.object({ userId: z.number().int().positive(), status: z.enum(["Active", "Inactive"]) }),
  )
  .handler(async ({ data }) => {
    const actor = await requireAdmin();
    if (Number(actor.id) === data.userId && data.status === "Inactive")
      throw new Error("You cannot deactivate your own account.");
    await db.update(users).set({ status: data.status }).where(eq(users.id, data.userId));
    await db.insert(auditLogs).values({
      userId: Number(actor.id),
      action: "STATUS_CHANGE",
      entityType: "USER",
      entityId: String(data.userId),
      summary: data.status,
    });
    return { success: true };
  });

export const resetUserPasswordFn = createServerFn({ method: "POST" })
  .validator(
    z.object({ userId: z.number().int().positive(), password: z.string().min(12).max(200) }),
  )
  .handler(async ({ data }) => {
    const actor = await requireAdmin();
    const passwordHash = await bcrypt.hash(data.password, 12);
    await db.update(users).set({ passwordHash }).where(eq(users.id, data.userId));
    await db.insert(auditLogs).values({
      userId: Number(actor.id),
      action: "PASSWORD_RESET",
      entityType: "USER",
      entityId: String(data.userId),
      summary: "Password reset by administrator",
    });
    return { success: true };
  });

export const getAuditLogsFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  return db
    .select()
    .from(auditLogs)
    .orderBy(sql`${auditLogs.createdAt} desc`)
    .limit(500);
});
