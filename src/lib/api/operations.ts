import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { and, asc, eq, gt, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import {
  auditLogs,
  businessSettings,
  customers,
  expenses,
  inventoryMovements,
  productBatches,
  products,
  purchaseOrders,
  saleItems,
  salePayments,
  sales,
  suppliers,
  users,
} from "../../db/schema";
import { authenticateRequest } from "../auth";
import { requireModuleAccess, type ModuleKey } from "../permissions";

async function currentUser(module?: ModuleKey) {
  const user = await authenticateRequest(getRequest());
  if (!user) throw new Error("UNAUTHENTICATED");
  if (module) await requireModuleAccess(user, module);
  return user;
}

function requireProduction(user: Awaited<ReturnType<typeof currentUser>>) {
  if (user.isTestUser) throw new Error("This action is unavailable in demo mode.");
}

export const createExpenseFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      category: z.string().trim().min(1).max(100),
      vendor: z.string().trim().min(1).max(200),
      date: z.string().date(),
      amount: z.number().int().positive(),
    }),
  )
  .handler(async ({ data }) => {
    const user = await currentUser("sales");
    requireProduction(user);
    if (!["SuperAdmin", "Admin", "Accountant"].includes(user.role))
      throw new Error("Your role cannot post expenses.");
    return db.transaction(async (tx) => {
      const [expense] = await tx
        .insert(expenses)
        .values({
          code: `EXP-${Date.now()}`,
          ...data,
          status: "Approved",
          createdBy: Number(user.id),
        })
        .returning();
      await tx.insert(auditLogs).values({
        userId: Number(user.id),
        action: "CREATE",
        entityType: "EXPENSE",
        entityId: String(expense.id),
        summary: `${expense.vendor}, TZS ${expense.amount}`,
      });
      return expense;
    });
  });

export const setPartyStatusFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      party: z.enum(["customer", "supplier"]),
      id: z.number().int().positive(),
      status: z.enum(["Active", "Inactive"]),
    }),
  )
  .handler(async ({ data }) => {
    const user = await currentUser("stakeholders");
    requireProduction(user);
    if (!["SuperAdmin", "Admin"].includes(user.role))
      throw new Error("Administrator permission is required.");
    if (data.party === "customer")
      await db.update(customers).set({ status: data.status }).where(eq(customers.id, data.id));
    else await db.update(suppliers).set({ status: data.status }).where(eq(suppliers.id, data.id));
    await db.insert(auditLogs).values({
      userId: Number(user.id),
      action: "STATUS_CHANGE",
      entityType: data.party.toUpperCase(),
      entityId: String(data.id),
      summary: data.status,
    });
    return { success: true };
  });

export const getInventoryFn = createServerFn({ method: "GET" }).handler(async () => {
  await currentUser("inventory");
  const [productRows, batchRows, movementRows] = await Promise.all([
    db.select().from(products).orderBy(asc(products.name)),
    db
      .select({
        id: productBatches.id,
        productId: productBatches.productId,
        productName: products.name,
        sku: products.sku,
        batchNumber: productBatches.batchNumber,
        expiryDate: productBatches.expiryDate,
        quantity: productBatches.quantity,
        unitCost: productBatches.unitCost,
      })
      .from(productBatches)
      .innerJoin(products, eq(products.id, productBatches.productId))
      .orderBy(asc(productBatches.expiryDate)),
    db
      .select()
      .from(inventoryMovements)
      .orderBy(sql`${inventoryMovements.createdAt} desc`)
      .limit(200),
  ]);
  return { products: productRows, batches: batchRows, movements: movementRows };
});

export const adjustStockFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      productId: z.number().int().positive(),
      quantity: z
        .number()
        .int()
        .refine((value) => value !== 0),
      reason: z.string().trim().min(3).max(300),
      batchNumber: z.string().trim().max(100).optional(),
      expiryDate: z.string().date().optional(),
      unitCost: z.number().int().min(0).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const user = await currentUser("inventory");
    requireProduction(user);
    if (!["SuperAdmin", "Admin", "Pharmacist", "Storekeeper"].includes(user.role))
      throw new Error("Your role cannot adjust stock.");
    return db.transaction(async (tx) => {
      const [product] = await tx
        .select()
        .from(products)
        .where(eq(products.id, data.productId))
        .limit(1);
      if (!product) throw new Error("Product was not found.");
      if (data.quantity < 0) {
        const needed = Math.abs(data.quantity);
        const reserved = await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${needed}` })
          .where(and(eq(products.id, product.id), gte(products.stock, needed)))
          .returning({ id: products.id });
        if (reserved.length !== 1) throw new Error("Adjustment exceeds available stock.");
        let remaining = needed;
        const batches = await tx
          .select()
          .from(productBatches)
          .where(and(eq(productBatches.productId, product.id), gt(productBatches.quantity, 0)))
          .orderBy(asc(productBatches.expiryDate));
        for (const batch of batches) {
          if (!remaining) break;
          const quantity = Math.min(remaining, batch.quantity);
          await tx
            .update(productBatches)
            .set({ quantity: sql`${productBatches.quantity} - ${quantity}` })
            .where(eq(productBatches.id, batch.id));
          await tx.insert(inventoryMovements).values({
            productId: product.id,
            batchId: batch.id,
            movementType: "ADJUSTMENT",
            quantity: -quantity,
            referenceType: "ADJUSTMENT",
            referenceId: product.id,
            performedBy: Number(user.id),
            reason: data.reason,
          });
          remaining -= quantity;
        }
        if (batches.length > 0 && remaining > 0)
          throw new Error("Batch quantities do not match the product stock.");
        if (batches.length === 0)
          await tx.insert(inventoryMovements).values({
            productId: product.id,
            movementType: "ADJUSTMENT",
            quantity: data.quantity,
            referenceType: "ADJUSTMENT",
            referenceId: product.id,
            performedBy: Number(user.id),
            reason: data.reason,
          });
      } else {
        if (!data.batchNumber || !data.expiryDate)
          throw new Error("Positive adjustments require a batch number and expiry date.");
        if (data.expiryDate <= new Date().toISOString().slice(0, 10))
          throw new Error("Expired stock cannot be added.");
        const [batch] = await tx
          .insert(productBatches)
          .values({
            productId: product.id,
            batchNumber: data.batchNumber,
            expiryDate: data.expiryDate,
            quantity: data.quantity,
            unitCost: data.unitCost ?? product.cost,
          })
          .onConflictDoUpdate({
            target: [productBatches.productId, productBatches.batchNumber],
            set: {
              quantity: sql`${productBatches.quantity} + ${data.quantity}`,
              expiryDate: data.expiryDate,
            },
          })
          .returning();
        await tx
          .update(products)
          .set({ stock: sql`${products.stock} + ${data.quantity}` })
          .where(eq(products.id, product.id));
        await tx.insert(inventoryMovements).values({
          productId: product.id,
          batchId: batch.id,
          movementType: "ADJUSTMENT",
          quantity: data.quantity,
          referenceType: "ADJUSTMENT",
          referenceId: product.id,
          performedBy: Number(user.id),
          reason: data.reason,
        });
      }
      await tx.insert(auditLogs).values({
        userId: Number(user.id),
        action: "ADJUST_STOCK",
        entityType: "PRODUCT",
        entityId: String(product.id),
        summary: `${data.quantity}: ${data.reason}`,
      });
      return { success: true };
    });
  });

export const getSalesFn = createServerFn({ method: "GET" }).handler(async () => {
  await currentUser("sales");
  return db
    .select({
      id: sales.id,
      receiptNumber: sales.receiptNumber,
      customer: customers.name,
      subtotal: sales.subtotal,
      discount: sales.discount,
      tax: sales.tax,
      total: sales.total,
      status: sales.status,
      createdAt: sales.createdAt,
    })
    .from(sales)
    .leftJoin(customers, eq(customers.id, sales.customerId))
    .orderBy(sql`${sales.createdAt} desc`);
});

export const getSaleReceiptFn = createServerFn({ method: "GET" })
  .validator(z.object({ saleId: z.number().int().positive() }))
  .handler(async ({ data }) => {
    await currentUser("sales");
    const [receipt] = await db
      .select({
        id: sales.id,
        receiptNumber: sales.receiptNumber,
        customer: customers.name,
        cashier: users.username,
        subtotal: sales.subtotal,
        discount: sales.discount,
        tax: sales.tax,
        total: sales.total,
        status: sales.status,
        createdAt: sales.createdAt,
      })
      .from(sales)
      .leftJoin(customers, eq(customers.id, sales.customerId))
      .innerJoin(users, eq(users.id, sales.cashierId))
      .where(eq(sales.id, data.saleId))
      .limit(1);
    if (!receipt) throw new Error("Receipt was not found.");
    const [items, payments, settings] = await Promise.all([
      db.select({ id: saleItems.id, product: products.name, quantity: saleItems.quantity, unitPrice: saleItems.unitPrice, lineTotal: saleItems.lineTotal })
        .from(saleItems).innerJoin(products, eq(products.id, saleItems.productId)).where(eq(saleItems.saleId, data.saleId)).orderBy(asc(saleItems.id)),
      db.select({ id: salePayments.id, method: salePayments.method, amount: salePayments.amount, reference: salePayments.reference })
        .from(salePayments).where(eq(salePayments.saleId, data.saleId)).orderBy(asc(salePayments.id)),
      db.select({ businessName: businessSettings.businessName, phone: businessSettings.phone, email: businessSettings.email, address: businessSettings.address, tin: businessSettings.tin }).from(businessSettings).orderBy(asc(businessSettings.id)).limit(1),
    ]);
    return { receipt, items, payments, business: settings[0] ?? { businessName: "DeveleERP Pharmacy", phone: null, email: null, address: null, tin: null } };
  });

export const voidSaleFn = createServerFn({ method: "POST" })
  .validator(
    z.object({ saleId: z.number().int().positive(), reason: z.string().trim().min(3).max(300) }),
  )
  .handler(async ({ data }) => {
    const user = await currentUser("sales");
    requireProduction(user);
    if (!["SuperAdmin", "Admin", "Pharmacist"].includes(user.role))
      throw new Error("Your role cannot void sales.");
    return db.transaction(async (tx) => {
      const [sale] = await tx.select().from(sales).where(eq(sales.id, data.saleId)).limit(1);
      if (!sale) throw new Error("Sale was not found.");
      if (sale.status !== "Completed") throw new Error("Only a completed sale can be voided.");
      const claimed = await tx
        .update(sales)
        .set({ status: "Voided" })
        .where(and(eq(sales.id, sale.id), eq(sales.status, "Completed")))
        .returning({ id: sales.id });
      if (claimed.length !== 1) throw new Error("Sale changed; refresh and retry.");
      const items = await tx.select().from(saleItems).where(eq(saleItems.saleId, sale.id));
      for (const item of items) {
        await tx
          .update(products)
          .set({ stock: sql`${products.stock} + ${item.quantity}` })
          .where(eq(products.id, item.productId));
        if (item.batchId)
          await tx
            .update(productBatches)
            .set({ quantity: sql`${productBatches.quantity} + ${item.quantity}` })
            .where(eq(productBatches.id, item.batchId));
        await tx.insert(inventoryMovements).values({
          productId: item.productId,
          batchId: item.batchId,
          movementType: "SALE_VOID",
          quantity: item.quantity,
          referenceType: "SALE",
          referenceId: sale.id,
          performedBy: Number(user.id),
          reason: data.reason,
        });
      }
      if (sale.customerId) {
        const payments = await tx
          .select()
          .from(salePayments)
          .where(eq(salePayments.saleId, sale.id));
        if (payments.some((payment) => payment.method === "credit")) {
          await tx
            .update(customers)
            .set({ balance: sql`greatest(0, ${customers.balance} - ${sale.total})` })
            .where(eq(customers.id, sale.customerId));
        }
      }
      await tx.insert(auditLogs).values({
        userId: Number(user.id),
        action: "VOID",
        entityType: "SALE",
        entityId: String(sale.id),
        summary: data.reason,
      });
      return { success: true };
    });
  });

export const getDashboardFn = createServerFn({ method: "GET" }).handler(async () => {
  await currentUser("dashboard");
  const today = new Date().toISOString().slice(0, 10);
  const [saleTotals] = await db
    .select({
      revenue: sql<number>`coalesce(sum(${sales.total}), 0)::int`,
      salesCount: sql<number>`count(*)::int`,
    })
    .from(sales)
    .where(and(eq(sales.status, "Completed"), sql`${sales.createdAt}::date = ${today}::date`));
  const [expenseTotals] = await db
    .select({ amount: sql<number>`coalesce(sum(${expenses.amount}), 0)::int` })
    .from(expenses)
    .where(and(eq(expenses.status, "Approved"), sql`${expenses.date}::date = ${today}::date`));
  const [purchaseTotals] = await db
    .select({ amount: sql<number>`coalesce(sum(${purchaseOrders.total}), 0)::int` })
    .from(purchaseOrders)
    .where(sql`${purchaseOrders.date}::date = ${today}::date`);
  const [stockTotals] = await db
    .select({
      lowStock: sql<number>`count(*) filter (where ${products.stock} > 0 and ${products.stock} <= ${products.reorder})::int`,
      outOfStock: sql<number>`count(*) filter (where ${products.stock} <= 0)::int`,
      stockValue: sql<number>`coalesce(sum(${products.stock}::bigint * ${products.cost}::bigint), 0)`.mapWith(Number),
      stockUnits: sql<number>`coalesce(sum(${products.stock}), 0)::int`,
      stockedProducts: sql<number>`count(*) filter (where ${products.stock} > 0)::int`,
    })
    .from(products);
  const [expiryTotals] = await db
    .select({
      expired: sql<number>`count(*) filter (where ${productBatches.quantity} > 0 and ${productBatches.expiryDate} < current_date)::int`,
      nearExpiry: sql<number>`count(*) filter (where ${productBatches.quantity} > 0 and ${productBatches.expiryDate} >= current_date and ${productBatches.expiryDate} <= current_date + interval '90 days')::int`,
    })
    .from(productBatches);
  const topProducts = await db
    .select({
      name: products.name,
      quantity: sql<number>`sum(${saleItems.quantity})::int`,
      revenue: sql<number>`sum(${saleItems.lineTotal})::int`,
    })
    .from(saleItems)
    .innerJoin(products, eq(products.id, saleItems.productId))
    .innerJoin(sales, eq(sales.id, saleItems.saleId))
    .where(eq(sales.status, "Completed"))
    .groupBy(products.id, products.name)
    .orderBy(sql`sum(${saleItems.lineTotal}) desc`)
    .limit(5);
  const topCustomers = await db
    .select({
      name: customers.name,
      revenue: sql<number>`sum(${sales.total})::int`,
    })
    .from(sales)
    .innerJoin(customers, eq(customers.id, sales.customerId))
    .where(eq(sales.status, "Completed"))
    .groupBy(customers.id, customers.name)
    .orderBy(sql`sum(${sales.total}) desc`)
    .limit(5);
  // Last six calendar months including the current one, zero-filled so empty months still plot.
  const monthRows = await db
    .select({
      month: sql<string>`to_char(date_trunc('month', ${sales.createdAt}), 'YYYY-MM')`,
      revenue: sql<number>`sum(${sales.total})::int`,
      salesCount: sql<number>`count(*)::int`,
    })
    .from(sales)
    .where(
      and(
        eq(sales.status, "Completed"),
        sql`${sales.createdAt} >= date_trunc('month', current_date) - interval '5 months'`,
      ),
    )
    .groupBy(sql`1`);
  const now = new Date();
  const monthlySales = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + index, 1));
    const month = date.toISOString().slice(0, 7);
    const row = monthRows.find((item) => item.month === month);
    return { month, revenue: row?.revenue ?? 0, salesCount: row?.salesCount ?? 0 };
  });
  return {
    revenue: saleTotals.revenue,
    salesCount: saleTotals.salesCount,
    expenses: expenseTotals.amount,
    purchases: purchaseTotals.amount,
    grossMargin: saleTotals.revenue - expenseTotals.amount,
    ...stockTotals,
    ...expiryTotals,
    topProducts,
    topCustomers,
    monthlySales,
  };
});

export const getBusinessSettingsFn = createServerFn({ method: "GET" }).handler(async () => {
  await currentUser();
  const [settings] = await db
    .select()
    .from(businessSettings)
    .orderBy(asc(businessSettings.id))
    .limit(1);
  return (
    settings || {
      id: 0,
      businessName: "DeveleERP Pharmacy",
      tin: null,
      vrn: null,
      phone: null,
      email: null,
      address: null,
      currency: "TZS",
      taxRateBasisPoints: 0,
    }
  );
});

export const updateBusinessSettingsFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      businessName: z.string().trim().min(2).max(200),
      tin: z.string().trim().max(100).optional(),
      vrn: z.string().trim().max(100).optional(),
      phone: z.string().trim().max(100).optional(),
      email: z.string().email().optional().or(z.literal("")),
      address: z.string().trim().max(500).optional(),
      currency: z.literal("TZS"),
      taxRateBasisPoints: z.number().int().min(0).max(10000),
    }),
  )
  .handler(async ({ data }) => {
    const user = await currentUser("administration");
    requireProduction(user);
    if (!["SuperAdmin", "Admin"].includes(user.role))
      throw new Error("Administrator permission is required.");
    return db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(businessSettings)
        .orderBy(asc(businessSettings.id))
        .limit(1);
      const values = { ...data, email: data.email || null, updatedAt: new Date() };
      const [settings] = existing
        ? await tx
            .update(businessSettings)
            .set(values)
            .where(eq(businessSettings.id, existing.id))
            .returning()
        : await tx.insert(businessSettings).values(values).returning();
      await tx.insert(auditLogs).values({
        userId: Number(user.id),
        action: "UPDATE",
        entityType: "BUSINESS_SETTINGS",
        entityId: String(settings.id),
        summary: settings.businessName,
      });
      return settings;
    });
  });
