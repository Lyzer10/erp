import { createServerFn } from "@tanstack/react-start";
import process from "node:process";
import { z } from "zod";
import { resolveDataSource } from "../data-source";

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
  return { isTestUser: ds.isTestUser, data };
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
    }),
  )
  .handler(async ({ data }) => {
    const ds = await resolveDataSource();
    const image = data.imageUpload ? await uploadProductImage(data.imageUpload) : data.image;
    const { imageUpload: _imageUpload, ...productData } = data;
    const result = await ds.products.create({ ...productData, image });
    return { isTestUser: ds.isTestUser, result };
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
  if (!bucketResponse.ok && bucketResponse.status !== 409) {
    throw new Error("Product image storage could not be prepared.");
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
