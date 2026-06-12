const currency = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const firstNames = ["Aisha", "John", "Maria", "David", "Linda", "James", "Sara", "Mohammed", "Grace", "Peter", "Anita", "Samuel", "Joyce", "Brian", "Lucy", "Daniel", "Esther", "Kevin"];
const lastNames = ["Otieno", "Mwangi", "Smith", "Kumar", "Achieng", "Wanjiru", "Khan", "Banda", "Mensah", "Adebayo", "Hassan", "Njoroge", "Owusu", "Chen", "Garcia", "Patel"];
const companies = ["Acme Trading Ltd", "Skyline Holdings", "Bluepeak Industries", "Greenfield Co.", "Harbor Logistics", "Quantum Foods", "Nimbus Tech", "Orion Supplies", "Cobalt Hardware", "Vertex Mfg", "Kestrel Group", "Atlas Distributors"];
const customers = Array.from({ length: 24 }, (_, i) => ({
  id: `CUS-${1e3 + i}`,
  name: companies[i % companies.length],
  contact: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
  email: `contact${i}@${companies[i % companies.length].toLowerCase().replace(/[^a-z]/g, "")}.com`,
  phone: `+254 7${(1e7 + i * 137) % 1e8}`,
  balance: Math.round(Math.random() * 5e4 - 1e4),
  status: ["Active", "Active", "Active", "On Hold"][i % 4],
  createdAt: new Date(Date.now() - i * 864e5 * 7).toISOString().slice(0, 10)
}));
const suppliers = Array.from({ length: 18 }, (_, i) => ({
  id: `SUP-${2e3 + i}`,
  name: companies[(i + 3) % companies.length] + " Suppliers",
  contact: `${firstNames[(i + 2) % firstNames.length]} ${lastNames[(i + 2) % lastNames.length]}`,
  email: `vendor${i}@supply.com`,
  phone: `+254 7${(2e7 + i * 213) % 1e8}`,
  payable: Math.round(Math.random() * 8e4),
  status: ["Active", "Active", "Inactive"][i % 3]
}));
const products = Array.from({ length: 30 }, (_, i) => ({
  id: `PRD-${3e3 + i}`,
  name: ["Premium Coffee 1kg", "Organic Sugar 2kg", "Hand Sanitizer 500ml", "LED Bulb 9W", "Office Chair", "A4 Paper Ream", "Cooking Oil 5L", "Detergent 1L", "Mineral Water 500ml", "Toothpaste 100g"][i % 10],
  sku: `SKU-${4e3 + i}`,
  category: ["Beverages", "Groceries", "Household", "Electronics", "Furniture", "Stationery"][i % 6],
  brand: ["Brava", "Northstar", "Helios", "Verde", "Apex"][i % 5],
  price: Math.round((Math.random() * 200 + 10) * 100) / 100,
  cost: Math.round((Math.random() * 100 + 5) * 100) / 100,
  stock: Math.floor(Math.random() * 500),
  reorder: 50
}));
const invoices = Array.from({ length: 40 }, (_, i) => ({
  id: `INV-${5e3 + i}`,
  customer: customers[i % customers.length].name,
  date: new Date(Date.now() - i * 864e5 * 2).toISOString().slice(0, 10),
  due: new Date(Date.now() - i * 864e5 * 2 + 14 * 864e5).toISOString().slice(0, 10),
  amount: Math.round(Math.random() * 25e3 + 200),
  status: ["Paid", "Pending", "Overdue", "Partial", "Draft"][i % 5],
  type: ["Invoice", "Proforma", "Credit Note", "Cash Sale"][i % 4]
}));
const expenses = Array.from({ length: 20 }, (_, i) => ({
  id: `EXP-${6e3 + i}`,
  category: ["Rent", "Utilities", "Salaries", "Marketing", "Travel", "Office Supplies"][i % 6],
  vendor: companies[i % companies.length],
  date: new Date(Date.now() - i * 864e5 * 3).toISOString().slice(0, 10),
  amount: Math.round(Math.random() * 8e3 + 100),
  status: ["Approved", "Pending", "Rejected"][i % 3]
}));
const staff = Array.from({ length: 22 }, (_, i) => ({
  id: `EMP-${7e3 + i}`,
  name: `${firstNames[i % firstNames.length]} ${lastNames[(i + 1) % lastNames.length]}`,
  department: ["Sales", "Finance", "HR", "Operations", "IT", "Warehouse"][i % 6],
  role: ["Manager", "Officer", "Assistant", "Lead", "Analyst"][i % 5],
  salary: Math.round((Math.random() * 4e3 + 1e3) * 100) / 100,
  status: ["Active", "Active", "On Leave"][i % 3],
  joined: new Date(Date.now() - i * 864e5 * 60).toISOString().slice(0, 10)
}));
const transactions = Array.from({ length: 30 }, (_, i) => ({
  id: `TXN-${8e3 + i}`,
  date: new Date(Date.now() - i * 864e5).toISOString().slice(0, 10),
  account: ["Cash", "Bank - Equity", "Bank - KCB", "Sales", "Expenses", "Receivables"][i % 6],
  description: ["Customer payment", "Supplier payment", "Bank transfer", "Office supplies", "Salary disbursement", "Utilities"][i % 6],
  debit: i % 2 === 0 ? Math.round(Math.random() * 5e3) : 0,
  credit: i % 2 === 1 ? Math.round(Math.random() * 5e3) : 0
}));
const purchaseOrders = Array.from({ length: 18 }, (_, i) => ({
  id: `LPO-${9e3 + i}`,
  supplier: suppliers[i % suppliers.length].name,
  date: new Date(Date.now() - i * 864e5 * 4).toISOString().slice(0, 10),
  items: Math.floor(Math.random() * 8 + 1),
  total: Math.round(Math.random() * 5e4 + 500),
  status: ["Pending", "Approved", "Rejected", "Approved"][i % 4]
}));
const payrollRuns = Array.from({ length: 12 }, (_, i) => ({
  id: `PR-${1e4 + i}`,
  period: new Date(2026, 5 - i, 1).toLocaleString("en", { month: "long", year: "numeric" }),
  employees: 22,
  gross: 92500 + i * 1200,
  net: 78400 + i * 1100,
  status: ["Completed", "Approved", "Prepared", "Rejected"][i % 4]
}));
export {
  customers as a,
  payrollRuns as b,
  currency as c,
  purchaseOrders as d,
  expenses as e,
  invoices as i,
  products as p,
  staff as s,
  transactions as t
};
