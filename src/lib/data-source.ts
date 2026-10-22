import { getRequest } from "@tanstack/react-start/server";
import { createServerOnlyFn } from "@tanstack/react-start";
import { db } from "../db";
import { customers, expenses, products, purchaseOrders, suppliers } from "../db/schema";
import { authenticateRequest, type AuthUser } from "./auth";

type Input = Record<string, unknown>;
type Collection<T> = { getAll: () => Promise<T[]>; create: (data: Input) => Promise<T> };
type ReadCollection<T> = { getAll: () => Promise<T[]> };

type Customer = typeof customers.$inferSelect;
type Supplier = typeof suppliers.$inferSelect;
type Product = typeof products.$inferSelect;
type Expense = typeof expenses.$inferSelect;
type PurchaseOrder = typeof purchaseOrders.$inferSelect;

export interface IERPRepository {
  isTestUser: false;
  user: AuthUser;
  customers: Collection<Customer>;
  suppliers: Collection<Supplier>;
  products: Collection<Product>;
  expenses: Collection<Expense>;
  purchaseOrders: ReadCollection<PurchaseOrder>;
}

const text = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);
const integer = (value: unknown, fallback = 0) =>
  Number.isSafeInteger(Number(value)) ? Number(value) : fallback;

class PostgresRepository implements IERPRepository {
  isTestUser = false as const;
  constructor(public user: AuthUser) {}
  customers: Collection<Customer> = {
    getAll: async () => db.select().from(customers),
    create: async (data) => {
      const [row] = await db
        .insert(customers)
        .values({
          code: text(data.code, `CUS-${Date.now()}`),
          name: text(data.name),
          contact: text(data.contact),
          email: text(data.email),
          phone: text(data.phone),
          balance: integer(data.balance),
          status: text(data.status, "Active"),
        })
        .returning();
      return row;
    },
  };
  suppliers: Collection<Supplier> = {
    getAll: async () => db.select().from(suppliers),
    create: async (data) => {
      const [row] = await db
        .insert(suppliers)
        .values({
          code: text(data.code, `SUP-${Date.now()}`),
          name: text(data.name),
          contact: text(data.contact),
          email: text(data.email),
          phone: text(data.phone),
          payable: integer(data.payable),
          status: text(data.status, "Active"),
        })
        .returning();
      return row;
    },
  };
  products: Collection<Product> = {
    getAll: async () => db.select().from(products),
    create: async (data) => {
      const [row] = await db
        .insert(products)
        .values({
          sku: text(data.sku, `SKU-${Date.now()}`),
          name: text(data.name),
          category: text(data.category, "General"),
          brand: text(data.brand) || null,
          genericName: text(data.genericName) || null,
          dosageForm: text(data.dosageForm) || null,
          strength: text(data.strength) || null,
          barcode: text(data.barcode) || null,
          purchaseUnit: text(data.purchaseUnit, "piece"),
          sellingUnit: text(data.sellingUnit, "piece"),
          unitsPerPurchaseUnit: integer(data.unitsPerPurchaseUnit, 1),
          requiresPrescription: Boolean(data.requiresPrescription),
          price: integer(data.price),
          cost: integer(data.cost),
          stock: integer(data.stock),
          reorder: integer(data.reorder, 10),
          image: text(data.image) || null,
        })
        .returning();
      return row;
    },
  };
  expenses: Collection<Expense> = {
    getAll: async () => db.select().from(expenses),
    create: async (data) => {
      const [row] = await db
        .insert(expenses)
        .values({
          code: text(data.code, `EXP-${Date.now()}`),
          category: text(data.category),
          vendor: text(data.vendor),
          date: text(data.date, new Date().toISOString().slice(0, 10)),
          amount: integer(data.amount),
          status: text(data.status, "Pending"),
        })
        .returning();
      return row;
    },
  };
  purchaseOrders = { getAll: async () => db.select().from(purchaseOrders) };
}

export const resolveDataSource = createServerOnlyFn(
  async (request?: Request): Promise<IERPRepository> => {
    const req = request || getRequest();
    const user = await authenticateRequest(req);
    if (!user) throw new Error("UNAUTHENTICATED");
    if (user.isTestUser) throw new Error("Demo accounts are disabled.");
    return new PostgresRepository(user);
  },
);
