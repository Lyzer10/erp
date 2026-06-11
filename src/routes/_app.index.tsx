import { createFileRoute } from "@tanstack/react-router";
import { KpiCard } from "@/components/erp/KpiCard";
import { PageHeader } from "@/components/erp/PageHeader";
import { GlassCard } from "@/components/erp/GlassCard";
import { EChart } from "@/components/charts/EChart";
import { StatusPill } from "@/components/erp/StatusPill";
import { DollarSign, ShoppingCart, Users, Package, ArrowUpRight } from "lucide-react";
import { invoices, currency } from "@/lib/mock";

export const Route = createFileRoute("/_app/")({
  head: () => ({ meta: [{ title: "Dashboard — Lumen ERP" }, { name: "description", content: "Business performance overview." }] }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Good morning, Aisha"
        description="Here's what's happening across your business today."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Revenue" value={currency(284350)} delta={12.4} hint="vs last month" icon={DollarSign} tint="blue" />
        <KpiCard label="Invoices" value="1,284" delta={8.2} hint="42 pending" icon={ShoppingCart} tint="emerald" />
        <KpiCard label="Active Customers" value="486" delta={3.1} hint="22 new" icon={Users} tint="violet" />
        <KpiCard label="Products in Stock" value="3,254" delta={-2.4} hint="12 low stock" icon={Package} tint="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Revenue vs Expenses</h2>
              <p className="text-xs text-muted-foreground">Last 6 months performance</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              <ArrowUpRight className="h-3 w-3" /> +18.2%
            </span>
          </div>
          <EChart height={320} option={{
            legend: { data: ["Revenue", "Expenses", "Profit"] },
            xAxis: { type: "category", data: ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"], axisLine: { lineStyle: { color: "#cbd5e1" } } },
            yAxis: { type: "value", splitLine: { lineStyle: { color: "#e2e8f0" } } },
            series: [
              { name: "Revenue", type: "bar", data: [42000, 48500, 51200, 49000, 58700, 62100, 68400], itemStyle: { borderRadius: [8, 8, 0, 0] }, barWidth: 16 },
              { name: "Expenses", type: "bar", data: [28000, 31200, 30800, 32400, 36000, 38200, 39500], itemStyle: { borderRadius: [8, 8, 0, 0] }, barWidth: 16 },
              { name: "Profit", type: "line", smooth: true, data: [14000, 17300, 20400, 16600, 22700, 23900, 28900], lineStyle: { width: 3 }, symbolSize: 8 },
            ],
          }} />
        </GlassCard>

        <GlassCard>
          <h2 className="mb-4 text-lg font-semibold">Sales by Category</h2>
          <EChart height={320} option={{
            tooltip: { trigger: "item" },
            legend: { bottom: 0, textStyle: { fontSize: 11 } },
            series: [{
              type: "pie", radius: ["55%", "80%"], avoidLabelOverlap: true,
              label: { show: false }, padAngle: 3, itemStyle: { borderRadius: 8 },
              data: [
                { value: 42, name: "Beverages" },
                { value: 28, name: "Groceries" },
                { value: 18, name: "Electronics" },
                { value: 12, name: "Stationery" },
              ],
            }],
          }} />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard>
          <h2 className="mb-4 text-lg font-semibold">Cash Flow</h2>
          <EChart height={240} option={{
            xAxis: { type: "category", data: ["W1", "W2", "W3", "W4"], axisLine: { lineStyle: { color: "#cbd5e1" } } },
            yAxis: { type: "value", splitLine: { lineStyle: { color: "#e2e8f0" } } },
            series: [{
              type: "line", smooth: true, data: [12400, 15800, 13200, 18600],
              areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [
                { offset: 0, color: "rgba(59,130,246,0.4)" }, { offset: 1, color: "rgba(59,130,246,0)" }] } },
              lineStyle: { width: 3 }, symbolSize: 8,
            }],
          }} />
        </GlassCard>

        <GlassCard>
          <h2 className="mb-4 text-lg font-semibold">Top Products</h2>
          <EChart height={240} option={{
            grid: { left: 100, right: 20, top: 10, bottom: 20 },
            xAxis: { type: "value", splitLine: { lineStyle: { color: "#e2e8f0" } } },
            yAxis: { type: "category", data: ["LED Bulb", "Coffee 1kg", "Sugar 2kg", "Sanitizer", "Cooking Oil"], axisLine: { show: false } },
            series: [{
              type: "bar", data: [320, 280, 210, 190, 165],
              itemStyle: { borderRadius: [0, 8, 8, 0], color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [
                { offset: 0, color: "#10b981" }, { offset: 1, color: "#3b82f6" }] } },
              barWidth: 14,
            }],
          }} />
        </GlassCard>

        <GlassCard>
          <h2 className="mb-4 text-lg font-semibold">Recent Invoices</h2>
          <div className="space-y-2">
            {invoices.slice(0, 5).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg bg-white/40 p-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{inv.customer}</p>
                  <p className="text-xs text-muted-foreground">{inv.id} · {inv.date}</p>
                </div>
                <div className="ml-3 text-right">
                  <p className="text-sm font-semibold">{currency(inv.amount)}</p>
                  <StatusPill status={inv.status} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
