import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { GlassCard } from "@/components/erp/GlassCard";
import { EChart } from "@/components/charts/EChart";
import { products, currency } from "@/lib/mock";

export const Route = createFileRoute("/_app/store/stock")({
  head: () => ({ meta: [{ title: "Stock — Lumen ERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Stock" description="Stock levels, movements, adjustments, and conversions." />
      <TabbedPage tabs={[
        { key: "report", label: "Stock Report", render: () => (
          <DataTable data={products} columns={[
            { key: "sku", header: "SKU" }, { key: "name", header: "Product" }, { key: "category", header: "Category" },
            { key: "stock", header: "On Hand", align: "right", render: (r) => <span className={r.stock < r.reorder ? "font-medium text-rose-600" : ""}>{r.stock}</span> },
            { key: "reorder", header: "Reorder", align: "right" },
            { key: "price", header: "Value", align: "right", render: (r) => currency(r.price * r.stock) },
          ]} />
        )},
        { key: "movement", label: "Movement", render: () => (
          <GlassCard>
            <EChart height={320} option={{
              legend: { data: ["In", "Out"] },
              xAxis: { type: "category", data: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] },
              yAxis: { type: "value" },
              series: [
                { name: "In", type: "bar", data: [120, 180, 90, 220, 160, 80, 50], itemStyle: { borderRadius: [6,6,0,0] }, barWidth: 18 },
                { name: "Out", type: "bar", data: [90, 110, 150, 180, 200, 60, 30], itemStyle: { borderRadius: [6,6,0,0] }, barWidth: 18 },
              ],
            }} />
          </GlassCard>
        )},
        { key: "by-product", label: "By Product", render: () => (
          <DataTable data={products.slice(0,12).map((p)=>({ ...p, in:120+p.stock%50, out:80+p.stock%40 }))}
            columns={[{ key:"sku", header:"SKU" }, { key:"name", header:"Product" },
              { key:"in", header:"In", align:"right" }, { key:"out", header:"Out", align:"right" },
              { key:"stock", header:"Balance", align:"right" }]} />
        )},
        { key: "adjust", label: "Adjust Stock", render: () => (
          <DataTable data={products.slice(0,8).map((p,i)=>({ id:`ADJ-${100+i}`, sku:p.sku, product:p.name, reason:["Damaged","Lost","Found","Count diff"][i%4], qty:i%2?5:-3 }))}
            columns={[{ key:"id", header:"Adj #" }, { key:"sku", header:"SKU" }, { key:"product", header:"Product" },
              { key:"reason", header:"Reason" }, { key:"qty", header:"Qty", align:"right", render:(r)=><span className={r.qty<0?"text-rose-600":"text-emerald-600"}>{r.qty>0?"+":""}{r.qty}</span> }]} />
        )},
        { key: "convert", label: "Convert", render: () => (
          <DataTable data={[
            { from:"Sugar 50kg Bag", to:"Sugar 2kg Pack", ratio:"1:25" },
            { from:"Cooking Oil 20L", to:"Cooking Oil 5L", ratio:"1:4" },
            { from:"Coffee 25kg", to:"Coffee 1kg", ratio:"1:25" },
          ]} columns={[{ key:"from", header:"From" }, { key:"to", header:"To" }, { key:"ratio", header:"Ratio" }]} />
        )},
        { key: "import", label: "Import Stock", render: () => (
          <GlassCard><p className="text-sm text-muted-foreground">Upload a stock import file to bulk update inventory.</p></GlassCard>
        )},
      ]} />
    </div>
  ),
});
