import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/erp/DataTable";
import { PageHeader } from "@/components/erp/PageHeader";
import { getExpensesFn, getPurchaseOrdersFn } from "@/lib/api/domain";
import { getFinancialSaleItemsFn, getInventoryFn, getSalesFn } from "@/lib/api/operations";
import { useTranslate } from "@/lib/i18n";
import { downloadReportExcel, downloadReportPdf } from "@/lib/report-export";

type Sale = { id: number; receiptNumber: string; customer?: string | null; subtotal: number; discount: number; tax: number; total: number; status: string; createdAt: Date | string };
type Purchase = { id: number; code: string; supplier: string; date: string; items: number; total: number; status: string };
type Expense = { id: number; code: string; category: string; vendor: string; date: string; amount: number; status: string };
type Product = { id: number; sku: string; name: string; category: string; stock: number; reorder: number; cost: number };
type FinancialSaleItem = { saleId: number; quantity: number; unitCost: number; createdAt: Date | string; status: string };
type SummaryLine = { label: string; description: string; amount: number; emphasis?: boolean };
type Tab = "sales" | "purchases" | "stock" | "summary";

export const Route = createFileRoute("/_app/sales/reports")({
  head: () => ({ meta: [{ title: "Business Reports — DeveleERP" }] }),
  loader: async () => {
    const [sales, purchases, inventory, expenses, financialSaleItems] = await Promise.all([getSalesFn(), getPurchaseOrdersFn(), getInventoryFn(), getExpensesFn(), getFinancialSaleItemsFn()]);
    return { sales, purchases: purchases.data, products: inventory.products, expenses: expenses.data, financialSaleItems };
  },
  component: ReportsPage,
});
const money = (value: number) => `TZS ${new Intl.NumberFormat("en-TZ").format(value)}`;
const dateOnly = (value: Date | string) => new Date(value).toISOString().slice(0, 10);

function ReportsPage() {
  const { lang } = useTranslate();
  const loaded = Route.useLoaderData() as { sales: Sale[]; purchases: Purchase[]; products: Product[]; expenses: Expense[]; financialSaleItems: FinancialSaleItem[] };
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
  const receivedPurchases = purchases.filter((row) => row.status === "Received");
  const receivedPurchaseTotal = receivedPurchases.reduce((sum, row) => sum + row.total, 0);
  const grossSales = completedSales.reduce((sum, row) => sum + row.subtotal, 0);
  const discounts = completedSales.reduce((sum, row) => sum + row.discount, 0);
  const taxCollected = completedSales.reduce((sum, row) => sum + row.tax, 0);
  const netSalesBeforeTax = grossSales - discounts;
  const costOfGoodsSold = loaded.financialSaleItems
    .filter((row) => row.status === "Completed" && within(row.createdAt))
    .reduce((sum, row) => sum + row.quantity * row.unitCost, 0);
  const grossProfit = netSalesBeforeTax - costOfGoodsSold;
  const operatingProfit = grossProfit - expenseTotal;
  const summaryLines: SummaryLine[] = [
    { label: lang === "en" ? "Gross sales" : "Mauzo kabla ya makato", description: lang === "en" ? "Value of completed sales before discounts and tax" : "Thamani ya mauzo yaliyokamilika kabla ya punguzo na kodi", amount: grossSales },
    { label: lang === "en" ? "Less: discounts" : "Toa: punguzo", description: lang === "en" ? "Discounts granted to customers" : "Punguzo lililotolewa kwa wateja", amount: -discounts },
    { label: lang === "en" ? "Net sales before tax" : "Mauzo halisi kabla ya kodi", description: lang === "en" ? "Revenue used to calculate trading profit" : "Mapato yanayotumika kukokotoa faida ya biashara", amount: netSalesBeforeTax, emphasis: true },
    { label: lang === "en" ? "Less: cost of goods sold" : "Toa: gharama ya bidhaa zilizouzwa", description: lang === "en" ? "Purchase cost of the stock sold in this period" : "Gharama ya kununua bidhaa zilizouzwa katika kipindi hiki", amount: -costOfGoodsSold },
    { label: lang === "en" ? "Gross profit" : "Faida ghafi", description: lang === "en" ? "Net sales less cost of goods sold" : "Mauzo halisi baada ya kutoa gharama ya bidhaa zilizouzwa", amount: grossProfit, emphasis: true },
    { label: lang === "en" ? "Less: approved expenses" : "Toa: matumizi yaliyoidhinishwa", description: lang === "en" ? "Approved operating expenses recorded in this period" : "Matumizi ya uendeshaji yaliyoidhinishwa katika kipindi hiki", amount: -expenseTotal },
    { label: lang === "en" ? "Net operating profit" : "Faida halisi ya uendeshaji", description: lang === "en" ? "Gross profit after approved operating expenses" : "Faida ghafi baada ya kutoa matumizi yaliyoidhinishwa", amount: operatingProfit, emphasis: true },
    { label: lang === "en" ? "Tax collected" : "Kodi iliyokusanywa", description: lang === "en" ? "Tax included in completed sale totals" : "Kodi iliyojumuishwa kwenye jumla ya mauzo yaliyokamilika", amount: taxCollected },
  ];
  const summaryColumns = [
    { header: lang === "en" ? "Financial item" : "Kipengele cha fedha", value: (row: SummaryLine) => row.label },
    { header: lang === "en" ? "Explanation" : "Maelezo", value: (row: SummaryLine) => row.description },
    { header: lang === "en" ? "Amount (TZS)" : "Kiasi (TZS)", value: (row: SummaryLine) => row.amount },
  ];
  const periodText = `${from || "…"} — ${to || "…"}`;
  const summaryTotals = [
    { label: lang === "en" ? "Completed sales" : "Mauzo yaliyokamilika", value: completedSales.length },
    { label: lang === "en" ? "Received purchases" : "Manunuzi yaliyopokelewa", value: `${receivedPurchases.length} · ${money(receivedPurchaseTotal)}` },
    { label: lang === "en" ? "Approved expenses" : "Matumizi yaliyoidhinishwa", value: `${expenses.length} · ${money(expenseTotal)}` },
    { label: lang === "en" ? "Current stock value" : "Thamani ya stoo kwa sasa", value: money(stockValue) },
    { label: lang === "en" ? "Net operating profit" : "Faida halisi ya uendeshaji", value: money(operatingProfit) },
  ];
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
    {tab !== "stock" && <div className="flex flex-wrap items-end gap-3 rounded-2xl border bg-white p-4"><DateField label={lang === "en" ? "From" : "Kuanzia"} value={from} setValue={setFrom} /><DateField label={lang === "en" ? "To" : "Mpaka"} value={to} setValue={setTo} />{(tab === "sales" || tab === "purchases") && <label className="text-sm font-semibold">{lang === "en" ? "Status" : "Hali"}<select className="input-field mt-1" value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option>{(tab === "sales" ? ["Completed", "Voided"] : ["Pending", "Approved", "Received", "Rejected"]).map((item) => <option key={item}>{item}</option>)}</select></label>}{tab === "sales" && <div className="ml-auto flex gap-2"><button onClick={() => void downloadReportExcel("DeveleERP sales report", salesColumns, sales, { subtitle: exportSubtitle, totals: [{ label: lang === "en" ? "Completed sales total" : "Jumla ya mauzo yaliyokamilika", value: money(salesTotal) }] })} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold"><Download className="h-4 w-4" />Excel</button><button onClick={() => void downloadReportPdf("DeveleERP Sales Report", exportSubtitle, salesColumns, sales, { totals: [{ label: lang === "en" ? "Completed sales total" : "Jumla ya mauzo yaliyokamilika", value: money(salesTotal) }] })} className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-3 py-2 text-sm font-bold text-white"><FileText className="h-4 w-4" />PDF</button></div>}{tab === "summary" && <div className="ml-auto flex gap-2"><button onClick={() => void downloadReportExcel(lang === "en" ? "DeveleERP financial summary" : "Muhtasari wa fedha wa DeveleERP", summaryColumns, summaryLines, { subtitle: periodText, totals: summaryTotals })} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold"><Download className="h-4 w-4" />Excel</button><button onClick={() => void downloadReportPdf(lang === "en" ? "DeveleERP Financial Summary" : "Muhtasari wa Fedha wa DeveleERP", periodText, summaryColumns, summaryLines, { totals: summaryTotals })} className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-3 py-2 text-sm font-bold text-white"><FileText className="h-4 w-4" />PDF</button></div>}</div>}
    {tab === "sales" && <><Metrics values={[[lang === "en" ? "Completed sales" : "Mauzo yaliyokamilika", money(salesTotal)], [lang === "en" ? "Transactions" : "Miamala", String(completedSales.length)], [lang === "en" ? "Tax" : "Kodi", money(completedSales.reduce((sum,row)=>sum+row.tax,0))]]} /><DataTable data={sales} columns={salesColumns.map((column) => ({ key: column.header, header: column.header, render: column.value as (row: Sale) => string | number }))} /></>}
    {tab === "purchases" && <><Metrics values={[[lang === "en" ? "Purchases" : "Manunuzi", money(purchaseTotal)], [lang === "en" ? "Orders" : "Maagizo", String(purchases.length)]]} /><DataTable data={purchases} columns={[{key:"code",header:"LPO"},{key:"supplier",header:lang === "en"?"Supplier":"Msambazaji"},{key:"date",header:lang === "en"?"Date":"Tarehe"},{key:"items",header:lang === "en"?"Items":"Bidhaa",align:"right"},{key:"total",header:lang === "en"?"Total":"Jumla",align:"right",render:(row:Purchase)=>money(row.total)},{key:"status",header:lang === "en"?"Status":"Hali"}]} /></>}
    {tab === "stock" && <><Metrics values={[[lang === "en" ? "Stock value" : "Thamani ya stoo", money(stockValue)], [lang === "en" ? "Units available" : "Vipimo vilivyopo", String(loaded.products.reduce((s,r)=>s+r.stock,0))], [lang === "en" ? "Low stock" : "Bidhaa chache", String(loaded.products.filter((r)=>r.stock>0&&r.stock<=r.reorder).length)]]} /><DataTable data={loaded.products} columns={[{key:"sku",header:"SKU"},{key:"name",header:lang === "en"?"Product":"Bidhaa"},{key:"category",header:lang === "en"?"Category":"Kundi"},{key:"stock",header:lang === "en"?"On hand":"Iliyopo",align:"right"},{key:"cost",header:lang === "en"?"Unit cost":"Gharama",align:"right",render:(r:Product)=>money(r.cost)},{key:"value",header:lang === "en"?"Value":"Thamani",align:"right",render:(r:Product)=>money(r.stock*r.cost)}]} /></>}
    {tab === "summary" && <FinancialSummary lang={lang} lines={summaryLines} salesCount={completedSales.length} purchaseCount={receivedPurchases.length} purchaseTotal={receivedPurchaseTotal} expenseCount={expenses.length} stockValue={stockValue} operatingProfit={operatingProfit} />}
  </div>;
}
function DateField({label,value,setValue}:{label:string;value:string;setValue:(value:string)=>void}) { return <label className="text-sm font-semibold">{label}<input type="date" value={value} onChange={(e)=>setValue(e.target.value)} className="input-field mt-1" /></label>; }
function Metrics({values}:{values:string[][]}) { return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{values.map(([label,value])=><div key={label} className="rounded-2xl border bg-white p-5"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>)}</div>; }

function FinancialSummary({ lang, lines, salesCount, purchaseCount, purchaseTotal, expenseCount, stockValue, operatingProfit }: { lang: "en" | "sw"; lines: SummaryLine[]; salesCount: number; purchaseCount: number; purchaseTotal: number; expenseCount: number; stockValue: number; operatingProfit: number }) {
  return <div className="space-y-4">
    <Metrics values={[
      [lang === "en" ? "Net operating profit" : "Faida halisi ya uendeshaji", money(operatingProfit)],
      [lang === "en" ? "Completed sales" : "Mauzo yaliyokamilika", String(salesCount)],
      [lang === "en" ? "Received purchases" : "Manunuzi yaliyopokelewa", `${purchaseCount} · ${money(purchaseTotal)}`],
      [lang === "en" ? "Approved expenses" : "Matumizi yaliyoidhinishwa", String(expenseCount)],
      [lang === "en" ? "Current stock value" : "Thamani ya stoo kwa sasa", money(stockValue)],
    ]} />
    <section className="overflow-hidden rounded-2xl border bg-white">
      <div className="border-b px-5 py-4">
        <h2 className="font-bold text-slate-950">{lang === "en" ? "Profit and loss breakdown" : "Mchanganuo wa faida na hasara"}</h2>
        <p className="mt-1 text-sm text-slate-600">{lang === "en" ? "Calculated from completed sales and approved expenses within the selected dates." : "Imekokotolewa kwa mauzo yaliyokamilika na matumizi yaliyoidhinishwa ndani ya tarehe ulizochagua."}</p>
      </div>
      <div className="divide-y">
        {lines.map((line) => <div key={line.label} className={line.emphasis ? "grid gap-2 bg-[#f2faf8] px-5 py-4 sm:grid-cols-[minmax(180px,1fr)_minmax(260px,2fr)_auto] sm:items-center" : "grid gap-2 px-5 py-4 sm:grid-cols-[minmax(180px,1fr)_minmax(260px,2fr)_auto] sm:items-center"}>
          <p className={line.emphasis ? "font-bold text-slate-950" : "font-semibold text-slate-900"}>{line.label}</p>
          <p className="text-sm text-slate-600">{line.description}</p>
          <p className={`text-right font-bold tabular-nums ${line.amount < 0 ? "text-rose-700" : line.emphasis ? "text-[#087b69]" : "text-slate-950"}`}>{money(line.amount)}</p>
        </div>)}
      </div>
    </section>
    <p className="text-xs leading-5 text-slate-600">{lang === "en" ? "Received purchases are shown separately because unsold stock remains an asset. Profit uses the recorded cost of products actually sold. Tax collected is reported separately and is not treated as profit." : "Manunuzi yaliyopokelewa yanaonyeshwa tofauti kwa sababu bidhaa ambazo bado hazijauzwa ni mali ya biashara. Faida inatumia gharama iliyorekodiwa ya bidhaa zilizouzwa. Kodi iliyokusanywa inaonyeshwa tofauti na haihesabiwi kama faida."}</p>
  </div>;
}
