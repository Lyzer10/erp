import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { GlassCard } from "@/components/erp/GlassCard";
import { EChart } from "@/components/charts/EChart";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { products, currency } from "@/lib/mock";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/_app/store/stock")({
  head: () => ({ meta: [{ title: "Stock — DeveleERP" }] }),
  component: StockPage,
});

function StockPage() {
  const { t, lang } = useTranslate();

  const mockConvertData = [
    { 
      from: lang === "en" ? "Sugar 50kg Bag" : "Mfuko wa Sukari 50kg", 
      to: lang === "en" ? "Sugar 2kg Pack" : "Paketi ya Sukari 2kg", 
      ratio: "1:25" 
    },
    { 
      from: lang === "en" ? "Cooking Oil 20L" : "Mafuta ya Kupikia 20L", 
      to: lang === "en" ? "Cooking Oil 5L" : "Mafuta ya Kupikia 5L", 
      ratio: "1:4" 
    },
    { 
      from: lang === "en" ? "Coffee 25kg" : "Kahawa 25kg", 
      to: lang === "en" ? "Coffee 1kg" : "Kahawa 1kg", 
      ratio: "1:25" 
    },
  ];

  const mockAdjustments = products.slice(0, 8).map((p, i) => {
    const reasonsEn = ["Damaged", "Lost", "Found", "Count diff"];
    const reasonsSw = ["Imeharibika", "Imepotea", "Imepatikana", "Tofauti ya Hesabu"];
    return {
      id: `ADJ-${100 + i}`,
      sku: p.sku,
      product: p.name,
      reason: lang === "en" ? reasonsEn[i % 4] : reasonsSw[i % 4],
      qty: i % 2 ? 5 : -3
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t("stock")} 
        description={lang === "en" ? "Stock levels, movements, adjustments, and conversions." : "Viwango vya stoo, mienendo, marekebisho, na ubadilishaji."}
        actions={<ExportMenu />} 
      />
      <TabbedPage tabs={[
        { key: "report", label: lang === "en" ? "Stock Report" : "Ripoti ya Stoo", render: () => (
          <DataTable data={products} columns={[
            { key: "sku", header: "SKU" }, 
            { key: "name", header: lang === "en" ? "Product" : "Bidhaa" }, 
            { key: "category", header: t("category") },
            { key: "stock", header: lang === "en" ? "On Hand" : "Zilizopo", align: "right", render: (r) => <span className={r.stock < r.reorder ? "font-medium text-rose-600" : ""}>{r.stock}</span> },
            { key: "reorder", header: lang === "en" ? "Reorder" : "Agiza Tena", align: "right" },
            { key: "price", header: lang === "en" ? "Value" : "Thamani", align: "right", render: (r) => currency(r.price * r.stock) },
          ]} />
        )},
        { key: "movement", label: lang === "en" ? "Movement" : "Mwenendo", render: () => (
          <GlassCard>
            <EChart height={320} option={{
              legend: { data: [lang === "en" ? "In" : "Ingizo", lang === "en" ? "Out" : "Kutoka"] },
              xAxis: { type: "category", data: lang === "en" ? ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] : ["Jumatatu","Jumanne","Jumatano","Alhamisi","Ijumaa","Jumamosi","Jumapili"] },
              yAxis: { type: "value" },
              series: [
                { name: lang === "en" ? "In" : "Ingizo", type: "bar", data: [120, 180, 90, 220, 160, 80, 50], itemStyle: { borderRadius: [6,6,0,0] }, barWidth: 18 },
                { name: lang === "en" ? "Out" : "Kutoka", type: "bar", data: [90, 110, 150, 180, 200, 60, 30], itemStyle: { borderRadius: [6,6,0,0] }, barWidth: 18 },
              ],
            }} />
          </GlassCard>
        )},
        { key: "by-product", label: lang === "en" ? "By Product" : "Kwa Bidhaa", render: () => (
          <DataTable data={products.slice(0, 12).map((p) => ({ ...p, in: 120 + p.stock % 50, out: 80 + p.stock % 40 }))}
            columns={[
              { key: "sku", header: "SKU" }, 
              { key: "name", header: lang === "en" ? "Product" : "Bidhaa" },
              { key: "in", header: lang === "en" ? "In" : "Ingizo", align: "right" }, 
              { key: "out", header: lang === "en" ? "Out" : "Kutoka", align: "right" },
              { key: "stock", header: lang === "en" ? "Balance" : "Salio", align: "right" }
            ]} 
          />
        )},
        { key: "adjust", label: lang === "en" ? "Adjust Stock" : "Rekebisha Stoo", render: () => (
          <DataTable data={mockAdjustments}
            columns={[
              { key: "id", header: lang === "en" ? "Adj #" : "Marekebisho #" }, 
              { key: "sku", header: "SKU" }, 
              { key: "product", header: lang === "en" ? "Product" : "Bidhaa" },
              { key: "reason", header: lang === "en" ? "Reason" : "Sababu" }, 
              { key: "qty", header: lang === "en" ? "Qty" : "Idadi", align: "right", render: (r) => <span className={r.qty < 0 ? "text-rose-600" : "text-emerald-600"}>{r.qty > 0 ? "+" : ""}{r.qty}</span> }
            ]} 
          />
        )},
        { key: "convert", label: lang === "en" ? "Convert" : "Badilisha", render: () => (
          <DataTable data={mockConvertData} 
            columns={[
              { key: "from", header: lang === "en" ? "From" : "Kutoka" }, 
              { key: "to", header: lang === "en" ? "To" : "Kwenda" }, 
              { key: "ratio", header: lang === "en" ? "Ratio" : "Uwiano" }
            ]} 
          />
        )},
        { key: "import", label: lang === "en" ? "Import Stock" : "Ingiza Bidhaa za Stoo", render: () => (
          <GlassCard>
            <p className="text-sm text-muted-foreground">
              {lang === "en" ? "Upload a stock import file to bulk update inventory." : "Pakia faili la kuingiza stoo ili kusasisha hesabu ya bidhaa kwa jumla."}
            </p>
          </GlassCard>
        )},
      ]} />
    </div>
  );
}
