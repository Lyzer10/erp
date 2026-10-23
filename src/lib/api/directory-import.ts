import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { auditLogs, customers, suppliers } from "../../db/schema";
import { authenticateRequest } from "../auth";
import { requireModuleAccess } from "../permissions";

const rowSchema = z.object({ rowNumber: z.number().int().positive(), code: z.string().max(100).optional(), name: z.string().trim().min(1).max(200), contact: z.string().max(200).optional(), phone: z.string().max(50).optional(), email: z.string().email().max(200).optional(), status: z.enum(["Active", "Inactive"]) });
const input = z.object({ kind: z.enum(["customer", "supplier"]), rows: z.array(rowSchema).min(1).max(1000) });

async function requireImporter() {
  const user = await authenticateRequest(getRequest());
  if (!user) throw new Error("UNAUTHENTICATED");
  await requireModuleAccess(user, "stakeholders");
  if (!["SuperAdmin", "Admin"].includes(user.role)) throw new Error("Administrator permission is required.");
  return user;
}

async function validate(kind: "customer" | "supplier", rows: z.infer<typeof rowSchema>[]) {
  const table = kind === "customer" ? customers : suppliers;
  const existing = await db.select({ id: table.id, code: table.code, email: table.email, phone: table.phone }).from(table);
  const errors: string[] = [];
  const seen = new Map<string, number>();
  for (const row of rows) {
    if (row.code) {
      const codeKey = `code:${row.code.toLowerCase()}`;
      if (seen.has(codeKey)) errors.push(`Rows ${seen.get(codeKey)} and ${row.rowNumber}: duplicate code.`);
      seen.set(codeKey, row.rowNumber);
    }
    for (const [field, value] of [["email", row.email], ["phone", row.phone]] as const) {
      if (!value) continue;
      const key = `${field}:${value.toLowerCase()}`;
      if (seen.has(key)) errors.push(`Rows ${seen.get(key)} and ${row.rowNumber}: duplicate ${field}.`);
      seen.set(key, row.rowNumber);
      const owner = existing.find((item) => String(item[field] || "").toLowerCase() === value.toLowerCase());
      const matched = row.code ? existing.find((item) => item.code === row.code) : undefined;
      if (owner && owner.id !== matched?.id) errors.push(`Row ${row.rowNumber}: ${field} already belongs to another record.`);
    }
  }
  return errors;
}

export const previewDirectoryImportFn = createServerFn({ method: "POST" }).validator(input).handler(async ({ data }) => {
  await requireImporter();
  const errors = await validate(data.kind, data.rows);
  const table = data.kind === "customer" ? customers : suppliers;
  const codes = data.rows.flatMap((row) => row.code ? [row.code] : []);
  const existing = codes.length ? await db.select({ code: table.code }).from(table).where(inArray(table.code, codes)) : [];
  const existingCodes = new Set(existing.map((row) => row.code));
  return { errors, creates: data.rows.filter((row) => !row.code || !existingCodes.has(row.code)).length, updates: data.rows.filter((row) => row.code && existingCodes.has(row.code)).length };
});

export const commitDirectoryImportFn = createServerFn({ method: "POST" }).validator(input).handler(async ({ data }) => {
  const actor = await requireImporter();
  const errors = await validate(data.kind, data.rows);
  if (errors.length) throw new Error(`Nothing was imported. ${errors[0]}`);
  let created = 0, updated = 0;
  await db.transaction(async (tx) => {
    for (const row of data.rows) {
      const values = { name: row.name, contact: row.contact || null, phone: row.phone || null, email: row.email || null, status: row.status };
      if (data.kind === "customer") {
        const existing = row.code ? await tx.select({ id: customers.id }).from(customers).where(eq(customers.code, row.code)).limit(1) : [];
        if (existing.length) { await tx.update(customers).set(values).where(eq(customers.id, existing[0].id)); updated++; }
        else { await tx.insert(customers).values({ ...values, code: row.code || `CUS-${Date.now()}-${row.rowNumber}`, balance: 0 }); created++; }
      } else {
        const existing = row.code ? await tx.select({ id: suppliers.id }).from(suppliers).where(eq(suppliers.code, row.code)).limit(1) : [];
        if (existing.length) { await tx.update(suppliers).set(values).where(eq(suppliers.id, existing[0].id)); updated++; }
        else { await tx.insert(suppliers).values({ ...values, code: row.code || `SUP-${Date.now()}-${row.rowNumber}`, payable: 0 }); created++; }
      }
    }
    await tx.insert(auditLogs).values({ userId: Number(actor.id), action: "IMPORT", entityType: data.kind.toUpperCase(), entityId: null, summary: `Excel import: ${created} created, ${updated} updated` });
  });
  return { created, updated };
});
