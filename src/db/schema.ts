import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  isTestUser: boolean("is_test_user").default(false).notNull(),
  role: text("role").default("User").notNull(),
  department: text("department"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
  price: integer("price").notNull(),
  cost: integer("cost").notNull(),
  stock: integer("stock").default(0).notNull(),
  reorder: integer("reorder").default(50).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
  date: text("date").notNull(),
  items: integer("items").default(1).notNull(),
  total: integer("total").notNull(),
  status: text("status").default("Pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
