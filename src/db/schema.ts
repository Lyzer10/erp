import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  timestamp,
  date,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  isTestUser: boolean("is_test_user").default(false).notNull(),
  role: text("role").default("User").notNull(),
  status: text("status").default("Active").notNull(),
  department: text("department"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roleModulePermissions = pgTable(
  "role_module_permissions",
  {
    id: serial("id").primaryKey(),
    role: text("role").notNull(),
    module: text("module").notNull(),
    enabled: boolean("enabled").default(true).notNull(),
    updatedBy: integer("updated_by").references(() => users.id),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("role_module_permissions_role_module_unique").on(table.role, table.module)],
);

export const userModulePermissions = pgTable(
  "user_module_permissions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    module: text("module").notNull(),
    enabled: boolean("enabled").notNull(),
    updatedBy: integer("updated_by").references(() => users.id),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("user_module_permissions_user_module_unique").on(table.userId, table.module)],
);

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  contact: text("contact"),
  email: text("email"),
  phone: text("phone"),
  balance: integer("balance").default(0).notNull(),
  status: text("status").default("Active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  contact: text("contact"),
  email: text("email"),
  phone: text("phone"),
  payable: integer("payable").default(0).notNull(),
  status: text("status").default("Active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  brand: text("brand"),
  genericName: text("generic_name"),
  dosageForm: text("dosage_form"),
  strength: text("strength"),
  barcode: text("barcode").unique(),
  purchaseUnit: text("purchase_unit").default("piece").notNull(),
  sellingUnit: text("selling_unit").default("piece").notNull(),
  unitsPerPurchaseUnit: integer("units_per_purchase_unit").default(1).notNull(),
  requiresPrescription: boolean("requires_prescription").default(false).notNull(),
  price: integer("price").notNull(),
  cost: integer("cost").notNull(),
  stock: integer("stock").default(0).notNull(),
  reorder: integer("reorder").default(50).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productBatches = pgTable(
  "product_batches",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    batchNumber: text("batch_number").notNull(),
    expiryDate: date("expiry_date").notNull(),
    quantity: integer("quantity").default(0).notNull(),
    unitCost: integer("unit_cost").notNull(),
    receivedAt: timestamp("received_at").defaultNow().notNull(),
  },
  (table) => [
    index("product_batches_product_expiry_idx").on(table.productId, table.expiryDate),
    uniqueIndex("product_batches_product_batch_unique").on(table.productId, table.batchNumber),
  ],
);

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  receiptNumber: text("receipt_number").notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id),
  cashierId: integer("cashier_id")
    .notNull()
    .references(() => users.id),
  subtotal: integer("subtotal").notNull(),
  discount: integer("discount").default(0).notNull(),
  tax: integer("tax").default(0).notNull(),
  total: integer("total").notNull(),
  status: text("status").default("Completed").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const saleItems = pgTable("sale_items", {
  id: serial("id").primaryKey(),
  saleId: integer("sale_id")
    .notNull()
    .references(() => sales.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  batchId: integer("batch_id").references(() => productBatches.id),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
  lineTotal: integer("line_total").notNull(),
});

export const salePayments = pgTable("sale_payments", {
  id: serial("id").primaryKey(),
  saleId: integer("sale_id")
    .notNull()
    .references(() => sales.id),
  method: text("method").notNull(),
  amount: integer("amount").notNull(),
  reference: text("reference"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inventoryMovements = pgTable(
  "inventory_movements",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    batchId: integer("batch_id").references(() => productBatches.id),
    movementType: text("movement_type").notNull(),
    quantity: integer("quantity").notNull(),
    referenceType: text("reference_type").notNull(),
    referenceId: integer("reference_id").notNull(),
    performedBy: integer("performed_by")
      .notNull()
      .references(() => users.id),
    reason: text("reason"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("inventory_movements_product_created_idx").on(table.productId, table.createdAt),
  ],
);

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  customer: text("customer").notNull(),
  date: text("date").notNull(),
  due: text("due").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").default("Pending").notNull(),
  type: text("type").default("Invoice").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  category: text("category").notNull(),
  vendor: text("vendor").notNull(),
  date: text("date").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").default("Pending").notNull(),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  department: text("department").notNull(),
  role: text("role").notNull(),
  salary: integer("salary").notNull(),
  status: text("status").default("Active").notNull(),
  joined: text("joined"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  date: text("date").notNull(),
  account: text("account").notNull(),
  description: text("description").notNull(),
  debit: integer("debit").default(0).notNull(),
  credit: integer("credit").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const purchaseOrders = pgTable("purchase_orders", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  supplier: text("supplier").notNull(),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  date: text("date").notNull(),
  items: integer("items").default(1).notNull(),
  total: integer("total").notNull(),
  status: text("status").default("Pending").notNull(),
  notes: text("notes"),
  createdBy: integer("created_by").references(() => users.id),
  receivedAt: timestamp("received_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const purchaseOrderItems = pgTable("purchase_order_items", {
  id: serial("id").primaryKey(),
  purchaseOrderId: integer("purchase_order_id")
    .notNull()
    .references(() => purchaseOrders.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitCost: integer("unit_cost").notNull(),
  batchNumber: text("batch_number"),
  expiryDate: date("expiry_date"),
  receivedQuantity: integer("received_quantity").default(0).notNull(),
});

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    summary: text("summary").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("audit_logs_created_idx").on(table.createdAt)],
);

export const businessSettings = pgTable("business_settings", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  tin: text("tin"),
  vrn: text("vrn"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  currency: text("currency").default("TZS").notNull(),
  taxRateBasisPoints: integer("tax_rate_basis_points").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const payrollRuns = pgTable("payroll_runs", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  period: text("period").notNull(),
  employees: integer("employees").notNull(),
  gross: integer("gross").notNull(),
  net: integer("net").notNull(),
  status: text("status").default("Completed").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
