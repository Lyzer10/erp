import { authenticateRequest, AuthUser } from "./auth";
import { sessionStoreManager, SessionMockDataStore } from "./mock";
import { getRequest } from "@tanstack/react-start/server";
import { db } from "../db";
import { customers, suppliers, products, invoices, expenses, staff, payrollRuns, transactions, purchaseOrders } from "../db/schema";
import { eq } from "drizzle-orm";

export interface IERPRepository {
  isTestUser: boolean;
  user: AuthUser | null;
  resetDemoData: () => Promise<{ success: boolean; message: string }>;
  customers: {
    getAll: () => Promise<any[]>;
    create: (data: any) => Promise<any>;
  };
  suppliers: {
    getAll: () => Promise<any[]>;
    create: (data: any) => Promise<any>;
  };
  products: {
    getAll: () => Promise<any[]>;
    create: (data: any) => Promise<any>;
  };
  invoices: {
    getAll: () => Promise<any[]>;
    create: (data: any) => Promise<any>;
  };
  expenses: {
    getAll: () => Promise<any[]>;
    create: (data: any) => Promise<any>;
  };
  staff: {
    getAll: () => Promise<any[]>;
    create: (data: any) => Promise<any>;
  };
  payroll: {
    getAll: () => Promise<any[]>;
  };
  transactions: {
    getAll: () => Promise<any[]>;
  };
  purchaseOrders: {
    getAll: () => Promise<any[]>;
  };
  stores: {
    getAll: () => Promise<any[]>;
  };
  transfers: {
    getAll: () => Promise<any[]>;
  };
  leaveRequests: {
    getAll: () => Promise<any[]>;
  };
  chartOfAccounts: {
    getAll: () => Promise<any[]>;
  };
  paymentVouchers: {
    getAll: () => Promise<any[]>;
  };
  reconciliations: {
    getAll: () => Promise<any[]>;
  };
  usersList: {
    getAll: () => Promise<any[]>;
  };
  settings: {
    get: () => Promise<any>;
  };
}

class MockDataSourceRepository implements IERPRepository {
  isTestUser = true;
  user: AuthUser | null;

  constructor(user: AuthUser | null) {
    this.user = user;
  }

  private get store(): SessionMockDataStore {
    const sessionId = this.user?.sessionId || "default-session";
    return sessionStoreManager.getStore(sessionId);
  }

  resetDemoData = async () => {
    const sessionId = this.user?.sessionId || "default-session";
    sessionStoreManager.resetStore(sessionId);
    return { success: true, message: `Demo session ${sessionId} data has been reset to pristine seed state.` };
  };

  customers = {
    getAll: async () => this.store.getCustomers(),
    create: async (data: any) => this.store.createCustomer(data),
  };

  suppliers = {
    getAll: async () => this.store.getSuppliers(),
    create: async (data: any) => this.store.createSupplier(data),
  };

  products = {
    getAll: async () => this.store.getProducts(),
    create: async (data: any) => this.store.createProduct(data),
  };

  invoices = {
    getAll: async () => this.store.getInvoices(),
    create: async (data: any) => this.store.createInvoice(data),
  };

  expenses = {
    getAll: async () => this.store.getExpenses(),
    create: async (data: any) => this.store.createExpense(data),
  };

  staff = {
    getAll: async () => this.store.getStaff(),
    create: async (data: any) => this.store.createStaff(data),
  };

  payroll = {
    getAll: async () => this.store.getPayrollRuns(),
  };

  transactions = {
    getAll: async () => this.store.getTransactions(),
  };

  purchaseOrders = {
    getAll: async () => this.store.getPurchaseOrders(),
  };

  stores = {
    getAll: async () => this.store.getStores(),
  };

  transfers = {
    getAll: async () => this.store.getTransfers(),
  };

  leaveRequests = {
    getAll: async () => this.store.getLeaveRequests(),
  };

  chartOfAccounts = {
    getAll: async () => this.store.getChartOfAccounts(),
  };

  paymentVouchers = {
    getAll: async () => this.store.getPaymentVouchers(),
  };

  reconciliations = {
    getAll: async () => this.store.getReconciliations(),
  };

  usersList = {
    getAll: async () => this.store.getUsersList(),
  };

  settings = {
    get: async () => this.store.getSettings(),
  };
}

class PostgresDataSourceRepository implements IERPRepository {
  isTestUser = false;
  user: AuthUser | null;

  constructor(user: AuthUser | null) {
    this.user = user;
  }

  resetDemoData = async () => {
    return { success: false, message: "Reset demo data is not available for real production database users." };
  };

  customers = {
    getAll: async () => db.select().from(customers).catch(() => []),
    create: async (data: any) =>
      db
        .insert(customers)
        .values({
          code: data.code || `CUS-${Date.now().toString().slice(-4)}`,
          name: data.name,
          contact: data.contact || "",
          email: data.email || "",
          phone: data.phone || "",
          balance: data.balance || 0,
          status: data.status || "Active",
        })
        .returning()
        .catch(() => ({ ...data, id: Date.now() })),
  };

  suppliers = {
    getAll: async () => db.select().from(suppliers).catch(() => []),
    create: async (data: any) =>
      db
        .insert(suppliers)
        .values({
          code: data.code || `SUP-${Date.now().toString().slice(-4)}`,
          name: data.name,
          contact: data.contact || "",
          email: data.email || "",
          phone: data.phone || "",
          payable: data.payable || 0,
          status: data.status || "Active",
        })
        .returning()
        .catch(() => ({ ...data, id: Date.now() })),
  };

  products = {
    getAll: async () => db.select().from(products).catch(() => []),
    create: async (data: any) =>
      db
        .insert(products)
        .values({
          sku: data.sku || `SKU-${Date.now().toString().slice(-4)}`,
          name: data.name,
          category: data.category || "General",
          brand: data.brand || "",
          price: Number(data.price) || 0,
          cost: Number(data.cost) || 0,
          stock: Number(data.stock) || 0,
          reorder: Number(data.reorder) || 50,
          image: data.image || "",
        })
        .returning()
        .catch(() => ({ ...data, id: Date.now() })),
  };

  invoices = {
    getAll: async () => db.select().from(invoices).catch(() => []),
    create: async (data: any) =>
      db
        .insert(invoices)
        .values({
          code: data.code || `INV-${Date.now().toString().slice(-4)}`,
          customer: data.customer,
          date: data.date || new Date().toISOString().slice(0, 10),
          due: data.due || new Date().toISOString().slice(0, 10),
          amount: Number(data.amount) || 0,
          status: data.status || "Pending",
          type: data.type || "Invoice",
        })
        .returning()
        .catch(() => ({ ...data, id: Date.now() })),
  };

  expenses = {
    getAll: async () => db.select().from(expenses).catch(() => []),
    create: async (data: any) =>
      db
        .insert(expenses)
        .values({
          code: data.code || `EXP-${Date.now().toString().slice(-4)}`,
          category: data.category,
          vendor: data.vendor,
          date: data.date || new Date().toISOString().slice(0, 10),
          amount: Number(data.amount) || 0,
          status: data.status || "Pending",
        })
        .returning()
        .catch(() => ({ ...data, id: Date.now() })),
  };

  staff = {
    getAll: async () => db.select().from(staff).catch(() => []),
    create: async (data: any) =>
      db
        .insert(staff)
        .values({
          code: data.code || `EMP-${Date.now().toString().slice(-4)}`,
          name: data.name,
          department: data.department,
          role: data.role,
          salary: Number(data.salary) || 0,
          status: data.status || "Active",
          joined: data.joined || new Date().toISOString().slice(0, 10),
        })
        .returning()
        .catch(() => ({ ...data, id: Date.now() })),
  };

  payroll = {
    getAll: async () => db.select().from(payrollRuns).catch(() => []),
  };

  transactions = {
    getAll: async () => db.select().from(transactions).catch(() => []),
  };

  purchaseOrders = {
    getAll: async () => db.select().from(purchaseOrders).catch(() => []),
  };

  stores = {
    getAll: async () => [],
  };

  transfers = {
    getAll: async () => [],
  };

  leaveRequests = {
    getAll: async () => [],
  };

  chartOfAccounts = {
    getAll: async () => [],
  };

  paymentVouchers = {
    getAll: async () => [],
  };

  reconciliations = {
    getAll: async () => [],
  };

  usersList = {
    getAll: async () => [],
  };

  settings = {
    get: async () => ({ companyName: "Real Enterprise", currency: "TZS" }),
  };
}

export async function resolveDataSource(req?: Request): Promise<IERPRepository> {
  let requestObj: Request | null = req || null;
  if (!requestObj) {
    try {
      requestObj = getRequest();
    } catch (e) {
      // Executed outside HTTP server context
    }
  }

  const user = requestObj ? await authenticateRequest(requestObj) : null;

  if (user && user.isTestUser) {
    return new MockDataSourceRepository(user);
  }

  return new PostgresDataSourceRepository(user);
}
