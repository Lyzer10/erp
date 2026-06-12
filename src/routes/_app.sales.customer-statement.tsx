import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { GlassCard } from "@/components/erp/GlassCard";
import { DataTable } from "@/components/erp/DataTable";
import { EChart } from "@/components/charts/EChart";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { customers, invoices, currency } from "@/lib/mock";
import { useState } from "react";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/_app/sales/customer-statement")({
  head: () => ({ meta: [{ title: "Customer Statement — DeveleERP" }] }),
  component: CustomerStatementPage,
});

function CustomerStatementPage() {
  const { t, lang } = useTranslate();
  const [selected, setSelected] = useState(customers[0].id);
  const customer = customers.find((c) => c.id === selected)!;

  const getInvoiceType = (type: string) => {
    if (lang === "en") return type;
    const map: Record<string, string> = {
      Invoice: "Ankara",
      Receipt: "Stakabadhi",
      CreditNote: "Hati ya Mkopo",
    };
    return map[type] || type;
  };

  const lines = invoices.slice(0, 8).map((i, k) => ({ 
    ...i, 
    amount: i.amount * 1000,
    balance: (1200 + k * 400) * 1000 
  }));

  return (
    <div className="space-y-6">
      <PageHeader 
        title={lang === "en" ? "Customer Statement" : "Taarifa ya Mteja"} 
        description={lang === "en" ? "Account activity, aging, and balance by customer." : "Shughuli za akaunti, uchanganuzi wa madeni kwa muda (aging), na salio la mteja."}
        actions={<ExportMenu />} 
      />
      <GlassCard>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">{lang === "en" ? "Customer" : "Mteja"}</label>
            <select value={selected} onChange={(e) => setSelected(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">{lang === "en" ? "From" : "Kutoka"}</label>
            <input type="date" className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" defaultValue="2026-01-01" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">{lang === "en" ? "To" : "Kwenda"}</label>
            <input type="date" className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" defaultValue="2026-06-11" />
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold">{customer.name} — {lang === "en" ? "Statement" : "Taarifa"}</h2>
          <DataTable searchable={false} pageSize={20} data={lines} columns={[
            { key: "date", header: lang === "en" ? "Date" : "Tarehe" }, 
            { key: "id", header: lang === "en" ? "Reference" : "Kumbukumbu" },
            { key: "type", header: lang === "en" ? "Type" : "Aina", render: (r) => getInvoiceType(r.type) },
            { key: "amount", header: lang === "en" ? "Debit" : "Deni", align: "right", render: (r) => currency(r.amount) },
            { key: "balance", header: lang === "en" ? "Balance" : "Salio", align: "right", render: (r) => currency(r.balance) },
          ]} />
        </GlassCard>
        <GlassCard>
          <h3 className="mb-3 text-lg font-semibold">{lang === "en" ? "Aging Analysis" : "Uchanganuzi wa Madeni"}</h3>
          <EChart height={300} option={{
            tooltip: { trigger: "item" },
            legend: {
              show: true,
              top: "2%",
              left: "center",
              orient: "horizontal",
              itemGap: 12,
              itemWidth: 10,
              itemHeight: 10,
              textStyle: { fontSize: 11 }
            },
            series: [{ 
              type: "pie", 
              center: ["50%", "60%"],
              radius: ["40%", "70%"], 
              padAngle: 3, 
              itemStyle: { borderRadius: 8 },
              data: [
                { value: 4200, name: lang === "en" ? "Current" : "Sasa" }, 
                { value: 1800, name: lang === "en" ? "1-30 days" : "Siku 1-30" },
                { value: 900, name: lang === "en" ? "31-60 days" : "Siku 31-60" }, 
                { value: 350, name: lang === "en" ? "60+ days" : "Siku 60+" },
              ]}],
          }} />
        </GlassCard>
      </div>
    </div>
  );
}
