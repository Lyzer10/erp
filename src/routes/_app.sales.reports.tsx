import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { GlassCard } from "@/components/erp/GlassCard";
import { EChart } from "@/components/charts/EChart";
import { DataTable } from "@/components/erp/DataTable";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { customers, products, currency } from "@/lib/mock";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/_app/sales/reports")({
  head: () => ({ meta: [{ title: "Sales Reports — DeveleERP" }] }),
  component: SalesReportsPage,
});

function SalesReportsPage() {
  const { t, lang } = useTranslate();

  const detailedData = customers.slice(0, 15).map((c, i) => ({ 
    id: c.id, 
    customer: c.name, 
    invoices: 4 + i, 
    units: 22 + i * 3, 
    gross: (5400 + i * 320) * 1000, 
    net: (4900 + i * 290) * 1000 
  }));

  const byProductData = products.slice(0, 12).map((p) => ({ 
    id: p.id, 
    name: p.name, 
    qty: Math.floor(Math.random() * 200), 
    revenue: Math.round(Math.random() * 40000) * 1000 
  }));

  const categoriesMap: Record<string, string> = {
    Beverages: lang === "en" ? "Beverages" : "Vinywaji",
    Groceries: lang === "en" ? "Groceries" : "Bidhaa za Vyakula",
    Electronics: lang === "en" ? "Electronics" : "Vifaa vya Umeme",
    Stationery: lang === "en" ? "Stationery" : "Vifaa vya Ofisi",
    Household: lang === "en" ? "Household" : "Bidhaa za Nyumbani",
  };

  const categoriesData = [
    { value: 42000, name: "Beverages" }, 
    { value: 28000, name: "Groceries" },
    { value: 18000, name: "Electronics" }, 
    { value: 12000, name: "Stationery" },
    { value: 9000, name: "Household" },
  ].map(item => ({
    value: item.value * 1000,
    name: categoriesMap[item.name] || item.name
  }));

  return (
    <div className="space-y-6">
      <PageHeader 
        title={lang === "en" ? "Sales Reports" : "Ripoti za Mauzo"} 
        description={lang === "en" ? "Analyze revenue across customers, products, and categories." : "Changanua mapato kwa wateja, bidhaa, na makundi."}
        actions={<ExportMenu />} 
      />
      <TabbedPage tabs={[
        { key: "summary", label: lang === "en" ? "Summary Dashboard" : "Muhtasari wa Dashibodi", render: () => (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div className="glass-card p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{lang === "en" ? "Gross Sales" : "Mauzo Ghafi"}</p>
                  <p className="mt-1 text-lg font-black text-slate-800">TZS 365,000,000</p>
                  <p className="text-[10px] font-medium text-emerald-600 mt-0.5">↑ +12% {lang === "en" ? "from last month" : "kutoka mwezi jana"}</p>
                </div>
              </div>
              <div className="glass-card p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{lang === "en" ? "Net Revenue" : "Mapato Halisi"}</p>
                  <p className="mt-1 text-lg font-black text-slate-800">TZS 342,200,000</p>
                  <p className="text-[10px] font-medium text-emerald-600 mt-0.5">↑ +8.5% {lang === "en" ? "this quarter" : "robo hii ya mwaka"}</p>
                </div>
              </div>
              <div className="glass-card p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{lang === "en" ? "Total Invoices" : "Jumla ya Ankara"}</p>
                  <p className="mt-1 text-lg font-black text-slate-800">378 {lang === "en" ? "Issued" : "Zilizotolewa"}</p>
                  <p className="text-[10px] font-medium text-amber-600 mt-0.5">{lang === "en" ? "Avg TZS 905k per sale" : "Wastani TZS 905k kwa mauzo"}</p>
                </div>
              </div>
            </div>

            {/* Grid of charts */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <GlassCard className="h-full">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">{lang === "en" ? "Monthly Revenue Performance" : "Mwenendo wa Mapato ya Kila Mwezi"}</h3>
                  <EChart height={320} option={{
                    tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, confine: true },
                    legend: { top: 0, left: "center", data: lang === "en" ? ["Gross", "Discount", "Net"] : ["Ghafi", "Punguzo", "Halisi"] },
                    grid: { top: 40, bottom: 30, left: 10, right: 10, containLabel: true },
                    xAxis: { type: "category", data: lang === "en" ? ["Jan","Feb","Mar","Apr","May","Jun"] : ["Jan","Feb","Mac","Apr","Mei","Jun"] },
                    yAxis: { type: "value" },
                    series: [
                      { name: lang === "en" ? "Gross" : "Ghafi", type: "bar", data: [52000000, 58000000, 61000000, 56000000, 67000000, 72000000], itemStyle: { borderRadius: [6,6,0,0], color: "#1f9c88" }, barWidth: 10 },
                      { name: lang === "en" ? "Discount" : "Punguzo", type: "bar", data: [3200000, 3800000, 4100000, 3500000, 4400000, 4800000], itemStyle: { borderRadius: [6,6,0,0], color: "#e11d48" }, barWidth: 10 },
                      { name: lang === "en" ? "Net" : "Halisi", type: "bar", data: [48800000, 54200000, 56900000, 52500000, 62600000, 67200000], itemStyle: { borderRadius: [6,6,0,0], color: "#3b82f6" }, barWidth: 10 },
                    ],
                  }} />
                </GlassCard>
              </div>

              <div className="lg:col-span-4">
                <GlassCard className="h-full">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">{lang === "en" ? "Sales by Category" : "Mauzo kwa Kategoria"}</h3>
                  <EChart height={320} option={{
                    tooltip: { trigger: "item", confine: true },
                    series: [{ 
                      type: "pie", 
                      radius: ["35%", "60%"], 
                      center: ["50%", "50%"],
                      padAngle: 3, 
                      itemStyle: { borderRadius: 8 },
                      data: categoriesData
                    }],
                  }} />
                </GlassCard>
              </div>
            </div>

            {/* Bottom detailed table */}
            <div className="glass-card p-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{lang === "en" ? "Top 5 High-Value Invoices" : "Ankara 5 za Thamani ya Juu"}</h3>
              <DataTable
                searchable={false}
                pageSize={5}
                data={detailedData.slice(0, 5)}
                columns={[
                  { key: "id", header: "Ref ID" },
                  { key: "customer", header: lang === "en" ? "Customer" : "Mteja" },
                  { key: "invoices", header: lang === "en" ? "Invoices Count" : "Idadi ya Ankara", align: "right" },
                  { key: "gross", header: lang === "en" ? "Gross Value" : "Thamani Ghafi", align: "right", render: (r) => currency(r.gross) },
                  { key: "net", header: lang === "en" ? "Net Received" : "Kiasi Halisi Kimepokelewa", align: "right", render: (r) => currency(r.net) },
                ]}
              />
            </div>
          </div>
        )},
        { key: "detailed", label: lang === "en" ? "Detailed" : "Kina", render: () => (
          <DataTable data={detailedData}
            columns={[
              { key: "id", header: "ID" }, 
              { key: "customer", header: lang === "en" ? "Customer" : "Mteja" },
              { key: "invoices", header: lang === "en" ? "Invoices" : "Ankara", align: "right" },
              { key: "units", header: lang === "en" ? "Units" : "Vitengo", align: "right" },
              { key: "gross", header: lang === "en" ? "Gross" : "Ghafi", align: "right", render: (r) => currency(r.gross) },
              { key: "net", header: lang === "en" ? "Net" : "Halisi", align: "right", render: (r) => currency(r.net) },
            ]} 
          />
        )},
        { key: "by-customer", label: lang === "en" ? "By Customer" : "Kwa Mteja", render: () => (
          <GlassCard>
            <EChart height={380} option={{
              tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, confine: true },
              grid: { left: 160 },
              xAxis: { type: "value" },
              yAxis: { type: "category", data: customers.slice(0, 8).map((c) => c.name) },
              series: [{ 
                type: "bar", 
                data: customers.slice(0, 8).map(() => Math.round(Math.random() * 80000 + 10000) * 1000),
                itemStyle: { borderRadius: [0, 8, 8, 0], color: "#3b82f6" }, 
                barWidth: 14 
              }],
            }} />
          </GlassCard>
        )},
        { key: "by-product", label: lang === "en" ? "By Product" : "Kwa Bidhaa", render: () => (
          <DataTable data={byProductData}
            columns={[
              { key: "id", header: lang === "en" ? "Code" : "Msimbo" }, 
              { key: "name", header: lang === "en" ? "Product" : "Bidhaa" },
              { key: "qty", header: lang === "en" ? "Qty Sold" : "Kiwango Kilichouzwa", align: "right" },
              { key: "revenue", header: lang === "en" ? "Revenue" : "Mapato", align: "right", render: (r) => currency(r.revenue) },
            ]} 
          />
        )},
        { key: "by-category", label: lang === "en" ? "By Category" : "Kwa Kundi", render: () => (
          <GlassCard>
            <EChart height={380} option={{
              tooltip: { trigger: "item", confine: true },
              series: [{ 
                type: "pie", 
                radius: ["45%", "75%"], 
                padAngle: 3, 
                itemStyle: { borderRadius: 8 },
                data: categoriesData
              }],
            }} />
          </GlassCard>
        )},
        { key: "collection", label: lang === "en" ? "Collection" : "Makusanyo", render: () => (
          <GlassCard>
            <EChart height={380} option={{
              tooltip: { trigger: "axis", confine: true },
              legend: { top: 0, left: "center", data: lang === "en" ? ["Billed", "Collected"] : ["Zilizodaiwa", "Zilizokusanywa"] },
              grid: { top: 40, bottom: 30, left: 10, right: 10, containLabel: true },
              xAxis: { type: "category", data: lang === "en" ? ["Jan","Feb","Mar","Apr","May","Jun"] : ["Jan","Feb","Mac","Apr","Mei","Jun"] },
              yAxis: { type: "value" },
              series: [
                { name: lang === "en" ? "Billed" : "Zilizodaiwa", type: "line", smooth: true, data: [48000000, 52000000, 56000000, 61000000, 65000000, 72000000], lineStyle: { width: 3 } },
                { name: lang === "en" ? "Collected" : "Zilizokusanywa", type: "line", smooth: true, data: [42000000, 47000000, 51000000, 55000000, 60000000, 66000000], lineStyle: { width: 3 }, areaStyle: {} },
              ],
            }} />
          </GlassCard>
        )},
      ]} />
    </div>
  );
}
