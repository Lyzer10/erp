// Mock data helpers for the ERP frontend (no backend).

export const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export const num = (n: number) => new Intl.NumberFormat("en-US").format(n);

const firstNames = ["Aisha", "John", "Maria", "David", "Linda", "James", "Sara", "Mohammed", "Grace", "Peter", "Anita", "Samuel", "Joyce", "Brian", "Lucy", "Daniel", "Esther", "Kevin"];
const lastNames = ["Otieno", "Mwangi", "Smith", "Kumar", "Achieng", "Wanjiru", "Khan", "Banda", "Mensah", "Adebayo", "Hassan", "Njoroge", "Owusu", "Chen", "Garcia", "Patel"];
const companies = ["Acme Trading Ltd", "Skyline Holdings", "Bluepeak Industries", "Greenfield Co.", "Harbor Logistics", "Quantum Foods", "Nimbus Tech", "Orion Supplies", "Cobalt Hardware", "Vertex Mfg", "Kestrel Group", "Atlas Distributors"];

let _id = 1000;
export const id = (prefix = "ID") => `${prefix}-${++_id}`;

export const customers = Array.from({ length: 24 }, (_, i) => ({
  id: `CUS-${1000 + i}`,
  name: companies[i % companies.length],
  contact: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
  email: `contact${i}@${companies[i % companies.length].toLowerCase().replace(/[^a-z]/g, "")}.com`,
  phone: `+254 7${(10000000 + i * 137) % 100000000}`,
  balance: Math.round(Math.random() * 50000 - 10000),
  status: ["Active", "Active", "Active", "On Hold"][i % 4],
  createdAt: new Date(Date.now() - i * 86400000 * 7).toISOString().slice(0, 10),
}));

export const suppliers = Array.from({ length: 18 }, (_, i) => ({
  id: `SUP-${2000 + i}`,
  name: companies[(i + 3) % companies.length] + " Suppliers",
  contact: `${firstNames[(i + 2) % firstNames.length]} ${lastNames[(i + 2) % lastNames.length]}`,
  email: `vendor${i}@supply.com`,
  phone: `+254 7${(20000000 + i * 213) % 100000000}`,
  payable: Math.round(Math.random() * 80000),
  status: ["Active", "Active", "Inactive"][i % 3],
}));

export const products = Array.from({ length: 30 }, (_, i) => ({
  id: `PRD-${3000 + i}`,
  name: ["Premium Coffee 1kg", "Organic Sugar 2kg", "Hand Sanitizer 500ml", "LED Bulb 9W", "Office Chair", "A4 Paper Ream", "Cooking Oil 5L", "Detergent 1L", "Mineral Water 500ml", "Toothpaste 100g"][i % 10],
  sku: `SKU-${4000 + i}`,
  category: ["Beverages", "Groceries", "Household", "Electronics", "Furniture", "Stationery"][i % 6],
  brand: ["Brava", "Northstar", "Helios", "Verde", "Apex"][i % 5],
  price: Math.round((Math.random() * 200 + 10) * 100) / 100,
  cost: Math.round((Math.random() * 100 + 5) * 100) / 100,
  stock: Math.floor(Math.random() * 500),
  reorder: 50,
}));

export const invoices = Array.from({ length: 40 }, (_, i) => ({
  id: `INV-${5000 + i}`,
  customer: customers[i % customers.length].name,
  date: new Date(Date.now() - i * 86400000 * 2).toISOString().slice(0, 10),
  due: new Date(Date.now() - i * 86400000 * 2 + 14 * 86400000).toISOString().slice(0, 10),
  amount: Math.round(Math.random() * 25000 + 200),
  status: ["Paid", "Pending", "Overdue", "Partial", "Draft"][i % 5],
  type: ["Invoice", "Proforma", "Credit Note", "Cash Sale"][i % 4],
}));

export const expenses = Array.from({ length: 20 }, (_, i) => ({
  id: `EXP-${6000 + i}`,
  category: ["Rent", "Utilities", "Salaries", "Marketing", "Travel", "Office Supplies"][i % 6],
  vendor: companies[i % companies.length],
  date: new Date(Date.now() - i * 86400000 * 3).toISOString().slice(0, 10),
  amount: Math.round(Math.random() * 8000 + 100),
  status: ["Approved", "Pending", "Rejected"][i % 3],
}));

export const staff = Array.from({ length: 22 }, (_, i) => ({
  id: `EMP-${7000 + i}`,
  name: `${firstNames[i % firstNames.length]} ${lastNames[(i + 1) % lastNames.length]}`,
  department: ["Sales", "Finance", "HR", "Operations", "IT", "Warehouse"][i % 6],
  role: ["Manager", "Officer", "Assistant", "Lead", "Analyst"][i % 5],
  salary: Math.round((Math.random() * 4000 + 1000) * 100) / 100,
  status: ["Active", "Active", "On Leave"][i % 3],
  joined: new Date(Date.now() - i * 86400000 * 60).toISOString().slice(0, 10),
}));

export const transactions = Array.from({ length: 30 }, (_, i) => ({
  id: `TXN-${8000 + i}`,
  date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
  account: ["Cash", "Bank - Equity", "Bank - KCB", "Sales", "Expenses", "Receivables"][i % 6],
  description: ["Customer payment", "Supplier payment", "Bank transfer", "Office supplies", "Salary disbursement", "Utilities"][i % 6],
  debit: i % 2 === 0 ? Math.round(Math.random() * 5000) : 0,
  credit: i % 2 === 1 ? Math.round(Math.random() * 5000) : 0,
}));

export const purchaseOrders = Array.from({ length: 18 }, (_, i) => ({
  id: `LPO-${9000 + i}`,
  supplier: suppliers[i % suppliers.length].name,
  date: new Date(Date.now() - i * 86400000 * 4).toISOString().slice(0, 10),
  items: Math.floor(Math.random() * 8 + 1),
  total: Math.round(Math.random() * 50000 + 500),
  status: ["Pending", "Approved", "Rejected", "Approved"][i % 4],
}));

export const payrollRuns = Array.from({ length: 12 }, (_, i) => ({
  id: `PR-${10000 + i}`,
  period: new Date(2026, 5 - i, 1).toLocaleString("en", { month: "long", year: "numeric" }),
  employees: 22,
  gross: 92500 + i * 1200,
  net: 78400 + i * 1100,
  status: ["Completed", "Approved", "Prepared", "Rejected"][i % 4],
}));
