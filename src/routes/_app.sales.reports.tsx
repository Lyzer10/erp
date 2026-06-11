import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { GlassCard } from "@/components/erp/GlassCard";
import { EChart } from "@/components/charts/EChart";
import { DataTable } from "@/components/erp/DataTable";
import { customers, products, currency } from "@/lib/mock";
import { Download } from "lucide-react";

export const Route = createFileRoute("/_app/sales/reports")({
  head: () => ({ meta: [{ title: "Sales Reports — Lumen ERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Sales Reports" description="Analyze revenue across customers, products, and categories."
        actions={<button className="inline-flex items-center gap-2 rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm font-medium backdrop-blur hover:bg-white/80"><Download className="h-4 w-4" />Export PDF</button>} />
      <TabbedPage tabs={[
        { key: "summary", label: "Summary", render: () => (
          <GlassCard>
            <EChart height={380} option={{
              legend: { data: ["Gross", "Discount", "Net"] },
              xAxis: { type: "category", data: ["Jan","Feb","Mar","Apr","May","Jun"] },
              yAxis: { type: "value" },
              series: [
                { name: "Gross", type: "bar", data: [52000, 58000, 61000, 56000, 67000, 72000], itemStyle: { borderRadius: [6,6,0,0] }, barWidth: 14 },
                { name: "Discount", type: "bar", data: [3200, 3800, 4100, 3500, 4400, 4800], itemStyle: { borderRadius: [6,6,0,0] }, barWidth: 14 },
                { name: "Net", type: "bar", data: [48800, 54200, 56900, 52500, 62600, 67200], itemStyle: { borderRadius: [6,6,0,0] }, barWidth: 14 },
              ],
            }} />
          </GlassCard>
        )},
        { key: "detailed", label: "Detailed", render: () => (
          <DataTable data={customers.slice(0, 15).map((c, i) => ({ id: c.id, customer: c.name, invoices: 4 + i, units: 22 + i * 3, gross: 5400 + i * 320, net: 4900 + i * 290 }))}
            columns={[
              { key: "id", header: "ID" }, { key: "customer", header: "Customer" },
              { key: "invoices", header: "Invoices", align: "right" },
              { key: "units", header: "Units", align: "right" },
              { key: "gross", header: "Gross", align: "right", render: (r) => currency(r.gross) },
              { key: "net", header: "Net", align: "right", render: (r) => currency(r.net) },
            ]} />
        )},
        { key: "by-customer", label: "By Customer", render: () => (
          <GlassCard>
            <EChart height={380} option={{
              grid: { left: 160 },
              xAxis: { type: "value" },
              yAxis: { type: "category", data: customers.slice(0, 8).map((c) => c.name) },
              series: [{ type: "bar", data: customers.slice(0, 8).map(() => Math.round(Math.random() * 80000 + 10000)),
                itemStyle: { borderRadius: [0, 8, 8, 0], color: "#3b82f6" }, barWidth: 14 }],
            }} />
          </GlassCard>
        )},
        { key: "by-product", label: "By Product", render: () => (
          <DataTable data={products.slice(0, 12).map((p) => ({ id: p.id, name: p.name, qty: Math.floor(Math.random()*200), revenue: Math.round(Math.random()*40000) }))}
            columns={[
              { key: "id", header: "Code" }, { key: "name", header: "Product" },
              { key: "qty", header: "Qty Sold", align: "right" },
              { key: "revenue", header: "Revenue", align: "right", render: (r) => currency(r.revenue) },
            ]} />
        )},
        { key: "by-category", label: "By Category", render: () => (
          <GlassCard>
            <EChart height={380} option={{
              tooltip: { trigger: "item" },
              series: [{ type: "pie", radius: ["45%", "75%"], padAngle: 3, itemStyle: { borderRadius: 8 },
                data: [
                  { value: 42000, name: "Beverages" }, { value: 28000, name: "Groceries" },
                  { value: 18000, name: "Electronics" }, { value: 12000, name: "Stationery" },
                  { value: 9000, name: "Household" },
                ]}],
            }} />
          </GlassCard>
        )},
        { key: "collection", label: "Collection", render: () => (
          <GlassCard>
            <EChart height={380} option={{
              legend: { data: ["Billed", "Collected"] },
              xAxis: { type: "category", data: ["Jan","Feb","Mar","Apr","May","Jun"] },
              yAxis: { type: "value" },
              series: [
                { name: "Billed", type: "line", smooth: true, data: [48000, 52000, 56000, 61000, 65000, 72000], lineStyle: { width: 3 } },
                { name: "Collected", type: "line", smooth: true, data: [42000, 47000, 51000, 55000, 60000, 66000], lineStyle: { width: 3 }, areaStyle: {} },
              ],
            }} />
          </GlassCard>
        )},
      ]} />
    </div>
  ),
});
