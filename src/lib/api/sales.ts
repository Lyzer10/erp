import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { randomUUID } from "node:crypto";
import { and, asc, eq, gt, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import {
  auditLogs,
  customers,
  inventoryMovements,
  productBatches,
  products,
  saleItems,
  salePayments,
  sales,
} from "../../db/schema";
import { authenticateRequest } from "../auth";
import { calculateSaleTotals } from "../sale-calculations";
import { requireModuleAccess } from "../permissions";

const saleInput = z.object({
  customerId: z.number().int().positive().nullable().optional(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
  discount: z.number().int().min(0).default(0),
  taxRateBasisPoints: z.number().int().min(0).max(10000).default(1800),
  payments: z
    .array(
      z.object({
        method: z.enum(["cash", "mobile", "credit"]),
        amount: z.number().int().min(0),
        reference: z.string().trim().max(100).optional(),
      }),
    )
    .min(1),
});

function receiptNumber() {
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const suffix = randomUUID().slice(0, 8).toUpperCase();
  return `REC-${stamp}-${suffix}`;
}

export const createSaleFn = createServerFn({ method: "POST" })
  .validator(saleInput)
  .handler(async ({ data }) => {
    const user = await authenticateRequest(getRequest());
    if (!user) throw new Error("UNAUTHENTICATED");
    await requireModuleAccess(user, "pos");
    if (user.isTestUser) throw new Error("Demo checkout is not a persistent sale.");
    if (!["SuperAdmin", "Admin", "Pharmacist", "Cashier"].includes(user.role)) {
      throw new Error("Your role cannot post sales.");
    }

    const groupedItems = new Map<number, number>();
    for (const item of data.items) {
      groupedItems.set(item.productId, (groupedItems.get(item.productId) || 0) + item.quantity);
    }

    return db.transaction(async (tx) => {
      const pricedItems: Array<{
        productId: number;
        name: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
      }> = [];

      for (const [productId, quantity] of groupedItems) {
        const [product] = await tx
          .select()
          .from(products)
          .where(eq(products.id, productId))
          .limit(1);
        if (!product) throw new Error(`Product ${productId} was not found.`);
        if (product.price < 0) throw new Error(`${product.name} has an invalid selling price.`);
        pricedItems.push({
          productId,
          name: product.name,
          quantity,
          unitPrice: product.price,
          lineTotal: product.price * quantity,
        });
      }

      const subtotal = pricedItems.reduce((sum, item) => sum + item.lineTotal, 0);
      const { tax, total } = calculateSaleTotals(subtotal, data.discount, data.taxRateBasisPoints);
      const paid = data.payments.reduce((sum, payment) => sum + payment.amount, 0);
      if (paid !== total) throw new Error(`Payment total must equal TZS ${total}.`);
      if (data.payments.some((payment) => payment.method === "credit") && !data.customerId) {
        throw new Error("A customer is required for a credit sale.");
      }

      const [sale] = await tx
        .insert(sales)
        .values({
          receiptNumber: receiptNumber(),
          customerId: data.customerId || null,
          cashierId: Number(user.id),
          subtotal,
          discount: data.discount,
          tax,
          total,
        })
        .returning();

      for (const item of pricedItems) {
        const reserved = await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(and(eq(products.id, item.productId), gte(products.stock, item.quantity)))
          .returning({ id: products.id });
        if (reserved.length !== 1) throw new Error(`Insufficient stock for ${item.name}.`);

        const batches = await tx
          .select()
          .from(productBatches)
          .where(
            and(
              eq(productBatches.productId, item.productId),
              gt(productBatches.quantity, 0),
              gte(productBatches.expiryDate, new Date().toISOString().slice(0, 10)),
            ),
          )
          .orderBy(asc(productBatches.expiryDate), asc(productBatches.id));

        let remaining = item.quantity;
        if (batches.length > 0) {
          for (const batch of batches) {
            if (remaining === 0) break;
            const allocated = Math.min(remaining, batch.quantity);
            const updated = await tx
              .update(productBatches)
              .set({ quantity: sql`${productBatches.quantity} - ${allocated}` })
              .where(and(eq(productBatches.id, batch.id), gte(productBatches.quantity, allocated)))
              .returning({ id: productBatches.id });
            if (updated.length !== 1)
              throw new Error(`Stock changed while selling ${item.name}; retry the sale.`);

            await tx.insert(saleItems).values({
              saleId: sale.id,
              productId: item.productId,
              batchId: batch.id,
              quantity: allocated,
              unitPrice: item.unitPrice,
              lineTotal: item.unitPrice * allocated,
            });
            await tx.insert(inventoryMovements).values({
              productId: item.productId,
              batchId: batch.id,
              movementType: "SALE",
              quantity: -allocated,
              referenceType: "SALE",
              referenceId: sale.id,
              performedBy: Number(user.id),
            });
            remaining -= allocated;
          }
          if (remaining > 0)
            throw new Error(`No unexpired batch stock is available for ${item.name}.`);
        } else {
          await tx.insert(saleItems).values({
            saleId: sale.id,
            productId: item.productId,
            batchId: null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
          });
          await tx.insert(inventoryMovements).values({
            productId: item.productId,
            batchId: null,
            movementType: "SALE",
            quantity: -item.quantity,
            referenceType: "SALE",
            referenceId: sale.id,
            performedBy: Number(user.id),
          });
        }
      }

      await tx.insert(salePayments).values(
        data.payments.map((payment) => ({
          saleId: sale.id,
          method: payment.method,
          amount: payment.amount,
          reference: payment.reference || null,
        })),
      );

      if (data.customerId && data.payments.some((payment) => payment.method === "credit")) {
        await tx
          .update(customers)
          .set({ balance: sql`${customers.balance} + ${total}` })
          .where(eq(customers.id, data.customerId));
      }
      await tx.insert(auditLogs).values({
        userId: Number(user.id),
        action: "CREATE",
        entityType: "SALE",
        entityId: String(sale.id),
        summary: `${sale.receiptNumber}, TZS ${total}`,
      });

      return { ...sale, items: pricedItems };
    });
  });
