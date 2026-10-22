import { randomUUID } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { and, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import {
  auditLogs,
  inventoryMovements,
  productBatches,
  products,
  purchaseOrderItems,
  purchaseOrders,
  suppliers,
} from "../../db/schema";
import { authenticateRequest } from "../auth";

const lineSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  unitCost: z.number().int().min(0),
  batchNumber: z.string().trim().min(1).max(100),
  expiryDate: z.string().date(),
});

const createPurchaseSchema = z.object({
  supplierId: z.number().int().positive(),
  date: z.string().date(),
  notes: z.string().trim().max(1000).optional(),
  receiveNow: z.boolean().default(false),
  items: z.array(lineSchema).min(1),
});

async function requireProductionUser() {
  const user = await authenticateRequest(getRequest());
  if (!user) throw new Error("UNAUTHENTICATED");
  if (user.isTestUser) throw new Error("Demo purchases are not persisted.");
  if (!["SuperAdmin", "Admin", "Pharmacist", "Storekeeper"].includes(user.role)) {
    throw new Error("Your role cannot manage purchases.");
  }
  return user;
}

function orderCode() {
  return `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export const createPurchaseOrderFn = createServerFn({ method: "POST" })
  .validator(createPurchaseSchema)
  .handler(async ({ data }) => {
    const user = await requireProductionUser();
    const today = new Date().toISOString().slice(0, 10);
    if (data.receiveNow && data.items.some((item) => item.expiryDate <= today)) {
      throw new Error("Expired stock cannot be received.");
    }

    return db.transaction(async (tx) => {
      const [supplier] = await tx
        .select()
        .from(suppliers)
        .where(eq(suppliers.id, data.supplierId))
        .limit(1);
      if (!supplier) throw new Error("Supplier was not found.");

      const productIds = Array.from(new Set(data.items.map((item) => item.productId)));
      const existingProducts = await tx
        .select({ id: products.id })
        .from(products)
        .where(inArray(products.id, productIds));
      if (existingProducts.length !== productIds.length)
        throw new Error("One or more products were not found.");

      const total = data.items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
      const [order] = await tx
        .insert(purchaseOrders)
        .values({
          code: orderCode(),
          supplier: supplier.name,
          supplierId: supplier.id,
          date: data.date,
          items: data.items.length,
          total,
          status: data.receiveNow ? "Received" : "Approved",
          notes: data.notes || null,
          createdBy: Number(user.id),
          receivedAt: data.receiveNow ? new Date() : null,
        })
        .returning();

      const insertedItems = await tx
        .insert(purchaseOrderItems)
        .values(
          data.items.map((item) => ({
            purchaseOrderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitCost: item.unitCost,
            batchNumber: item.batchNumber,
            expiryDate: item.expiryDate,
            receivedQuantity: data.receiveNow ? item.quantity : 0,
          })),
        )
        .returning();

      if (data.receiveNow) {
        for (const item of data.items) {
          const [batch] = await tx
            .insert(productBatches)
            .values({
              productId: item.productId,
              batchNumber: item.batchNumber,
              expiryDate: item.expiryDate,
              quantity: item.quantity,
              unitCost: item.unitCost,
            })
            .onConflictDoUpdate({
              target: [productBatches.productId, productBatches.batchNumber],
              set: {
                expiryDate: item.expiryDate,
                unitCost: item.unitCost,
                quantity: sql`${productBatches.quantity} + ${item.quantity}`,
              },
            })
            .returning();

          await tx
            .update(products)
            .set({
              stock: sql`${products.stock} + ${item.quantity}`,
              cost: item.unitCost,
            })
            .where(eq(products.id, item.productId));

          await tx.insert(inventoryMovements).values({
            productId: item.productId,
            batchId: batch.id,
            movementType: "PURCHASE_RECEIPT",
            quantity: item.quantity,
            referenceType: "PURCHASE_ORDER",
            referenceId: order.id,
            performedBy: Number(user.id),
          });
        }
        await tx
          .update(suppliers)
          .set({ payable: sql`${suppliers.payable} + ${total}` })
          .where(eq(suppliers.id, supplier.id));
      }

      await tx.insert(auditLogs).values({
        userId: Number(user.id),
        action: data.receiveNow ? "CREATE_AND_RECEIVE" : "CREATE",
        entityType: "PURCHASE_ORDER",
        entityId: String(order.id),
        summary: `${order.code} for ${supplier.name}, TZS ${total}`,
      });
      return { ...order, lines: insertedItems };
    });
  });

export const receivePurchaseOrderFn = createServerFn({ method: "POST" })
  .validator(z.object({ purchaseOrderId: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const user = await requireProductionUser();
    const today = new Date().toISOString().slice(0, 10);
    return db.transaction(async (tx) => {
      const [order] = await tx
        .select()
        .from(purchaseOrders)
        .where(eq(purchaseOrders.id, data.purchaseOrderId))
        .limit(1);
      if (!order) throw new Error("Purchase order was not found.");
      if (order.status === "Received")
        throw new Error("This purchase order has already been received.");

      const lines = await tx
        .select()
        .from(purchaseOrderItems)
        .where(eq(purchaseOrderItems.purchaseOrderId, order.id));
      if (lines.length === 0) throw new Error("Purchase order has no items.");
      if (lines.some((line) => !line.batchNumber || !line.expiryDate || line.expiryDate <= today)) {
        throw new Error(
          "Every item requires a valid future expiry date and batch number before receipt.",
        );
      }

      const claimed = await tx
        .update(purchaseOrders)
        .set({ status: "Received", receivedAt: new Date() })
        .where(and(eq(purchaseOrders.id, order.id), eq(purchaseOrders.status, order.status)))
        .returning({ id: purchaseOrders.id });
      if (claimed.length !== 1) throw new Error("Purchase order changed; refresh and retry.");

      for (const line of lines) {
        const quantity = line.quantity - line.receivedQuantity;
        if (quantity <= 0) continue;
        const [batch] = await tx
          .insert(productBatches)
          .values({
            productId: line.productId,
            batchNumber: line.batchNumber!,
            expiryDate: line.expiryDate!,
            quantity,
            unitCost: line.unitCost,
          })
          .onConflictDoUpdate({
            target: [productBatches.productId, productBatches.batchNumber],
            set: {
              quantity: sql`${productBatches.quantity} + ${quantity}`,
              expiryDate: line.expiryDate!,
              unitCost: line.unitCost,
            },
          })
          .returning();
        await tx
          .update(products)
          .set({ stock: sql`${products.stock} + ${quantity}`, cost: line.unitCost })
          .where(eq(products.id, line.productId));
        await tx
          .update(purchaseOrderItems)
          .set({ receivedQuantity: line.quantity })
          .where(eq(purchaseOrderItems.id, line.id));
        await tx.insert(inventoryMovements).values({
          productId: line.productId,
          batchId: batch.id,
          movementType: "PURCHASE_RECEIPT",
          quantity,
          referenceType: "PURCHASE_ORDER",
          referenceId: order.id,
          performedBy: Number(user.id),
        });
      }
      if (order.supplierId) {
        await tx
          .update(suppliers)
          .set({ payable: sql`${suppliers.payable} + ${order.total}` })
          .where(eq(suppliers.id, order.supplierId));
      }
      await tx.insert(auditLogs).values({
        userId: Number(user.id),
        action: "RECEIVE",
        entityType: "PURCHASE_ORDER",
        entityId: String(order.id),
        summary: order.code,
      });
      return { success: true, orderId: order.id };
    });
  });
