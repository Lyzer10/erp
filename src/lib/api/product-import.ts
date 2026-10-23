import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { auditLogs, inventoryMovements, productBatches, products } from "../../db/schema";
import { authenticateRequest } from "../auth";
import { requireModuleAccess } from "../permissions";
import {
  MAX_IMPORT_ROWS,
  findDuplicateRows,
  importRowSchema,
  productKey,
  type ImportRowInput,
} from "../product-import";
import { uploadProductImage } from "./domain";

async function requireImporter() {
  const user = await authenticateRequest(getRequest());
  if (!user) throw new Error("UNAUTHENTICATED");
  await requireModuleAccess(user, "inventory");
  if (user.isTestUser) throw new Error("Demo users cannot import products.");
  // Imports can overwrite existing products, which is an administrator action.
  if (!["SuperAdmin", "Admin"].includes(user.role))
    throw new Error("Administrator permission is required to import products.");
  return user;
}

const rowsInput = z.object({ rows: z.array(importRowSchema).min(1).max(MAX_IMPORT_ROWS) });

// Catalogue fields an import may change on an existing product. Stock never changes here.
const UPDATABLE = [
  "name",
  "genericName",
  "brand",
  "category",
  "dosageForm",
  "strength",
  "barcode",
  "price",
  "cost",
  "purchaseUnit",
  "sellingUnit",
  "unitsPerPurchaseUnit",
  "reorder",
  "requiresPrescription",
] as const;
type UpdatableField = (typeof UPDATABLE)[number];

export type PlannedRow = {
  rowNumber: number;
  action: "create" | "update" | "unchanged" | "error";
  productId?: number;
  productName: string;
  barcode?: string;
  changes: Array<{ field: UpdatableField; from: string; to: string }>;
  errors: string[];
  warnings: string[];
};

type ExistingProduct = typeof products.$inferSelect;

const display = (value: unknown) =>
  value === null || value === undefined || value === ""
    ? "—"
    : typeof value === "boolean"
      ? value
        ? "Yes"
        : "No"
      : String(value);

export async function planImport(rows: ImportRowInput[]): Promise<PlannedRow[]> {
  const existing = await db.select().from(products);
  const byBarcode = new Map(existing.filter((p) => p.barcode).map((p) => [p.barcode as string, p]));
  const byKey = new Map(existing.map((p) => [productKey(p.name, p.strength), p]));
  const duplicates = findDuplicateRows(rows);
  const today = new Date().toISOString().slice(0, 10);

  return rows.map((row) => {
    const errors = [...(duplicates.get(row.rowNumber) ?? [])];
    const warnings: string[] = [];
    const match: ExistingProduct | undefined =
      (row.barcode ? byBarcode.get(row.barcode) : undefined) ??
      byKey.get(productKey(row.name, row.strength));

    if (row.barcode && match && match.barcode && match.barcode !== row.barcode)
      errors.push(
        `This product already has barcode ${match.barcode}; the file says ${row.barcode}.`,
      );
    const barcodeOwner = row.barcode ? byBarcode.get(row.barcode) : undefined;
    if (barcodeOwner && match && barcodeOwner.id !== match.id)
      errors.push(`Barcode ${row.barcode} already belongs to ${barcodeOwner.name}.`);

    if (!match) {
      if (row.expiryDate && row.expiryDate <= today)
        errors.push(
          `Expiry date ${row.expiryDate} has already passed; expired stock cannot be added.`,
        );
      return {
        rowNumber: row.rowNumber,
        action: errors.length ? "error" : "create",
        productName: row.name,
        barcode: row.barcode,
        changes: [],
        errors,
        warnings,
      };
    }

    if (productKey(match.name, "") !== productKey(row.name, ""))
      warnings.push(
        `Barcode ${match.barcode} belongs to "${match.name}"; this row will rename it to "${row.name}". Check the barcode if that is not intended.`,
      );
    if (row.openingQuantity)
      warnings.push(
        `${match.name} already exists, so the opening stock columns are ignored. Use Stock Adjustment to change its stock.`,
      );
    // Blank optional cells leave the existing value untouched.
    const changes = UPDATABLE.flatMap((field) => {
      const next = row[field as keyof ImportRowInput];
      if (next === undefined) return [];
      const current = match[field as keyof ExistingProduct];
      // Name and strength are how rows are matched, so capitals or spacing alone are not a change.
      const same =
        field === "name" || field === "strength"
          ? productKey(String(current ?? ""), "") === productKey(String(next), "")
          : (current ?? "") === next;
      return same ? [] : [{ field, from: display(current), to: display(next) }];
    });
    return {
      rowNumber: row.rowNumber,
      action: errors.length ? "error" : changes.length ? "update" : "unchanged",
      productId: match.id,
      productName: match.name,
      barcode: row.barcode ?? match.barcode ?? undefined,
      changes,
      errors,
      warnings,
    };
  });
}

export const previewProductImportFn = createServerFn({ method: "POST" })
  .validator(rowsInput)
  .handler(async ({ data }) => {
    await requireImporter();
    return planImport(data.rows);
  });

// Saves a planned import in one transaction. Exported so it can be exercised directly in tests.
export async function applyImport(rows: ImportRowInput[], userId: number) {
  const user = { id: userId };
  // Re-plan inside the save so nothing changed between preview and import goes unnoticed.
  const plan = await planImport(rows);
  const failed = plan.filter((row) => row.action === "error");
  if (failed.length)
    throw new Error(
      `Nothing was imported: ${failed.length} row(s) have problems. Upload the file again to see them.`,
    );
  const rowsByNumber = new Map(rows.map((row) => [row.rowNumber, row]));
  const stamp = Date.now();

  const saved = await db.transaction(async (tx) => {
    const results: Array<{
      rowNumber: number;
      productId: number;
      barcode?: string;
      name: string;
    }> = [];
    const toCreate = plan
      .filter((row) => row.action === "create")
      .map((row) => rowsByNumber.get(row.rowNumber)!);
    let updated = 0;
    for (const planned of plan) {
      if (planned.action === "create") continue;
      const row = rowsByNumber.get(planned.rowNumber)!;
      if (planned.action === "update") {
        const changes = Object.fromEntries(
          planned.changes.map(({ field }) => [field, row[field as keyof ImportRowInput]]),
        );
        await tx.update(products).set(changes).where(eq(products.id, planned.productId!));
        updated++;
      }
      results.push({
        rowNumber: row.rowNumber,
        productId: planned.productId!,
        barcode: planned.barcode,
        name: row.name,
      });
    }

    // New products, their opening batches and movements are written in bulk to stay fast on large files.
    const skuFor = (row: ImportRowInput) => `SKU-${stamp}-${row.rowNumber}`;
    const createdProducts = toCreate.length
      ? await tx
          .insert(products)
          .values(
            toCreate.map((row) => ({
              // Row number keeps SKUs unique when many products are created in the same millisecond.
              sku: skuFor(row),
              name: row.name,
              genericName: row.genericName,
              brand: row.brand,
              category: row.category,
              dosageForm: row.dosageForm,
              strength: row.strength,
              barcode: row.barcode,
              price: row.price,
              cost: row.cost ?? 0,
              purchaseUnit: row.purchaseUnit ?? "piece",
              sellingUnit: row.sellingUnit ?? "piece",
              unitsPerPurchaseUnit: row.unitsPerPurchaseUnit ?? 1,
              reorder: row.reorder ?? 10,
              requiresPrescription: row.requiresPrescription ?? false,
              stock: row.openingQuantity ?? 0,
            })),
          )
          .returning({ id: products.id, sku: products.sku, cost: products.cost })
      : [];
    const productBySku = new Map(createdProducts.map((product) => [product.sku, product]));
    const withStock = toCreate.filter((row) => row.openingQuantity && row.expiryDate);
    const batches = withStock.length
      ? await tx
          .insert(productBatches)
          .values(
            withStock.map((row) => {
              const product = productBySku.get(skuFor(row))!;
              return {
                productId: product.id,
                batchNumber: row.batchNumber || `OPEN-${stamp}-${row.rowNumber}`,
                expiryDate: row.expiryDate!,
                quantity: row.openingQuantity!,
                unitCost: product.cost,
              };
            }),
          )
          .returning({
            id: productBatches.id,
            productId: productBatches.productId,
            quantity: productBatches.quantity,
          })
      : [];
    if (batches.length)
      await tx.insert(inventoryMovements).values(
        batches.map((batch) => ({
          productId: batch.productId,
          batchId: batch.id,
          movementType: "OPENING_STOCK",
          quantity: batch.quantity,
          referenceType: "PRODUCT_IMPORT",
          referenceId: batch.productId,
          performedBy: Number(user.id),
          reason: "Opening stock from Excel import",
        })),
      );
    for (const row of toCreate)
      results.push({
        rowNumber: row.rowNumber,
        productId: productBySku.get(skuFor(row))!.id,
        barcode: row.barcode,
        name: row.name,
      });
    const created = toCreate.length;
    await tx.insert(auditLogs).values({
      userId: Number(user.id),
      action: "IMPORT",
      entityType: "PRODUCT",
      entityId: null,
      summary: `Excel import: ${created} created, ${updated} updated, ${plan.length - created - updated} unchanged`,
    });
    return { created, updated, unchanged: plan.length - created - updated, products: results };
  });
  return saved;
}

export const commitProductImportFn = createServerFn({ method: "POST" })
  .validator(rowsInput)
  .handler(async ({ data }) => {
    const user = await requireImporter();
    return applyImport(data.rows, Number(user.id));
  });

export const setImportedProductImageFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      productId: z.number().int().positive(),
      imageUpload: z.object({
        dataUrl: z.string().max(3_000_000),
        fileName: z.string().trim().min(1).max(180),
        contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
      }),
    }),
  )
  .handler(async ({ data }) => {
    await requireImporter();
    const image = await uploadProductImage(data.imageUpload);
    const [updated] = await db
      .update(products)
      .set({ image })
      .where(eq(products.id, data.productId))
      .returning({ id: products.id });
    if (!updated) throw new Error("Product was not found.");
    return { image };
  });
