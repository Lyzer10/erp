import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { GlassCard } from "@/components/erp/GlassCard";
import { DataTable } from "@/components/erp/DataTable";
import { EChart } from "@/components/charts/EChart";
import { customers, invoices, currency } from "@/lib/mock";
import { useState } from "react";

export const Route = createFileRoute("/_app/sales/customer-statement")({
  head: () => ({ meta: [{ title: "Customer Statement — Lumen ERP" }] }),
  component: () => {
    const [selected, setSelected] = useState(customers[0].id);
    const customer = customers.find((c) => c.id === selected)!;
    const lines = invoices.slice(0, 8).map((i, k) => ({ ...i, balance: 1200 + k * 400 }));
    return (
      <div className="space-y-6">
        <PageHeader title="Customer Statement" description="Account activity, aging, and balance by customer." />
        <GlassCard>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Customer</label>
              <select value={selected} onChange={(e) => setSelected(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm backdrop-blur">
                {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">From</label>
              <input type="date" className="mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm backdrop-blur" defaultValue="2026-01-01" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">To</label>
              <input type="date" className="mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm backdrop-blur" defaultValue="2026-06-11" />
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-6 lg:grid-cols-3">
          <GlassCard className="lg:col-span-2">
            <h2 className="mb-3 text-lg font-semibold">{customer.name} — Statement</h2>
            <DataTable searchable={false} pageSize={20} data={lines} columns={[
              { key: "date", header: "Date" }, { key: "id", header: "Reference" },
              { key: "type", header: "Type" },
              { key: "amount", header: "Debit", align: "right", render: (r) => currency(r.amount) },
              { key: "balance", header: "Balance", align: "right", render: (r) => currency(r.balance) },
            ]} />
          </GlassCard>
          <GlassCard>
            <h3 className="mb-3 text-lg font-semibold">Aging Analysis</h3>
            <EChart height={260} option={{
              tooltip: { trigger: "item" },
              series: [{ type: "pie", radius: ["50%", "78%"], padAngle: 3, itemStyle: { borderRadius: 8 },
                data: [
                  { value: 4200, name: "Current" }, { value: 1800, name: "1-30 days" },
                  { value: 900, name: "31-60 days" }, { value: 350, name: "60+ days" },
                ]}],
            }} />
          </GlassCard>
        </div>
      </div>
    );
  },
});
