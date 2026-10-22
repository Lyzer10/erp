import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { eq, inArray } from "drizzle-orm";
import process from "node:process";
import { z } from "zod";
import { db } from "../../db";
import {
  auditLogs,
  inventoryMovements,
  productBatches,
  products,
  purchaseOrderItems,
  saleItems,
} from "../../db/schema";
import { authenticateRequest } from "../auth";
import { resolveDataSource } from "../data-source";
import { isExistingBucketResponse } from "../storage-errors";

export const getCustomersFn = createServerFn({ method: "GET" }).handler(async () => {
  const ds = await resolveDataSource();
  const data = await ds.customers.getAll();
  return { isTestUser: ds.isTestUser, data };
});

export const createCustomerFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().min(1),
      contact: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const ds = await resolveDataSource();
    const result = await ds.customers.create(data);
    return { isTestUser: ds.isTestUser, result };
  });

export const getSuppliersFn = createServerFn({ method: "GET" }).handler(async () => {
  const ds = await resolveDataSource();
  const data = await ds.suppliers.getAll();
  return { isTestUser: ds.isTestUser, data };
});

export const createSupplierFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().min(1),
      contact: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const ds = await resolveDataSource();
    const result = await ds.suppliers.create(data);
    return { isTestUser: ds.isTestUser, result };
  });

export const getProductsFn = createServerFn({ method: "GET" }).handler(async () => {
  const ds = await resolveDataSource();
  const data = await ds.products.getAll();
  return {
    isTestUser: ds.isTestUser,
    canDelete: !ds.isTestUser && ["SuperAdmin", "Admin"].includes(ds.user.role),
    data,
  };
});

export const deleteProductsFn = createServerFn({ method: "POST" })
  .validator(z.object({ productIds: z.array(z.number().int().positive()).min(1).max(100) }))
  .handler(async ({ data }) => {
    const actor = await authenticateRequest(getRequest());
    if (!actor || actor.isTestUser || !["SuperAdmin", "Admin"].includes(actor.role)) {
      throw new Error("Administrator permission is required to delete products.");
    }
    const ids = [...new Set(data.productIds)];
    return db.transaction(async (tx) => {
      const selected = await tx
        .select({ id: products.id, name: products.name, sku: products.sku, stock: products.stock })
        .from(products)
        .where(inArray(products.id, ids));
      const selectedIds = selected.map((product) => product.id);
      if (!selectedIds.length) return { deleted: [], blocked: [] };

      const [batchRefs, saleRefs, purchaseRefs, movementRefs] = await Promise.all([
        tx
          .selectDistinct({ productId: productBatches.productId })
          .from(productBatches)
          .where(inArray(productBatches.productId, selectedIds)),
        tx
          .selectDistinct({ productId: saleItems.productId })
          .from(saleItems)
          .where(inArray(saleItems.productId, selectedIds)),
        tx
          .selectDistinct({ productId: purchaseOrderItems.productId })
          .from(purchaseOrderItems)
          .where(inArray(purchaseOrderItems.productId, selectedIds)),
        tx
          .selectDistinct({ productId: inventoryMovements.productId })
          .from(inventoryMovements)
          .where(inArray(inventoryMovements.productId, selectedIds)),
      ]);
      const referenced = new Set(
        [...batchRefs, ...saleRefs, ...purchaseRefs, ...movementRefs].map((row) => row.productId),
      );
      const blocked = selected
        .filter((product) => product.stock > 0 || referenced.has(product.id))
        .map((product) => ({
          id: product.id,
          name: product.name,
          reason:
            product.stock > 0 ? "Product still has stock." : "Product has transaction history.",
        }));
      const blockedIds = new Set(blocked.map((product) => product.id));
      const deletable = selected.filter((product) => !blockedIds.has(product.id));
      if (deletable.length) {
        await tx.delete(products).where(
          inArray(
            products.id,
            deletable.map((product) => product.id),
          ),
        );
        await tx.insert(auditLogs).values(
          deletable.map((product) => ({
            userId: Number(actor.id),
            action: "DELETE",
            entityType: "PRODUCT",
            entityId: String(product.id),
            summary: `${product.sku}, ${product.name}`,
          })),
        );
      }
      return { deleted: deletable.map(({ id, name }) => ({ id, name })), blocked };
    });
  });

export const createProductFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().trim().min(1).max(200),
      price: z.number().int().min(0),
      cost: z.number().int().min(0).default(0),
      stock: z.number().int().min(0).default(0),
      reorder: z.number().int().min(0).default(10),
      category: z.string().trim().min(1).max(100),
      brand: z.string().trim().max(100).optional(),
      image: z.string().trim().max(2000).optional(),
      imageUpload: z
        .object({
          dataUrl: z.string().max(3_000_000),
          fileName: z.string().trim().min(1).max(180),
          contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
        })
        .optional(),
      genericName: z.string().trim().max(200).optional(),
      dosageForm: z.string().trim().max(100).optional(),
      strength: z.string().trim().max(100).optional(),
      barcode: z.string().trim().max(100).optional(),
      purchaseUnit: z.string().trim().min(1).max(50).default("piece"),
      sellingUnit: z.string().trim().min(1).max(50).default("piece"),
      unitsPerPurchaseUnit: z.number().int().positive().default(1),
      requiresPrescription: z.boolean().default(false),
      openingStock: z
        .object({
          quantity: z.number().int().positive(),
          batchNumber: z.string().trim().min(1).max(100).optional(),
          expiryDate: z.string().date(),
          reason: z.string().trim().min(3).max(300).optional(),
        })
        .optional(),
    }),
  )
  .handler(async ({ data }) => {
    const ds = await resolveDataSource();
    const image = data.imageUpload ? await uploadProductImage(data.imageUpload) : data.image;
    if (
      data.openingStock?.expiryDate &&
      data.openingStock.expiryDate <= new Date().toISOString().slice(0, 10)
    ) {
      throw new Error("Expired stock cannot be added.");
    }
    const { imageUpload: _imageUpload, openingStock, ...productData } = data;
    const result = await db.transaction(async (tx) => {
      const [product] = await tx
        .insert(products)
        .values({
          ...productData,
          sku: `SKU-${Date.now()}`,
          stock: openingStock?.quantity ?? 0,
          image,
        })
        .returning();
      if (openingStock) {
        const [batch] = await tx
          .insert(productBatches)
          .values({
            productId: product.id,
            batchNumber: openingStock.batchNumber || `OPEN-${Date.now()}`,
            expiryDate: openingStock.expiryDate,
            quantity: openingStock.quantity,
            unitCost: product.cost,
          })
          .returning();
        await tx.insert(inventoryMovements).values({
          productId: product.id,
          batchId: batch.id,
          movementType: "OPENING_STOCK",
          quantity: openingStock.quantity,
          referenceType: "PRODUCT_CREATION",
          referenceId: product.id,
          performedBy: Number(ds.user.id),
          reason: openingStock.reason || "Opening stock",
        });
      }
      return product;
    });
    return { isTestUser: ds.isTestUser, result };
  });

export const updateProductFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.number().int().positive(),
      name: z.string().trim().min(1).max(200),
      price: z.number().int().min(0),
      cost: z.number().int().min(0),
      reorder: z.number().int().min(0),
      category: z.string().trim().min(1).max(100),
      brand: z.string().trim().max(100).optional(),
      genericName: z.string().trim().max(200).optional(),
      dosageForm: z.string().trim().max(100).optional(),
      strength: z.string().trim().max(100).optional(),
      barcode: z.string().trim().max(100).optional(),
      purchaseUnit: z.string().trim().min(1).max(50),
      sellingUnit: z.string().trim().min(1).max(50),
      unitsPerPurchaseUnit: z.number().int().positive(),
      requiresPrescription: z.boolean(),
      imageUpload: z
        .object({
          dataUrl: z.string().max(3_000_000),
          fileName: z.string().trim().min(1).max(180),
          contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
        })
        .optional(),
    }),
  )
  .handler(async ({ data }) => {
    const ds = await resolveDataSource();
    if (!["SuperAdmin", "Admin"].includes(ds.user.role)) {
      throw new Error("Administrator permission is required to edit products.");
    }
    const image = data.imageUpload ? await uploadProductImage(data.imageUpload) : undefined;
    const { id, imageUpload: _imageUpload, ...changes } = data;
    const [result] = await db.transaction(async (tx) => {
      const updated = await tx
        .update(products)
        .set({
          ...changes,
          brand: changes.brand || null,
          genericName: changes.genericName || null,
          dosageForm: changes.dosageForm || null,
          strength: changes.strength || null,
          barcode: changes.barcode || null,
          ...(image ? { image } : {}),
        })
        .where(eq(products.id, id))
        .returning();
      if (!updated.length) throw new Error("Product was not found.");
      await tx.insert(auditLogs).values({
        userId: Number(ds.user.id),
        action: "UPDATE",
        entityType: "PRODUCT",
        entityId: String(id),
        summary: `${updated[0].sku}, ${updated[0].name}`,
      });
      return updated;
    });
    return { result };
  });

async function uploadProductImage(upload: {
  dataUrl: string;
  fileName: string;
  contentType: "image/jpeg" | "image/png" | "image/webp";
}) {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Product image storage is not configured yet.");
  }

  const match = upload.dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
  if (!match || match[1] !== upload.contentType) throw new Error("The product image is invalid.");
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length > 2_000_000) throw new Error("The product image must be smaller than 2 MB.");

  const headers = { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey };
  const bucketResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ id: "product-images", name: "product-images", public: true }),
  });
  if (!bucketResponse.ok) {
    const bucketError: unknown = await bucketResponse.json().catch(() => null);
    if (!isExistingBucketResponse(bucketResponse.status, bucketError)) {
      throw new Error("Product image storage could not be prepared.");
    }
  }

  const extension = upload.contentType === "image/jpeg" ? "jpg" : upload.contentType.split("/")[1];
  const stem =
    upload.fileName
      .replace(/\.[^.]+$/, "")
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "product";
  const objectName = `${Date.now()}-${crypto.randomUUID()}-${stem}.${extension}`;
  const uploadResponse = await fetch(
    `${supabaseUrl}/storage/v1/object/product-images/${encodeURIComponent(objectName)}`,
    { method: "POST", headers: { ...headers, "Content-Type": upload.contentType }, body: bytes },
  );
  if (!uploadResponse.ok) throw new Error("The product image could not be uploaded.");
  return `${supabaseUrl}/storage/v1/object/public/product-images/${encodeURIComponent(objectName)}`;
}

export const getExpensesFn = createServerFn({ method: "GET" }).handler(async () => {
  const ds = await resolveDataSource();
  const data = await ds.expenses.getAll();
  return { isTestUser: ds.isTestUser, data };
});

export const getPurchaseOrdersFn = createServerFn({ method: "GET" }).handler(async () => {
  const ds = await resolveDataSource();
  const data = await ds.purchaseOrders.getAll();
  return { isTestUser: ds.isTestUser, data };
});
