import { useState, useEffect } from "react";

export type Language = "en" | "sw";

let currentLang: Language = "en";
const listeners = new Set<() => void>();

try {
  const saved = localStorage.getItem("erp_lang");
  if (saved === "sw" || saved === "en") {
    currentLang = saved;
  }
} catch {}

export function getLanguage(): Language {
  return currentLang;
}

export function setLanguage(lang: Language) {
  if (currentLang !== lang) {
    currentLang = lang;
    try {
      localStorage.setItem("erp_lang", lang);
    } catch {}
    listeners.forEach((l) => l());
  }
}

export function useLanguage() {
  const [lang, setLang] = useState<Language>(currentLang);
  useEffect(() => {
    const handler = () => setLang(currentLang);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);
  return lang;
}

export const translations = {
  en: {
    dashboard: "Dashboard",
    invoices: "Invoices",
    invoice: "Invoice",
    proforma: "Proforma",
    purchaseOrder: "Purchase Order",
    paymentRequest: "Payment Request",
    openPos: "Open POS",
    stockRequest: "Stock Request",
    products: "Products",
    brands: "Brands & Codes",
    transfers: "Transfers",
    expenses: "Expenses",
    leave: "Leave Requests",
    payroll: "Payroll",
    staff: "Employees",
    customers: "Customers",
    suppliers: "Suppliers",
    settings: "Settings",
    bankCash: "Bank & Cash",
    ledgers: "Ledgers",
    reports: "Reports",
    search: "Search",
    addProduct: "Add Product",
    addBrand: "Add Brand",
    newTransfer: "New Transfer",
    date: "Date",
    status: "Status",
    action: "Action",
    from: "From",
    to: "To",
    value: "Value",
    quantity: "Quantity",
    cost: "Cost",
    price: "Price",
    stock: "Stock",
    category: "Category",
    totalSpend: "Total Spend",
    revenue: "Revenue",
    expenditures: "Expenditures",
    grossProfit: "Gross Profit",
    collection: "Collection",
    purchases: "Purchases",
    stockRequestOverview: "Stock Requests Overview",
    stockRequestedList: "Stock Requested List",
    newStockTransfer: "New Stock Transfer",
    transferType: "Transfer Type",
    source: "From (Source)",
    destination: "To (Destination)",
    itemsQuantity: "Items Quantity",
    totalValue: "Total Value",
    description: "Description",
    cancel: "Cancel",
    submit: "Submit Request",
    receives: "Receive Stock Transfer",
    receive: "Receive",
    code: "Code",
    stores: "Stores",
    formulas: "Conversion Formulas",
    addStore: "Add Store",
    addFormula: "Add Formula",
    manager: "Manager",
    location: "Location",
    registerExpense: "Register Expense",
    entries: "Entries",
    sales: "Sales",
    store: "Store",
    finance: "Finance",
    hrPayroll: "HR & Payroll",
    admin: "Admin",
    stakeholders: "Stakeholders",
    receipts: "Receipts & Delivery",
    statement: "Customer Statement",
    catalog: "Product Catalog",
    leaveLabel: "Leave Requests",
    newCustomer: "New Customer",
    newSupplier: "New Supplier",
    profile: "My Profile",
    logout: "Log Out",
    welcome: "Good morning, Aisha",
    welcomeSub: "Here's what's happening across your business today.",
  },
  sw: {
    dashboard: "Dashibodi",
    invoices: "Ankara",
    invoice: "Ankara",
    proforma: "Proforma",
    purchaseOrder: "Hati ya Manunuzi",
    paymentRequest: "Ombi la Malipo",
    openPos: "Fungua POS",
    stockRequest: "Ombi la Bidhaa",
    products: "Bidhaa / Huduma",
    brands: "Chapa na Misimbo",
    transfers: "Uhamisho",
    expenses: "Matumizi",
    leave: "Ombi la Likizo",
    payroll: "Mishahara",
    staff: "Wafanyakazi",
    customers: "Wateja",
    suppliers: "Wauzaji",
    settings: "Mipangilio",
    bankCash: "Benki na Fedha",
    ledgers: "Vitabu vya Hesabu",
    reports: "Ripoti",
    search: "Tafuta",
    addProduct: "Ongeza Bidhaa",
    addBrand: "Ongeza Chapa",
    newTransfer: "Uhamisho Mpya",
    date: "Tarehe",
    status: "Hali",
    action: "Kitendo",
    from: "Kutoka",
    to: "Kwenda",
    value: "Thamani",
    quantity: "Kiwango",
    cost: "Gharama",
    price: "Bei",
    stock: "Stoo",
    category: "Kundi",
    totalSpend: "Jumla ya Matumizi",
    revenue: "Mapato",
    expenditures: "Matumizi",
    grossProfit: "Faida Ghafi",
    collection: "Makusanyo",
    purchases: "Manunuzi",
    stockRequestOverview: "Muhtasari wa Maombi ya Bidhaa",
    stockRequestedList: "Orodha ya Bidhaa Zilizoombwa",
    newStockTransfer: "Uhamisho Mpya wa Bidhaa",
    transferType: "Aina ya Uhamisho",
    source: "Kutoka (Chanzo)",
    destination: "Kwenda (Gombaro)",
    itemsQuantity: "Idadi ya Bidhaa",
    totalValue: "Jumla ya Thamani",
    description: "Maelezo",
    cancel: "Ghairi",
    submit: "Wasilisha",
    receives: "Pokea Uhamisho wa Bidhaa",
    receive: "Pokea",
    code: "Msimbo",
    stores: "Maghala / Stoo",
    formulas: "Fomula za Ubadilishaji",
    addStore: "Ongeza Stoo",
    addFormula: "Ongeza Fomula",
    manager: "Meneja",
    location: "Eneo",
    registerExpense: "Sajili Matumizi",
    entries: "Kumbukumbu",
    sales: "Mauzo",
    store: "Stoo",
    finance: "Fedha",
    hrPayroll: "Wafanyakazi na Mishahara",
    admin: "Utawala",
    stakeholders: "Washirika",
    receipts: "Stakabadhi na Uwasilishaji",
    statement: "Taarifa ya Mteja",
    catalog: "Katalogi ya Bidhaa",
    leaveLabel: "Maombi ya Likizo",
    newCustomer: "Mteja Mpya",
    newSupplier: "Muuzaji Mpya",
    profile: "Wasifu Wangu",
    logout: "Ondoka",
    welcome: "Habari za asubuhi, Aisha",
    welcomeSub: "Hapa kuna muhtasari wa kile kinachotokea kwenye biashara yako leo.",
  },
};

export function translate(key: keyof typeof translations.en): string {
  return translations[currentLang][key] || translations.en[key] || String(key);
}

export function useTranslate() {
  const lang = useLanguage();
  return {
    lang,
    t: (key: keyof typeof translations.en) => translations[lang][key] || translations.en[key] || String(key),
  };
}
