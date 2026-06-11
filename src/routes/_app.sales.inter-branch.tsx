import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { GlassCard } from "@/components/erp/GlassCard";
import { EChart } from "@/components/charts/EChart";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { products, currency } from "@/lib/mock";
import { ArrowLeftRight } from "lucide-react";

const transfers = Array.from({ length: 14 }, (_, i) => ({
  id: `IBT-${3000 + i}`,
  from: ["Main", "Westlands", "Mombasa Rd"][i % 3],
  to: ["Westlands", "Mombasa Rd", "Main"][i % 3],
  items: 3 + (i % 6),
  value: Math.round(Math.random() * 12000 + 500),
  date: new Date(Date.now() - i * 86400000 * 2).toISOString().slice(0, 10),
  status: ["Pending", "Approved", "Completed"][i % 3],
}));

export const Route = createFileRoute("/_app/sales/inter-branch")({
  head: () => ({ meta: [{ title: "Inter-Branch — DeveleERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Inter-Branch Operations" description="Transfer stock between branches and track receipts."
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md"><ArrowLeftRight className="h-4 w-4" />New Transfer</button>
          </div>
        } />
      <TabbedPage tabs={[
        { key: "transfer", label: "Create Transfer", render: () => (
          <GlassCard>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="text-xs font-medium text-muted-foreground">From Branch</label>
                <select className="mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm"><option>Main Branch</option><option>Westlands</option></select></div>
              <div><label className="text-xs font-medium text-muted-foreground">To Branch</label>
                <select className="mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm"><option>Westlands</option><option>Mombasa Rd</option></select></div>
            </div>
            <h3 className="mt-6 mb-2 text-sm font-semibold">Items</h3>
            <DataTable searchable={false} data={products.slice(0,4).map((p) => ({ ...p, qty: 10 }))} columns={[
              { key: "name", header: "Product" }, { key: "sku", header: "SKU" },
              { key: "qty", header: "Qty", align: "right" },
              { key: "price", header: "Value", align: "right", render: (r) => currency((r as any).price * (r as any).qty) },
            ]} />
          </GlassCard>
        )},
        { key: "list", label: "Transfers List", render: () => (
          <DataTable data={transfers} columns={[
            { key: "id", header: "Transfer #" }, { key: "from", header: "From" }, { key: "to", header: "To" },
            { key: "items", header: "Items", align: "right" },
            { key: "value", header: "Value", align: "right", render: (r) => currency(r.value) },
            { key: "date", header: "Date" },
            { key: "status", header: "Status", render: (r) => <StatusPill status={r.status} /> },
          ]} />
        )},
        { key: "report", label: "Report", render: () => (
          <GlassCard>
            <EChart height={320} option={{
              legend: { data: ["Outgoing", "Incoming"] },
              xAxis: { type: "category", data: ["Main", "Westlands", "Mombasa Rd", "Kisumu"] },
              yAxis: { type: "value" },
              series: [
                { name: "Outgoing", type: "bar", data: [12, 8, 14, 6], itemStyle: { borderRadius: [6,6,0,0] }, barWidth: 22 },
                { name: "Incoming", type: "bar", data: [9, 11, 7, 10], itemStyle: { borderRadius: [6,6,0,0] }, barWidth: 22 },
              ],
            }} />
          </GlassCard>
        )},
        { key: "receive", label: "Receive Stock", render: () => (
          <DataTable data={transfers.filter(t => t.status === "Pending")} columns={[
            { key: "id", header: "Transfer #" }, { key: "from", header: "From" },
            { key: "items", header: "Items", align: "right" },
            { key: "date", header: "Date" },
            { key: "status", header: "Status", render: (r) => <StatusPill status={r.status} /> },
          ]} />
        )},
      ]} />
    </div>
  ),
});
