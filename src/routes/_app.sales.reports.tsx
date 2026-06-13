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
        { key: "summary", label: lang === "en" ? "Summary" : "Muhtasari", render: () => (
          <GlassCard>
            <EChart height={380} option={{
              tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, confine: true },
              legend: { data: lang === "en" ? ["Gross", "Discount", "Net"] : ["Ghafi", "Punguzo", "Halisi"] },
              xAxis: { type: "category", data: lang === "en" ? ["Jan","Feb","Mar","Apr","May","Jun"] : ["Jan","Feb","Mac","Apr","Mei","Jun"] },
              yAxis: { type: "value" },
              series: [
                { name: lang === "en" ? "Gross" : "Ghafi", type: "bar", data: [52000000, 58000000, 61000000, 56000000, 67000000, 72000000], itemStyle: { borderRadius: [6,6,0,0] }, barWidth: 14 },
                { name: lang === "en" ? "Discount" : "Punguzo", type: "bar", data: [3200000, 3800000, 4100000, 3500000, 4400000, 4800000], itemStyle: { borderRadius: [6,6,0,0] }, barWidth: 14 },
                { name: lang === "en" ? "Net" : "Halisi", type: "bar", data: [48800000, 54200000, 56900000, 52500000, 62600000, 67200000], itemStyle: { borderRadius: [6,6,0,0] }, barWidth: 14 },
              ],
            }} />
          </GlassCard>
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
              legend: { data: lang === "en" ? ["Billed", "Collected"] : ["Zilizodaiwa", "Zilizokusanywa"] },
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
