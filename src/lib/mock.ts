// Mock data helpers for the ERP frontend (no backend).

export const currency = (n: number) =>
  "TZS " + new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

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
  phone: `+255 7${(10000000 + i * 137) % 100000000}`,
  balance: Math.round(Math.random() * 5000000 - 1000000),
  status: ["Active", "Active", "Active", "On Hold"][i % 4],
  createdAt: new Date(Date.now() - i * 86400000 * 7).toISOString().slice(0, 10),
}));

export const suppliers = Array.from({ length: 18 }, (_, i) => ({
  id: `SUP-${2000 + i}`,
  name: companies[(i + 3) % companies.length] + " Suppliers",
  contact: `${firstNames[(i + 2) % firstNames.length]} ${lastNames[(i + 2) % lastNames.length]}`,
  email: `vendor${i}@supply.com`,
  phone: `+255 7${(20000000 + i * 213) % 100000000}`,
  payable: Math.round(Math.random() * 8000000),
  status: ["Active", "Active", "Inactive"][i % 3],
}));

export const products = Array.from({ length: 30 }, (_, i) => {
  const names = [
    "Premium Coffee 1kg", "Organic Sugar 2kg", "Hand Sanitizer 500ml", "LED Bulb 9W", "Office Chair", 
    "A4 Paper Ream", "Cooking Oil 5L", "Detergent 1L", "Mineral Water 500ml", "Toothpaste 100g"
  ];
  const name = names[i % names.length];
  
  const prices = [15000, 6000, 8500, 5000, 185000, 12000, 32000, 7500, 1000, 3500];
  const costs = [11000, 4800, 6000, 3500, 140000, 9000, 25000, 5000, 600, 2500];
  
  const images = [
    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=60", // Coffee
    "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=500&auto=format&fit=crop&q=60", // Sugar
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60", // Sanitizer
    "https://images.unsplash.com/photo-1550985616-10810253b84d?w=500&auto=format&fit=crop&q=60", // Bulb
    "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=500&auto=format&fit=crop&q=60", // Chair
    "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=60", // Paper
    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60", // Oil
    "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=500&auto=format&fit=crop&q=60", // Detergent
    "https://images.unsplash.com/photo-1608885898957-a599fb1b1a44?w=500&auto=format&fit=crop&q=60", // Water
    "https://images.unsplash.com/photo-1559591937-e620a32d6677?w=500&auto=format&fit=crop&q=60", // Toothpaste
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


export const invoices = Array.from({ length: 40 }, (_, i) => ({
  id: `INV-${5000 + i}`,
  customer: customers[i % customers.length].name,
  date: new Date(Date.now() - i * 86400000 * 2).toISOString().slice(0, 10),
  due: new Date(Date.now() - i * 86400000 * 2 + 14 * 86400000).toISOString().slice(0, 10),
  amount: Math.round(Math.random() * 2500000 + 50000),
  status: ["Paid", "Pending", "Overdue", "Partial", "Draft"][i % 5],
  type: ["Invoice", "Proforma", "Credit Note", "Cash Sale"][i % 4],
}));

export const expenses = Array.from({ length: 20 }, (_, i) => ({
  id: `EXP-${6000 + i}`,
  category: ["Rent", "Utilities", "Salaries", "Marketing", "Travel", "Office Supplies"][i % 6],
  vendor: companies[i % companies.length],
  date: new Date(Date.now() - i * 86400000 * 3).toISOString().slice(0, 10),
  amount: Math.round(Math.random() * 800000 + 20000),
  status: ["Approved", "Pending", "Rejected"][i % 3],
}));

export const staff = Array.from({ length: 22 }, (_, i) => ({
  id: `EMP-${7000 + i}`,
  name: `${firstNames[i % firstNames.length]} ${lastNames[(i + 1) % lastNames.length]}`,
  department: ["Sales", "Finance", "HR", "Operations", "IT", "Warehouse"][i % 6],
  role: ["Manager", "Officer", "Assistant", "Lead", "Analyst"][i % 5],
  salary: Math.round(Math.random() * 1500000 + 400000),
  status: ["Active", "Active", "On Leave"][i % 3],
  joined: new Date(Date.now() - i * 86400000 * 60).toISOString().slice(0, 10),
}));

export const transactions = Array.from({ length: 30 }, (_, i) => ({
  id: `TXN-${8000 + i}`,
  date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
  account: ["Cash", "Bank - Equity", "Bank - CRDB", "Sales", "Expenses", "Receivables"][i % 6],
  description: ["Customer payment", "Supplier payment", "Bank transfer", "Office supplies", "Salary disbursement", "Utilities"][i % 6],
  debit: i % 2 === 0 ? Math.round(Math.random() * 500000) : 0,
  credit: i % 2 === 1 ? Math.round(Math.random() * 500000) : 0,
}));

export const purchaseOrders = Array.from({ length: 18 }, (_, i) => ({
  id: `LPO-${9000 + i}`,
  supplier: suppliers[i % suppliers.length].name,
  date: new Date(Date.now() - i * 86400000 * 4).toISOString().slice(0, 10),
  items: Math.floor(Math.random() * 8 + 1),
  total: Math.round(Math.random() * 5000000 + 50000),
  status: ["Pending", "Approved", "Rejected", "Approved"][i % 4],
}));

export const payrollRuns = Array.from({ length: 12 }, (_, i) => ({
  id: `PR-${10000 + i}`,
  period: new Date(2026, 5 - i, 1).toLocaleString("en", { month: "long", year: "numeric" }),
  employees: 22,
  gross: 9250000 + i * 120000,
  net: 7840000 + i * 110000,
  status: ["Completed", "Approved", "Prepared", "Rejected"][i % 4],
}));
