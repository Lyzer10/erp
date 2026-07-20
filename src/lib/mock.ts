// Mock data helpers and session-isolated in-memory state store for DeveleERP.

export const currency = (n: number) =>
  "TZS " + new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

export const num = (n: number) => new Intl.NumberFormat("en-US").format(n);

const firstNames = ["Aisha", "John", "Maria", "David", "Linda", "James", "Sara", "Mohammed", "Grace", "Peter", "Anita", "Samuel", "Joyce", "Brian", "Lucy", "Daniel", "Esther", "Kevin"];
const lastNames = ["Otieno", "Mwangi", "Smith", "Kumar", "Achieng", "Wanjiru", "Khan", "Banda", "Mensah", "Adebayo", "Hassan", "Njoroge", "Owusu", "Chen", "Garcia", "Patel"];
const companies = ["Acme Trading Ltd", "Skyline Holdings", "Bluepeak Industries", "Greenfield Co.", "Harbor Logistics", "Quantum Foods", "Nimbus Tech", "Orion Supplies", "Cobalt Hardware", "Vertex Mfg", "Kestrel Group", "Atlas Distributors"];

let _id = 1000;
export const id = (prefix = "ID") => `${prefix}-${++_id}`;

export const initialCustomers = Array.from({ length: 24 }, (_, i) => ({
  id: `CUS-${1000 + i}`,
  name: companies[i % companies.length],
  contact: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
  email: `contact${i}@${companies[i % companies.length].toLowerCase().replace(/[^a-z]/g, "")}.com`,
  phone: `+255 7${(10000000 + i * 137) % 100000000}`,
  balance: Math.round(Math.random() * 5000000 - 1000000),
  status: ["Active", "Active", "Active", "On Hold"][i % 4],
  createdAt: new Date(Date.now() - i * 86400000 * 7).toISOString().slice(0, 10),
}));

export const initialSuppliers = Array.from({ length: 18 }, (_, i) => ({
  id: `SUP-${2000 + i}`,
  name: companies[(i + 3) % companies.length] + " Suppliers",
  contact: `${firstNames[(i + 2) % firstNames.length]} ${lastNames[(i + 2) % lastNames.length]}`,
  email: `vendor${i}@supply.com`,
  phone: `+255 7${(20000000 + i * 213) % 100000000}`,
  payable: Math.round(Math.random() * 8000000),
  status: ["Active", "Active", "Inactive"][i % 3],
}));

export const initialProducts = Array.from({ length: 30 }, (_, i) => {
  const names = [
    "Premium Coffee 1kg", "Organic Sugar 2kg", "Hand Sanitizer 500ml", "LED Bulb 9W", "Office Chair", 
    "A4 Paper Ream", "Cooking Oil 5L", "Detergent 1L", "Mineral Water 500ml", "Toothpaste 100g"
  ];
  const name = names[i % names.length];
  
  const prices = [15000, 6000, 8500, 5000, 185000, 12000, 32000, 7500, 1000, 3500];
  const costs = [11000, 4800, 6000, 3500, 140000, 9000, 25000, 5000, 600, 2500];
  
  const images = [
    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1550985616-10810253b84d?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1608885898957-a599fb1b1a44?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1559591937-e620a32d6677?w=500&auto=format&fit=crop&q=60",
  ];
  
  return {
    id: `PRD-${3000 + i}`,
    name,
    sku: `SKU-${4000 + i}`,
    category: ["Beverages", "Groceries", "Household", "Electronics", "Furniture", "Stationery"][i % 6],
    brand: ["Brava", "Northstar", "Helios", "Verde", "Apex"][i % 5],
    price: prices[i % prices.length],
    cost: costs[i % costs.length],
    stock: Math.floor(Math.random() * 500),
    reorder: 50,
    image: images[i % images.length],
  };
});

export const initialInvoices = Array.from({ length: 40 }, (_, i) => ({
  id: `INV-${5000 + i}`,
  customer: initialCustomers[i % initialCustomers.length].name,
  date: new Date(Date.now() - i * 86400000 * 2).toISOString().slice(0, 10),
  due: new Date(Date.now() - i * 86400000 * 2 + 14 * 86400000).toISOString().slice(0, 10),
  amount: Math.round(Math.random() * 2500000 + 50000),
  status: ["Paid", "Pending", "Overdue", "Partial", "Draft"][i % 5],
  type: ["Invoice", "Proforma", "Credit Note", "Cash Sale"][i % 4],
}));

export const initialExpenses = Array.from({ length: 20 }, (_, i) => ({
  id: `EXP-${6000 + i}`,
  category: ["Rent", "Utilities", "Salaries", "Marketing", "Travel", "Office Supplies"][i % 6],
  vendor: companies[i % companies.length],
  date: new Date(Date.now() - i * 86400000 * 3).toISOString().slice(0, 10),
  amount: Math.round(Math.random() * 800000 + 20000),
  status: ["Approved", "Pending", "Rejected"][i % 3],
}));

export const initialStaff = Array.from({ length: 22 }, (_, i) => ({
  id: `EMP-${7000 + i}`,
  name: `${firstNames[i % firstNames.length]} ${lastNames[(i + 1) % lastNames.length]}`,
  department: ["Sales", "Finance", "HR", "Operations", "IT", "Warehouse"][i % 6],
  role: ["Manager", "Officer", "Assistant", "Lead", "Analyst"][i % 5],
  salary: Math.round(Math.random() * 1500000 + 400000),
  status: ["Active", "Active", "On Leave"][i % 3],
  joined: new Date(Date.now() - i * 86400000 * 60).toISOString().slice(0, 10),
}));

export const initialTransactions = Array.from({ length: 30 }, (_, i) => ({
  id: `TXN-${8000 + i}`,
  date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
  account: ["Cash", "Bank - Equity", "Bank - CRDB", "Sales", "Expenses", "Receivables"][i % 6],
  description: ["Customer payment", "Supplier payment", "Bank transfer", "Office supplies", "Salary disbursement", "Utilities"][i % 6],
  debit: i % 2 === 0 ? Math.round(Math.random() * 500000) : 0,
  credit: i % 2 === 1 ? Math.round(Math.random() * 500000) : 0,
}));

export const initialPurchaseOrders = Array.from({ length: 18 }, (_, i) => ({
  id: `LPO-${9000 + i}`,
  supplier: initialSuppliers[i % initialSuppliers.length].name,
  date: new Date(Date.now() - i * 86400000 * 4).toISOString().slice(0, 10),
  items: Math.floor(Math.random() * 8 + 1),
  total: Math.round(Math.random() * 5000000 + 50000),
  status: ["Pending", "Approved", "Rejected", "Approved"][i % 4],
}));

export const initialPayrollRuns = Array.from({ length: 12 }, (_, i) => ({
  id: `PR-${10000 + i}`,
  period: new Date(2026, 5 - i, 1).toLocaleString("en", { month: "long", year: "numeric" }),
  employees: 22,
  gross: 9250000 + i * 120000,
  net: 7840000 + i * 110000,
  status: ["Completed", "Approved", "Prepared", "Rejected"][i % 4],
}));

export const initialStores = [
  { code: "ST-01", name: "Main Warehouse", location: "Industrial Area", manager: "John Mwangi", items: 1240 },
  { code: "ST-02", name: "Westlands Store", location: "Westlands", manager: "Maria Banda", items: 580 },
  { code: "ST-03", name: "Mombasa Outlet", location: "Mombasa", manager: "David Kumar", items: 412 },
  { code: "ST-04", name: "Kisumu Depot", location: "Kisumu", manager: "Grace Mensah", items: 298 },
];

export const initialTransfers = [
  { id: "TRF-100", fromStore: "Main Warehouse", toStore: "Westlands Store", item: "Premium Coffee 1kg", qty: 50, date: "2026-07-18", status: "Completed" },
  { id: "TRF-101", fromStore: "Main Warehouse", toStore: "Mombasa Outlet", item: "Organic Sugar 2kg", qty: 100, date: "2026-07-19", status: "In Transit" },
];

export const initialLeaveRequests = Array.from({ length: 12 }, (_, i) => ({
  id: `LV-${500 + i}`,
  employee: ["John Mwangi", "Maria Banda", "David Kumar", "Aisha Otieno", "Peter Smith"][i % 5],
  type: ["Annual", "Sick", "Compassionate", "Maternity"][i % 4],
  from: `2026-06-${String(i + 1).padStart(2, "0")}`,
  days: 2 + (i % 5),
  status: ["Pending", "Approved", "Rejected"][i % 3],
}));

export const initialChartOfAccounts = [
  { code: "1000", name: "Assets", category: "Asset", balance: 15400000 },
  { code: "2000", name: "Liabilities", category: "Liability", balance: 4200000 },
  { code: "3000", name: "Equity", category: "Equity", balance: 11200000 },
  { code: "4000", name: "Revenue", category: "Income", balance: 28500000 },
  { code: "5000", name: "Cost of Goods Sold", category: "Expense", balance: 14200000 },
];

export const initialPaymentVouchers = [
  { id: "PV-900", payee: "Skyline Holdings", amount: 450000, category: "Supplies", date: "2026-07-15", status: "Approved" },
  { id: "PV-901", payee: "Tanesco Power", amount: 120000, category: "Utilities", date: "2026-07-16", status: "Pending" },
];

export const initialReconciliations = [
  { id: "REC-300", account: "CRDB Bank", statementBalance: 12500000, ledgerBalance: 12500000, difference: 0, status: "Reconciled" },
  { id: "REC-301", account: "NMB Bank", statementBalance: 4800000, ledgerBalance: 5000000, difference: -200000, status: "Pending" },
];

export const initialUsersList = [
  { id: "U-1000", name: "Erick Demo", email: "demo@devele.co", role: "SuperAdmin", department: "All", status: "Active", isTestUser: true },
  { id: "U-1001", name: "John Mwangi", email: "john@devele.co", role: "Manager", department: "Sales", status: "Active", isTestUser: false },
  { id: "U-1002", name: "Maria Banda", email: "maria@devele.co", role: "Cashier", department: "Finance", status: "Active", isTestUser: false },
];

export const initialSettings = {
  companyName: "DeveleERP Ltd",
  currency: "TZS",
  taxRate: 18,
  fiscalYearStart: "January",
  theme: "Light",
};

// Direct exports for UI mock display fallbacks
export const customers = [...initialCustomers];
export const suppliers = [...initialSuppliers];
export const products = [...initialProducts];
export const invoices = [...initialInvoices];
export const expenses = [...initialExpenses];
export const staff = [...initialStaff];
export const transactions = [...initialTransactions];
export const purchaseOrders = [...initialPurchaseOrders];
export const payrollRuns = [...initialPayrollRuns];

// SESSION-SCOPED IN-MEMORY DATA STORE WITH LAST ACCESSED TIMESTAMP
export class SessionMockDataStore {
  sessionId: string = "";
  lastAccessedAt: number = Date.now();
  customers: any[] = [];
  suppliers: any[] = [];
  products: any[] = [];
  invoices: any[] = [];
  expenses: any[] = [];
  staff: any[] = [];
  transactions: any[] = [];
  purchaseOrders: any[] = [];
  payrollRuns: any[] = [];
  stores: any[] = [];
  transfers: any[] = [];
  leaveRequests: any[] = [];
  chartOfAccounts: any[] = [];
  paymentVouchers: any[] = [];
  reconciliations: any[] = [];
  usersList: any[] = [];
  settings: any = {};

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.lastAccessedAt = Date.now();
    this.reset();
  }

  touch() {
    this.lastAccessedAt = Date.now();
  }

  reset() {
    this.touch();
    this.customers = JSON.parse(JSON.stringify(initialCustomers));
    this.suppliers = JSON.parse(JSON.stringify(initialSuppliers));
    this.products = JSON.parse(JSON.stringify(initialProducts));
    this.invoices = JSON.parse(JSON.stringify(initialInvoices));
    this.expenses = JSON.parse(JSON.stringify(initialExpenses));
    this.staff = JSON.parse(JSON.stringify(initialStaff));
    this.transactions = JSON.parse(JSON.stringify(initialTransactions));
    this.purchaseOrders = JSON.parse(JSON.stringify(initialPurchaseOrders));
    this.payrollRuns = JSON.parse(JSON.stringify(initialPayrollRuns));
    this.stores = JSON.parse(JSON.stringify(initialStores));
    this.transfers = JSON.parse(JSON.stringify(initialTransfers));
    this.leaveRequests = JSON.parse(JSON.stringify(initialLeaveRequests));
    this.chartOfAccounts = JSON.parse(JSON.stringify(initialChartOfAccounts));
    this.paymentVouchers = JSON.parse(JSON.stringify(initialPaymentVouchers));
    this.reconciliations = JSON.parse(JSON.stringify(initialReconciliations));
    this.usersList = JSON.parse(JSON.stringify(initialUsersList));
    this.settings = JSON.parse(JSON.stringify(initialSettings));
  }

  getCustomers() { this.touch(); return [...this.customers]; }
  createCustomer(c: any) {
    this.touch();
    const newC = { id: id("CUS"), balance: 0, status: "Active", createdAt: new Date().toISOString().slice(0, 10), ...c };
    this.customers.unshift(newC);
    return newC;
  }

  getSuppliers() { this.touch(); return [...this.suppliers]; }
  createSupplier(s: any) {
    this.touch();
    const newS = { id: id("SUP"), payable: 0, status: "Active", ...s };
    this.suppliers.unshift(newS);
    return newS;
  }

  getProducts() { this.touch(); return [...this.products]; }
  createProduct(p: any) {
    this.touch();
    const newP = { id: id("PRD"), sku: id("SKU"), stock: 100, reorder: 20, ...p };
    this.products.unshift(newP);
    return newP;
  }

  getInvoices() { this.touch(); return [...this.invoices]; }
  createInvoice(inv: any) {
    this.touch();
    const newInv = { id: id("INV"), date: new Date().toISOString().slice(0, 10), status: "Pending", ...inv };
    this.invoices.unshift(newInv);
    return newInv;
  }

  getExpenses() { this.touch(); return [...this.expenses]; }
  createExpense(exp: any) {
    this.touch();
    const newExp = { id: id("EXP"), date: new Date().toISOString().slice(0, 10), status: "Approved", ...exp };
    this.expenses.unshift(newExp);
    return newExp;
  }

  getStaff() { this.touch(); return [...this.staff]; }
  createStaff(emp: any) {
    this.touch();
    const newEmp = { id: id("EMP"), status: "Active", joined: new Date().toISOString().slice(0, 10), ...emp };
    this.staff.unshift(newEmp);
    return newEmp;
  }

  getPayrollRuns() { this.touch(); return [...this.payrollRuns]; }
  getTransactions() { this.touch(); return [...this.transactions]; }
  getPurchaseOrders() { this.touch(); return [...this.purchaseOrders]; }
  getStores() { this.touch(); return [...this.stores]; }
  getTransfers() { this.touch(); return [...this.transfers]; }
  getLeaveRequests() { this.touch(); return [...this.leaveRequests]; }
  getChartOfAccounts() { this.touch(); return [...this.chartOfAccounts]; }
  getPaymentVouchers() { this.touch(); return [...this.paymentVouchers]; }
  getReconciliations() { this.touch(); return [...this.reconciliations]; }
  getUsersList() { this.touch(); return [...this.usersList]; }
  getSettings() { this.touch(); return { ...this.settings }; }
}

// SESSION STORE MANAGER WITH TTL EVICTION & CLEANUP TIMER
class SessionStoreManager {
  private stores = new Map<string, SessionMockDataStore>();
  private readonly ttlMs = 2 * 60 * 60 * 1000; // 2 hours TTL
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.cleanupInterval = setInterval(() => this.cleanupStaleSessions(), 15 * 60 * 1000);
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  getStore(sessionId: string): SessionMockDataStore {
    const key = sessionId || "default-demo-session";
    if (!this.stores.has(key)) {
      this.stores.set(key, new SessionMockDataStore(key));
    }
    const store = this.stores.get(key)!;
    store.touch();
    return store;
  }

  resetStore(sessionId: string): SessionMockDataStore {
    const store = this.getStore(sessionId);
    store.reset();
    return store;
  }

  destroyStore(sessionId: string): boolean {
    const key = sessionId || "default-demo-session";
    return this.stores.delete(key);
  }

  cleanupStaleSessions(customTtlMs?: number): number {
    const threshold = Date.now() - (customTtlMs !== undefined ? customTtlMs : this.ttlMs);
    let evictedCount = 0;

    for (const [key, store] of this.stores.entries()) {
      if (store.lastAccessedAt <= threshold) {
        this.stores.delete(key);
        evictedCount++;
      }
    }
    return evictedCount;
  }

  getActiveSessionsCount(): number {
    return this.stores.size;
  }

  hasStore(sessionId: string): boolean {
    return this.stores.has(sessionId);
  }
}

export const sessionStoreManager = new SessionStoreManager();
