import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { GlassCard } from "@/components/erp/GlassCard";
import { EChart } from "@/components/charts/EChart";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { products, currency } from "@/lib/mock";
import { useTranslate } from "@/lib/i18n";
import { Plus, History } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { getProductsFn } from "@/lib/api/domain";

export const Route = createFileRoute("/_app/store/stock")({
  head: () => ({ meta: [{ title: "Stock — DeveleERP" }] }),
  loader: () => getProductsFn(),
  component: StockPage,
});

interface LedgerEntry {
  date: string;
  ref: string;
  store: string;
  qty: number;
  balance: number;
}

function StockPage() {
  const initialStockProducts = Route.useLoaderData();
  const { t, lang } = useTranslate();
  const stockProductsData = (initialStockProducts as any)?.data || initialStockProducts;
  const [localProducts, setLocalProducts] = useState((stockProductsData as typeof products) || products);

  const [mockConvertData, setMockConvertData] = useState([
    { 
      from: lang === "en" ? "Sugar 50kg Bag" : "Mfuko wa Sukari 50kg", 
      fromSku: "PROD-001",
      to: lang === "en" ? "Sugar 2kg Pack" : "Paketi ya Sukari 2kg", 
      toSku: "PROD-002",
      ratio: 25 
    },
    { 
      from: lang === "en" ? "Cooking Oil 20L" : "Mafuta ya Kupikia 20L", 
      fromSku: "PROD-003",
      to: lang === "en" ? "Cooking Oil 5L" : "Mafuta ya Kupikia 5L", 
      toSku: "PROD-004",
      ratio: 4 
    },
  ]);

  const [mockAdjustments, setMockAdjustments] = useState(
    products.slice(0, 8).map((p, i) => {
      const reasonsEn = ["Damaged", "Lost", "Found", "Count diff"];
      const reasonsSw = ["Imeharibika", "Imepotea", "Imepatikana", "Tofauti ya Hesabu"];
      return {
        id: `ADJ-${100 + i}`,
        sku: p.sku,
        product: p.name,
        reason: lang === "en" ? reasonsEn[i % 4] : reasonsSw[i % 4],
        qty: i % 2 ? 5 : -3
      };
    })
  );

  // Conversion Modal State
  const [convertOpen, setConvertOpen] = useState(false);
  const [convFromSku, setConvFromSku] = useState("PROD-001");
  const [convToSku, setConvToSku] = useState("PROD-002");
  const [convRatio, setConvRatio] = useState(25);
  const [convQty, setConvQty] = useState(1);
  const [convStore, setConvStore] = useState("Main Store");

  // Ledger Modal State
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);

  const selectedProduct = useMemo(() => {
    return localProducts.find((p) => p.sku === selectedSku);
  }, [localProducts, selectedSku]);

  // Mock ledger details per product
  const productLedgers = useMemo<Record<string, LedgerEntry[]>>(() => {
    return {
      "PROD-001": [
        { date: "2026-06-10", ref: "IBT-1002", store: "Main Store", qty: -10, balance: 140 },
        { date: "2026-06-11", ref: "RCV-3001", store: "Main Store", qty: 50, balance: 190 },
        { date: "2026-06-12", ref: "CONV-101", store: "Main Store", qty: -5, balance: 185 },
      ],
      "PROD-002": [
        { date: "2026-06-08", ref: "SALE-4022", store: "Main Store", qty: -12, balance: 400 },
        { date: "2026-06-12", ref: "CONV-101", store: "Main Store", qty: 125, balance: 525 },
      ]
    };
  }, []);

  const currentLedger = useMemo(() => {
    if (!selectedSku) return [];
    return productLedgers[selectedSku] || [
      { date: "2026-06-12", ref: "INIT-001", store: "Main Store", qty: selectedProduct?.stock || 0, balance: selectedProduct?.stock || 0 }
    ];
  }, [selectedSku, selectedProduct, productLedgers]);

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    const parent = localProducts.find(p => p.sku === convFromSku);
    const child = localProducts.find(p => p.sku === convToSku);

    if (!parent || !child || parent.stock < convQty) {
      alert(lang === "en" ? "Insufficient stock for conversion!" : "Hifadhi haitoshi kwa ubadilishaji!");
      return;
    }

    // Update stock numbers
    setLocalProducts(prev => prev.map(p => {
      if (p.sku === convFromSku) {
        return { ...p, stock: p.stock - convQty };
      }
      if (p.sku === convToSku) {
        return { ...p, stock: p.stock + (convQty * convRatio) };
      }
      return p;
    }));

    // Add to conversions table display
    setMockConvertData(prev => [
      {
        from: parent.name,
        fromSku: convFromSku,
        to: child.name,
        toSku: convToSku,
        ratio: convRatio
      },
      ...prev
    ]);

    setConvertOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t("stock")} 
        description={lang === "en" ? "Stock levels, movements, adjustments, and conversions." : "Viwango vya stoo, mienendo, marekebisho, na ubadilishaji."}
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button
              onClick={() => setConvertOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              {lang === "en" ? "Run Conversion" : "Fanya Ubadilishaji"}
            </button>
          </div>
        } 
      />
      <TabbedPage tabs={[
        { key: "report", label: lang === "en" ? "Stock Report" : "Ripoti ya Stoo", render: () => (
          <DataTable data={localProducts} columns={[
            { key: "sku", header: "SKU" }, 
            { key: "name", header: lang === "en" ? "Product" : "Bidhaa" }, 
            { key: "category", header: t("category") },
            { key: "stock", header: lang === "en" ? "On Hand" : "Zilizopo", align: "right", render: (r: any) => <span className={r.stock < r.reorder ? "font-medium text-rose-600" : ""}>{r.stock}</span> },
            { key: "reorder", header: lang === "en" ? "Reorder" : "Agiza Tena", align: "right" },
            { key: "price", header: lang === "en" ? "Value" : "Thamani", align: "right", render: (r: any) => currency(r.price * r.stock) },
            { 
              key: "action", 
              header: lang === "en" ? "Action" : "Kitendo",
              render: (r: any) => (
                <button
                  onClick={() => {
                    setSelectedSku(r.sku);
                    setLedgerOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <History className="h-3 w-3" />
                  {lang === "en" ? "View Ledger" : "Mwenendo"}
                </button>
              )
            }
          ]} />
        )},
        { key: "movement", label: lang === "en" ? "Movement" : "Mwenendo", render: () => (
          <GlassCard>
            <EChart height={320} option={{
              legend: { top: 0, left: "center", data: [lang === "en" ? "In" : "Ingizo", lang === "en" ? "Out" : "Kutoka"] },
              grid: { top: 40, bottom: 30, left: 10, right: 10, containLabel: true },
              xAxis: { type: "category", data: lang === "en" ? ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] : ["Jumatatu","Jumanne","Jumatano","Alhamisi","Ijumaa","Jumamosi","Jumapili"] },
              yAxis: { type: "value" },
              series: [
                { name: lang === "en" ? "In" : "Ingizo", type: "bar", data: [120, 180, 90, 220, 160, 80, 50], itemStyle: { borderRadius: [6,6,0,0], color: "#3b82f6" }, barWidth: 18 },
                { name: lang === "en" ? "Out" : "Kutoka", type: "bar", data: [90, 110, 150, 180, 200, 60, 30], itemStyle: { borderRadius: [6,6,0,0], color: "#10b981" }, barWidth: 18 },
              ],
            }} />
          </GlassCard>
        )},
        { key: "by-product", label: lang === "en" ? "By Product" : "Kwa Bidhaa", render: () => (
          <DataTable data={localProducts.slice(0, 12).map((p) => ({ ...p, in: 120 + p.stock % 50, out: 80 + p.stock % 40 }))}
            columns={[
              { key: "sku", header: "SKU" }, 
              { key: "name", header: lang === "en" ? "Product" : "Bidhaa" },
              { key: "in", header: lang === "en" ? "In" : "Ingizo", align: "right" }, 
              { key: "out", header: lang === "en" ? "Out" : "Kutoka", align: "right" },
              { key: "stock", header: lang === "en" ? "Balance" : "Salio", align: "right" },
              { 
                key: "action", 
                header: lang === "en" ? "Action" : "Kitendo",
                render: (r: any) => (
                  <button
                    onClick={() => {
                      setSelectedSku(r.sku);
                      setLedgerOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <History className="h-3 w-3" />
                    {lang === "en" ? "View Ledger" : "Mwenendo"}
                  </button>
                )
              }
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
              { key: "qty", header: lang === "en" ? "Qty" : "Idadi", align: "right", render: (r: any) => <span className={r.qty < 0 ? "text-rose-600" : "text-emerald-600"}>{r.qty > 0 ? "+" : ""}{r.qty}</span> }
            ]} 
          />
        )},
        { key: "convert", label: lang === "en" ? "Convert" : "Badilisha", render: () => (
          <DataTable data={mockConvertData} 
            columns={[
              { key: "from", header: lang === "en" ? "From" : "Kutoka" }, 
              { key: "to", header: lang === "en" ? "To" : "Kwenda" }, 
              { key: "ratio", header: lang === "en" ? "Ratio" : "Uwiano", render: (r: any) => `1:${r.ratio}` }
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

      {/* Run Conversion Modal */}
      <Dialog open={convertOpen} onOpenChange={setConvertOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {lang === "en" ? "Run Stock Conversion" : "Fanya Ubadilishaji wa Stoo"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleConvert} className="space-y-4 text-sm mt-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {lang === "en" ? "From Product (Source)" : "Kutoka Bidhaa (Chanzo)"}
                </label>
                <select
                  value={convFromSku}
                  onChange={(e) => setConvFromSku(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {localProducts.map(p => (
                    <option key={p.sku} value={p.sku}>{p.name} ({lang === "en" ? "Qty" : "Idadi"}: {p.stock})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {lang === "en" ? "To Product (Target)" : "Kwenda Bidhaa (Lengo)"}
                </label>
                <select
                  value={convToSku}
                  onChange={(e) => setConvToSku(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {localProducts.map(p => (
                    <option key={p.sku} value={p.sku}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {lang === "en" ? "Quantity to Convert" : "Kiasi cha Kubadilisha"}
                </label>
                <input
                  type="number"
                  min="1"
                  value={convQty}
                  onChange={(e) => setConvQty(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {lang === "en" ? "Conversion Ratio" : "Uwiano wa Kubadilisha"}
                </label>
                <input
                  type="number"
                  min="1"
                  value={convRatio}
                  onChange={(e) => setConvRatio(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {lang === "en" ? "Warehouse / Store" : "Ghala / Stoo"}
                </label>
                <select
                  value={convStore}
                  onChange={(e) => setConvStore(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Main Store">Main Store</option>
                  <option value="Westlands">Westlands</option>
                  <option value="Mombasa Store">Mombasa Store</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setConvertOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                {lang === "en" ? "Cancel" : "Ghairi"}
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 cursor-pointer"
              >
                {lang === "en" ? "Execute Conversion" : "Tekeleza Ubadilishaji"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Movement History Modal */}
      <Dialog open={ledgerOpen} onOpenChange={setLedgerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {lang === "en" ? "Stock Movement History" : "Kumbukumbu ya Mzunguko wa Stoo"}
              {selectedProduct && <span className="text-blue-600 ml-1">({selectedProduct.name})</span>}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <DataTable
              data={currentLedger}
              pageSize={5}
              columns={[
                { key: "date", header: lang === "en" ? "Date" : "Tarehe" },
                { key: "ref", header: lang === "en" ? "Reference" : "Rejea" },
                { key: "store", header: lang === "en" ? "Store" : "Stoo" },
                { 
                  key: "qty", 
                  header: lang === "en" ? "Quantity" : "Idadi", 
                  align: "right",
                  render: (r: any) => (
                    <span className={r.qty < 0 ? "text-rose-600 font-medium" : "text-emerald-600 font-medium"}>
                      {r.qty > 0 ? "+" : ""}{r.qty}
                    </span>
                  ) 
                },
                { key: "balance", header: lang === "en" ? "Balance" : "Salio", align: "right" }
              ]}
            />
            <div className="flex justify-end border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setLedgerOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                {lang === "en" ? "Close" : "Funga"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
