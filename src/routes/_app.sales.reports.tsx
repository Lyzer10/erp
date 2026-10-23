import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/erp/DataTable";
import { PageHeader } from "@/components/erp/PageHeader";
import { getExpensesFn, getPurchaseOrdersFn } from "@/lib/api/domain";
import { getInventoryFn, getSalesFn } from "@/lib/api/operations";
import { useTranslate } from "@/lib/i18n";
import { downloadReportExcel, downloadReportPdf } from "@/lib/report-export";

type Sale = { id: number; receiptNumber: string; customer?: string | null; subtotal: number; discount: number; tax: number; total: number; status: string; createdAt: Date | string };
type Purchase = { id: number; code: string; supplier: string; date: string; items: number; total: number; status: string };
type Expense = { id: number; code: string; category: string; vendor: string; date: string; amount: number; status: string };
type Product = { id: number; sku: string; name: string; category: string; stock: number; reorder: number; cost: number };
type Tab = "sales" | "purchases" | "stock" | "summary";

export const Route = createFileRoute("/_app/sales/reports")({
  head: () => ({ meta: [{ title: "Business Reports — DeveleERP" }] }),
  loader: async () => {
    const [sales, purchases, inventory, expenses] = await Promise.all([getSalesFn(), getPurchaseOrdersFn(), getInventoryFn(), getExpensesFn()]);
    return { sales, purchases: purchases.data, products: inventory.products, expenses: expenses.data };
  },
  component: ReportsPage,
});
const money = (value: number) => `TZS ${new Intl.NumberFormat("en-TZ").format(value)}`;
const dateOnly = (value: Date | string) => new Date(value).toISOString().slice(0, 10);

function ReportsPage() {
  const { lang } = useTranslate();
  const loaded = Route.useLoaderData() as { sales: Sale[]; purchases: Purchase[]; products: Product[]; expenses: Expense[] };
  const [tab, setTab] = useState<Tab>("sales");
  const today = new Date().toISOString().slice(0, 10);
  const first = `${today.slice(0, 8)}01`;
  const [from, setFrom] = useState(first);
  const [to, setTo] = useState(today);
  const [status, setStatus] = useState("All");
  const within = (value: Date | string) => { const date = dateOnly(value); return (!from || date >= from) && (!to || date <= to); };
  const sales = useMemo(() => loaded.sales.filter((row) => within(row.createdAt) && (status === "All" || row.status === status)), [loaded.sales, from, to, status]);
  const purchases = useMemo(() => loaded.purchases.filter((row) => within(row.date) && (status === "All" || row.status === status)), [loaded.purchases, from, to, status]);
  const expenses = useMemo(() => loaded.expenses.filter((row) => within(row.date) && row.status === "Approved"), [loaded.expenses, from, to]);
  const completedSales = sales.filter((row) => row.status === "Completed");
  const salesTotal = completedSales.reduce((sum, row) => sum + row.total, 0);
  const purchaseTotal = purchases.reduce((sum, row) => sum + row.total, 0);
  const expenseTotal = expenses.reduce((sum, row) => sum + row.amount, 0);
  const stockValue = loaded.products.reduce((sum, row) => sum + row.stock * row.cost, 0);
  const salesColumns = [
    { header: lang === "en" ? "Receipt" : "Risiti", value: (row: Sale) => row.receiptNumber },
    { header: lang === "en" ? "Date" : "Tarehe", value: (row: Sale) => new Date(row.createdAt).toLocaleString() },
    { header: lang === "en" ? "Customer" : "Mteja", value: (row: Sale) => row.customer || (lang === "en" ? "Walk-in" : "Mteja wa kawaida") },
    { header: lang === "en" ? "Subtotal" : "Jumla ndogo", value: (row: Sale) => row.subtotal },
    { header: lang === "en" ? "Discount" : "Punguzo", value: (row: Sale) => row.discount },
    { header: lang === "en" ? "Tax" : "Kodi", value: (row: Sale) => row.tax },
    { header: lang === "en" ? "Total" : "Jumla", value: (row: Sale) => row.total },
    { header: lang === "en" ? "Status" : "Hali", value: (row: Sale) => row.status },
  ];
  const exportSubtitle = `${from || "…"} — ${to || "…"} · ${sales.length} records · ${money(salesTotal)}`;
  return <div className="space-y-6">
    <PageHeader title={lang === "en" ? "Business reports" : "Ripoti za biashara"} description={lang === "en" ? "Sales, purchases, stock and financial summaries from recorded transactions." : "Mauzo, manunuzi, stoo na muhtasari wa fedha kutoka kwenye miamala iliyorekodiwa."} />
    <div className="flex flex-wrap gap-2 rounded-2xl border bg-white p-2">{(["sales", "purchases", "stock", "summary"] as Tab[]).map((item) => <button key={item} onClick={() => { setTab(item); setStatus("All"); }} className={tab === item ? "rounded-xl bg-[#dff5f1] px-4 py-2 text-sm font-bold text-[#087b69]" : "rounded-xl px-4 py-2 text-sm font-semibold text-slate-600"}>{item === "sales" ? (lang === "en" ? "Sales" : "Mauzo") : item === "purchases" ? (lang === "en" ? "Purchases" : "Manunuzi") : item === "stock" ? (lang === "en" ? "Stock" : "Stoo") : (lang === "en" ? "Financial summary" : "Muhtasari wa fedha")}</button>)}</div>
    {tab !== "stock" && <div className="flex flex-wrap items-end gap-3 rounded-2xl border bg-white p-4"><DateField label={lang === "en" ? "From" : "Kuanzia"} value={from} setValue={setFrom} /><DateField label={lang === "en" ? "To" : "Mpaka"} value={to} setValue={setTo} />{(tab === "sales" || tab === "purchases") && <label className="text-sm font-semibold">{lang === "en" ? "Status" : "Hali"}<select className="input-field mt-1" value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option>{(tab === "sales" ? ["Completed", "Voided"] : ["Pending", "Approved", "Received", "Rejected"]).map((item) => <option key={item}>{item}</option>)}</select></label>}{tab === "sales" && <div className="ml-auto flex gap-2"><button onClick={() => void downloadReportExcel("DeveleERP sales report", salesColumns, sales)} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold"><Download className="h-4 w-4" />Excel</button><button onClick={() => void downloadReportPdf("DeveleERP Sales Report", exportSubtitle, salesColumns, sales)} className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-3 py-2 text-sm font-bold text-white"><FileText className="h-4 w-4" />PDF</button></div>}</div>}
    {tab === "sales" && <><Metrics values={[[lang === "en" ? "Completed sales" : "Mauzo yaliyokamilika", money(salesTotal)], [lang === "en" ? "Transactions" : "Miamala", String(completedSales.length)], [lang === "en" ? "Tax" : "Kodi", money(completedSales.reduce((sum,row)=>sum+row.tax,0))]]} /><DataTable data={sales} columns={salesColumns.map((column) => ({ key: column.header, header: column.header, render: column.value as (row: Sale) => string | number }))} /></>}
    {tab === "purchases" && <><Metrics values={[[lang === "en" ? "Purchases" : "Manunuzi", money(purchaseTotal)], [lang === "en" ? "Orders" : "Maagizo", String(purchases.length)]]} /><DataTable data={purchases} columns={[{key:"code",header:"LPO"},{key:"supplier",header:lang === "en"?"Supplier":"Msambazaji"},{key:"date",header:lang === "en"?"Date":"Tarehe"},{key:"items",header:lang === "en"?"Items":"Bidhaa",align:"right"},{key:"total",header:lang === "en"?"Total":"Jumla",align:"right",render:(row:Purchase)=>money(row.total)},{key:"status",header:lang === "en"?"Status":"Hali"}]} /></>}
    {tab === "stock" && <><Metrics values={[[lang === "en" ? "Stock value" : "Thamani ya stoo", money(stockValue)], [lang === "en" ? "Units available" : "Vipimo vilivyopo", String(loaded.products.reduce((s,r)=>s+r.stock,0))], [lang === "en" ? "Low stock" : "Bidhaa chache", String(loaded.products.filter((r)=>r.stock>0&&r.stock<=r.reorder).length)]]} /><DataTable data={loaded.products} columns={[{key:"sku",header:"SKU"},{key:"name",header:lang === "en"?"Product":"Bidhaa"},{key:"category",header:lang === "en"?"Category":"Kundi"},{key:"stock",header:lang === "en"?"On hand":"Iliyopo",align:"right"},{key:"cost",header:lang === "en"?"Unit cost":"Gharama",align:"right",render:(r:Product)=>money(r.cost)},{key:"value",header:lang === "en"?"Value":"Thamani",align:"right",render:(r:Product)=>money(r.stock*r.cost)}]} /></>}
    {tab === "summary" && <Metrics values={[[lang === "en" ? "Completed sales" : "Mauzo yaliyokamilika", money(salesTotal)], [lang === "en" ? "Purchases" : "Manunuzi", money(purchaseTotal)], [lang === "en" ? "Expenses" : "Matumizi", money(expenseTotal)], [lang === "en" ? "Operating result" : "Matokeo ya uendeshaji", money(salesTotal-expenseTotal)], [lang === "en" ? "Current stock value" : "Thamani ya stoo", money(stockValue)]]} />}
  </div>;
}
function DateField({label,value,setValue}:{label:string;value:string;setValue:(value:string)=>void}) { return <label className="text-sm font-semibold">{label}<input type="date" value={value} onChange={(e)=>setValue(e.target.value)} className="input-field mt-1" /></label>; }
function Metrics({values}:{values:string[][]}) { return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{values.map(([label,value])=><div key={label} className="rounded-2xl border bg-white p-5"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>)}</div>; }
