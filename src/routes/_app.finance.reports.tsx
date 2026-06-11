import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { GlassCard } from "@/components/erp/GlassCard";
import { DataTable } from "@/components/erp/DataTable";
import { EChart } from "@/components/charts/EChart";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { currency } from "@/lib/mock";

const pnl = [
  { item: "Revenue", amount: 284350 }, { item: "Cost of Goods Sold", amount: -142180 },
  { item: "Gross Profit", amount: 142170 }, { item: "Operating Expenses", amount: -68420 },
  { item: "Operating Profit", amount: 73750 }, { item: "Tax", amount: -22125 },
  { item: "Net Profit", amount: 51625 },
];

export const Route = createFileRoute("/_app/finance/reports")({
  head: () => ({ meta: [{ title: "Financial Reports — DeveleERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Financial Reports" description="P&L, Cash Book, Trial Balance, Balance Sheet, and more."
        actions={<ExportMenu />} />
      <TabbedPage tabs={[
        { key: "pnl", label: "Gross P&L", render: () => (
          <div className="grid gap-6 lg:grid-cols-2">
            <DataTable searchable={false} pageSize={20} data={pnl} columns={[
              { key: "item", header: "Line" },
              { key: "amount", header: "Amount", align: "right", render: (r) => <span className={r.amount < 0 ? "text-rose-600" : "font-semibold"}>{currency(r.amount)}</span> },
            ]} />
            <GlassCard>
              <EChart height={300} option={{
                xAxis: { type: "category", data: ["Revenue","COGS","Gross","OpEx","Operating","Tax","Net"] },
                yAxis: { type: "value" },
                series: [{ type: "bar", data: pnl.map(p => Math.abs(p.amount)), itemStyle: { borderRadius: [6,6,0,0] }, barWidth: 24 }],
              }} />
            </GlassCard>
          </div>
        )},
        { key: "cash", label: "Cash Book", render: () => (
          <DataTable data={Array.from({length:12},(_,i) => ({ date: `2026-06-${String(i+1).padStart(2,"0")}`, desc: ["Sale","Purchase","Payroll","Transfer","Expense"][i%5], dr: i%2?0:1200+i*80, cr: i%2?900+i*70:0, bal: 5000+i*120 }))}
            columns={[
              { key: "date", header: "Date" }, { key: "desc", header: "Description" },
              { key: "dr", header: "DR", align: "right", render: (r) => r.dr ? currency(r.dr) : "—" },
              { key: "cr", header: "CR", align: "right", render: (r) => r.cr ? currency(r.cr) : "—" },
              { key: "bal", header: "Balance", align: "right", render: (r) => currency(r.bal) },
            ]} />
        )},
        { key: "income", label: "Income Statement", render: () => <DataTable searchable={false} data={pnl} columns={[{ key: "item", header: "Item" }, { key: "amount", header: "Amount", align: "right", render: (r) => currency(r.amount) }]} /> },
        { key: "trial", label: "Trial Balance", render: () => (
          <DataTable data={["Cash","Bank","Sales","Receivables","Payables","Expenses","Salaries","Inventory"].map((a, i) => ({ account: a, dr: i%2?0:5000+i*800, cr: i%2?4000+i*700:0 }))}
            columns={[{ key: "account", header: "Account" },
              { key: "dr", header: "Debit", align: "right", render: (r) => r.dr ? currency(r.dr) : "—" },
              { key: "cr", header: "Credit", align: "right", render: (r) => r.cr ? currency(r.cr) : "—" }]} />
        )},
        { key: "bs", label: "Balance Sheet", render: () => (
          <div className="grid gap-6 lg:grid-cols-2">
            <GlassCard>
              <h3 className="mb-3 font-semibold">Assets</h3>
              <DataTable searchable={false} pageSize={20} data={[{ a: "Cash", v: 24500 }, { a: "Bank", v: 86300 }, { a: "Receivables", v: 42100 }, { a: "Inventory", v: 96400 }, { a: "Equipment", v: 38200 }]} columns={[{ key: "a", header: "Item" }, { key: "v", header: "Amount", align: "right", render: (r) => currency(r.v) }]} />
            </GlassCard>
            <GlassCard>
              <h3 className="mb-3 font-semibold">Liabilities & Equity</h3>
              <DataTable searchable={false} pageSize={20} data={[{ a: "Payables", v: 32600 }, { a: "Loans", v: 48000 }, { a: "Equity", v: 124700 }, { a: "Retained Earnings", v: 82200 }]} columns={[{ key: "a", header: "Item" }, { key: "v", header: "Amount", align: "right", render: (r) => currency(r.v) }]} />
            </GlassCard>
          </div>
        )},
        { key: "vendor", label: "Vendor Reports", render: () => (
          <DataTable data={Array.from({length:10},(_,i) => ({ id: `V-${i+1}`, name: `Vendor ${i+1}`, bills: 4+i, paid: 1200+i*400, due: 600+i*150 }))}
            columns={[
              { key: "id", header: "ID" }, { key: "name", header: "Vendor" },
              { key: "bills", header: "Bills", align: "right" },
              { key: "paid", header: "Paid", align: "right", render: (r) => currency(r.paid) },
              { key: "due", header: "Due", align: "right", render: (r) => currency(r.due) },
            ]} />
        )},
        { key: "payments", label: "Payments", render: () => (
          <DataTable data={Array.from({length:12},(_,i) => ({ id: `PMT-${500+i}`, ref: `INV-${5000+i}`, date: `2026-06-${String(i+1).padStart(2,"0")}`, method: ["Cash","Bank","Mobile"][i%3], amount: 800+i*120 }))}
            columns={[
              { key: "id", header: "Payment #" }, { key: "ref", header: "Ref" }, { key: "date", header: "Date" },
              { key: "method", header: "Method" },
              { key: "amount", header: "Amount", align: "right", render: (r) => currency(r.amount) },
            ]} />
        )},
        { key: "stock", label: "Stock Valuation", render: () => (
          <GlassCard>
            <EChart height={320} option={{
              xAxis: { type: "category", data: ["Beverages","Groceries","Electronics","Stationery","Household"] },
              yAxis: { type: "value" },
              series: [{ type: "bar", data: [42000, 28000, 51000, 12000, 19000], itemStyle: { borderRadius: [6,6,0,0], color: "#10b981" }, barWidth: 32 }],
            }} />
          </GlassCard>
        )},
      ]} />
    </div>
  ),
});
