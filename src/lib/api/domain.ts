import { createServerFn } from "@tanstack/react-start";
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
    const result = await ds.products.create(data);
    return { isTestUser: ds.isTestUser, result };
  });

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
