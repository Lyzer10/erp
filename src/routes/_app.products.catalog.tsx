import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { products as initialProducts, currency } from "@/lib/mock";
import { Plus, Printer, Upload, Barcode, Download, X, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/products/catalog")({
  head: () => ({ meta: [{ title: "Products & Services — DeveleERP" }] }),
  component: CatalogPage,
});

type Product = {
  id: string;
  sku: string;
  name: string;
  type?: string;
  category: string;
  brand: string;
  price: number;
  cost: number;
  stock: number;
  reorder: number;
  image?: string;
};

type Brand = {
  code: string;
  name: string;
  products: number;
  active: boolean;
  description?: string;
};

const PRODUCT_TYPE_TRANSLATIONS: Record<string, Record<string, string>> = {
  Goods: { en: "Goods", sw: "Bidhaa za Kawaida" },
  Service: { en: "Service", sw: "Huduma" },
  "Raw Material": { en: "Raw Material", sw: "Malighafi" },
  "Fixed Asset": { en: "Fixed Asset", sw: "Rasilimali ya Kudumu" },
  "Intangible Asset": { en: "Intangible Asset", sw: "Rasilimali Isiyoonekana" },
};

function CatalogPage() {
  const { lang, t } = useTranslate();
  const [productsList, setProductsList] = useState<Product[]>(
    initialProducts.map((p, idx) => ({
      ...p,
      type: idx % 4 === 0 ? "Service" : idx % 7 === 0 ? "Raw Material" : "Goods",
    }))
  );

  const [brandsList, setBrandsList] = useState<Brand[]>([
    { code: "BR-100", name: "Brava", products: 6, active: true, description: "Premium coffee beans and grounds" },
    { code: "BR-101", name: "Northstar", products: 6, active: true, description: "Outdoor sporting goods and clothing" },
    { code: "BR-102", name: "Helios", products: 6, active: true, description: "Advanced lighting and small appliances" },
    { code: "BR-103", name: "Verde", products: 6, active: true, description: "Biodegradable organic household items" },
    { code: "BR-104", name: "Apex", products: 6, active: true, description: "Ergonomic workspace items and accessories" },
  ]);

  const [productOpen, setProductOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);

  const handleCreateProduct = (newProduct: Omit<Product, "id" | "sku">) => {
    const nextSkuNum = 4000 + productsList.length + 1;
    const nextPrdNum = 3000 + productsList.length + 1;
    const addedProduct: Product = {
      id: `PRD-${nextPrdNum}`,
      sku: `SKU-${nextSkuNum}`,
      ...newProduct,
    };

    setProductsList(prev => [addedProduct, ...prev]);

    if (newProduct.brand) {
      setBrandsList(prev =>
        prev.map(b =>
          b.name.toLowerCase() === newProduct.brand.toLowerCase()
            ? { ...b, products: b.products + 1 }
            : b
        )
      );
    }
  };

  const handleCreateBrand = (newBrand: { name: string; productName?: string; description?: string }) => {
    const nextCode = `BR-${100 + brandsList.length}`;
    const addedBrand: Brand = {
      code: nextCode,
      name: newBrand.name,
      products: newBrand.productName ? 1 : 0,
      active: true,
      description: newBrand.description
    };

    setBrandsList(prev => [addedBrand, ...prev]);

    if (newBrand.productName) {
      const nextSkuNum = 4000 + productsList.length + 1;
      const nextPrdNum = 3000 + productsList.length + 1;
      const addedProduct: Product = {
        id: `PRD-${nextPrdNum}`,
        sku: `SKU-${nextSkuNum}`,
        name: newBrand.productName,
        type: "Goods",
        category: "General",
        brand: newBrand.name,
        price: 0,
        cost: 0,
        stock: 0,
        reorder: 10
      };
      setProductsList(prev => [addedProduct, ...prev]);
    }
  };

  const handleImportComplete = (importedItems: any[]) => {
    const startPrdNum = 3000 + productsList.length;
    const startSkuNum = 4000 + productsList.length;
    
    const formatted = importedItems.map((item, idx) => ({
      id: `PRD-${startPrdNum + idx + 1}`,
      sku: `SKU-${startSkuNum + idx + 1}`,
      name: item.name,
      type: item.type || "Goods",
      category: item.category,
      brand: item.brand,
      price: item.price,
      cost: item.cost,
      stock: item.stock,
      reorder: 50,
      image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=500&auto=format&fit=crop&q=60" 
    }));
    
    setProductsList(prev => [...formatted, ...prev]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === "en" ? "Products & Services" : "Bidhaa na Huduma"}
        description={lang === "en" ? "Catalog, brands, and product codes." : "Katalogi, chapa, na misimbo ya bidhaa."}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <ExportMenu />
            <button
              onClick={() => setImportOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition duration-150 cursor-pointer"
            >
              <Upload className="h-4 w-4 text-slate-500" /> 
              <span>{lang === "en" ? "Import" : "Ingiza Bidhaa"}</span>
            </button>
            <button
              onClick={() => setPrintOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition duration-150 cursor-pointer"
            >
              <Barcode className="h-4 w-4 text-slate-500" />
              <span>{lang === "en" ? "Print Labels" : "Chapisha Lebo"}</span>
            </button>
            <button
              onClick={() => setBrandOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition duration-150 cursor-pointer"
            >
              <Plus className="h-4 w-4 text-slate-500" /> {t("addBrand")}
            </button>
            <button
              onClick={() => setProductOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] hover:bg-[#177d6d] px-4 py-2 text-sm font-semibold text-white shadow-md transition duration-150 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> {t("addProduct")}
            </button>
          </div>
        }
      />

      <TabbedPage tabs={[
        {
          key: "products",
          label: lang === "en" ? "Products / Services" : "Bidhaa / Huduma",
          render: () => (
            <DataTable
              data={productsList}
              columns={[
                { key: "sku", header: "SKU" },
                { key: "name", header: lang === "en" ? "Name" : "Jina" },
                { key: "type", header: lang === "en" ? "Type" : "Aina", render: (r) => PRODUCT_TYPE_TRANSLATIONS[r.type || "Goods"]?.[lang] || r.type || "Goods" },
                { key: "category", header: t("category") },
                { key: "brand", header: lang === "en" ? "Brand" : "Chapa", render: (r) => r.brand || "—" },
                { key: "cost", header: t("cost"), align: "right", render: (r) => currency(r.cost) },
                { key: "price", header: t("price"), align: "right", render: (r) => currency(r.price) },
                {
                  key: "stock",
                  header: t("stock"),
                  align: "right",
                  render: (r) => (
                    <span className={r.stock < r.reorder ? "font-semibold text-rose-600" : ""}>
                      {r.stock}
                    </span>
                  )
                },
              ]}
            />
          )
        },
        {
          key: "brands",
          label: t("brands"),
          render: () => (
            <DataTable
              data={brandsList}
              columns={[
                { key: "code", header: t("code") },
                { key: "name", header: lang === "en" ? "Brand" : "Chapa" },
                { key: "description", header: t("description"), render: (r) => r.description || "—" },
                { key: "products", header: lang === "en" ? "Products Count" : "Idadi ya Bidhaa", align: "right" },
                { key: "active", header: t("status"), render: (r) => r.active ? (lang === "en" ? "Active" : "Amilifu") : (lang === "en" ? "Inactive" : "Isiyoamilifu") },
              ]}
            />
          )
        },
      ]} />

      <CreateProductDialog
        open={productOpen}
        onOpenChange={setProductOpen}
        onSubmit={handleCreateProduct}
        brandsList={brandsList}
        onCreateBrandInline={() => {
          setProductOpen(false);
          setBrandOpen(true);
        }}
      />

      <CreateBrandDialog
        open={brandOpen}
        onOpenChange={setBrandOpen}
        onSubmit={handleCreateBrand}
      />

      <ImportProductsDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImportComplete={handleImportComplete}
      />

      <PrintLabelsDialog
        open={printOpen}
        onOpenChange={setPrintOpen}
        products={productsList}
      />
    </div>
  );
}

interface CreateProductDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (data: Omit<Product, "id" | "sku">) => void;
  readonly brandsList: Brand[];
  readonly onCreateBrandInline: () => void;
}

function CreateProductDialog({ open, onOpenChange, onSubmit, brandsList, onCreateBrandInline }: CreateProductDialogProps) {
  const { lang, t } = useTranslate();
  const [name, setName] = useState("");
  const [type, setType] = useState("Goods");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [cost, setCost] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [image, setImage] = useState("");
  
  // Advanced fields from demo POS
  const [description, setDescription] = useState("");
  const [barcode, setBarcode] = useState("");
  const [sellingUnit, setSellingUnit] = useState("piece");
  const [bulkBreaking, setBulkBreaking] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [comparePrice, setComparePrice] = useState<number>(0);
  const [minStock, setMinStock] = useState<number>(10);
  const [weight, setWeight] = useState<number>(0);
  const [weightUnit, setWeightUnit] = useState("kg");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) return;
    onSubmit({
      name,
      type,
      category,
      brand,
      cost,
      price,
      stock,
      image: image || "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=500&auto=format&fit=crop&q=60",
      reorder: minStock
    });
    // Reset values
    setName("");
    setType("Goods");
    setCategory("");
    setBrand("");
    setCost(0);
    setPrice(0);
    setStock(0);
    setImage("");
    setDescription("");
    setBarcode("");
    setSellingUnit("piece");
    setBulkBreaking(false);
    setFeatured(false);
    setComparePrice(0);
    setMinStock(10);
    setWeight(0);
    setWeightUnit("kg");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-white rounded-2xl p-6 shadow-xl border border-slate-100 max-h-[85vh] overflow-y-auto pr-3">
        <DialogHeader className="border-b border-slate-100 pb-3 mb-4">
          <DialogTitle className="text-base font-bold text-slate-900">
            {lang === "en" ? "New Product / Service" : "Bidhaa / Huduma Mpya"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#1f9c88]">
              {lang === "en" ? "1. Basic Information" : "1. Taarifa za Msingi"}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Product Name" : "Jina la Bidhaa"} *</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Premium Coffee 1kg"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t("category")} *</label>
                <input
                  required
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Beverages"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Description" : "Maelezo ya Bidhaa"}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product details, features, or storage guidelines..."
                rows={2}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all resize-none"
              />
            </div>
          </div>

          {/* Section 2: Identification & Unit */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#1f9c88]">
              {lang === "en" ? "2. Identification & Unit" : "2. Utambulisho na Vipimo"}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Barcode / IMEI" : "Msimbo Pau (Barcode / IMEI)"}</label>
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="e.g. 615110002010"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Selling Unit" : "Kipimo cha Uuzaji"}</label>
                <input
                  type="text"
                  value={sellingUnit}
                  onChange={(e) => setSellingUnit(e.target.value)}
                  placeholder="piece, kg, box, packet..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={bulkBreaking}
                  onChange={(e) => setBulkBreaking(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#1f9c88] focus:ring-[#1f9c88]"
                />
                <span>{lang === "en" ? "Enable Bulk Breaking / Fractional Selling" : "Ruhusu Uuzaji wa Rejareja (Kuvunja Kifurushi)"}</span>
              </label>
              
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#1f9c88] focus:ring-[#1f9c88]"
                />
                <span>{lang === "en" ? "Featured Product (Show in Quick POS)" : "Bidhaa Maarufu (Onyesha POS ya Haraka)"}</span>
              </label>
            </div>
          </div>

          {/* Section 3: Pricing & Inventory */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#1f9c88]">
              {lang === "en" ? "3. Pricing & Inventory" : "3. Bei na Hesabu ya Stoki"}
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Cost (TZS)" : "Gharama (TZS)"}</label>
                <input
                  type="number"
                  min={0}
                  value={cost || ""}
                  onChange={(e) => setCost(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Selling Price (TZS)" : "Bei ya Kuuzia (TZS)"} *</label>
                <input
                  required
                  type="number"
                  min={0}
                  value={price || ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Compare Price" : "Bei ya Kulinganisha"}</label>
                <input
                  type="number"
                  min={0}
                  value={comparePrice || ""}
                  onChange={(e) => setComparePrice(Number(e.target.value))}
                  placeholder="Original price log"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Opening Stock Qty" : "Kiasi cha Stoki ya Kuanzia"}</label>
                <input
                  type="number"
                  min={0}
                  value={stock || ""}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Minimum Stock Level" : "Kiwango cha Chini cha Stoki"}</label>
                <input
                  type="number"
                  min={0}
                  value={minStock || ""}
                  onChange={(e) => setMinStock(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Specifications & Logistics */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#1f9c88]">
              {lang === "en" ? "4. Brands & Shipping" : "4. Chapa na Usafirishaji"}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Brand" : "Chapa"}</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                  >
                    <option value="">{lang === "en" ? "Select Brand" : "Chagua Chapa"}</option>
                    {brandsList.map(b => (
                      <option key={b.code} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={onCreateBrandInline}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 transition h-9 w-9 flex items-center justify-center shrink-0 cursor-pointer"
                  title="Create New Brand Inline"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Weight" : "Uzito"}</label>
                  <input
                    type="number"
                    min={0}
                    value={weight || ""}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    placeholder="0.00"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Unit" : "Kipimo"}</label>
                  <select
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="lb">lb</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Product Image" : "Picha ya Bidhaa"}</label>

              {/* Upload + Preview row */}
              <div className="mt-1 flex items-start gap-3">
                {image ? (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img src={image} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-[10px] font-bold text-white hover:bg-black/80"
                      aria-label="Remove image"
                    >×</button>
                  </div>
                ) : (
                  <label className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-[10px] font-semibold text-slate-500 hover:border-[#1f9c88] hover:text-[#1f9c88] transition">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {lang === "en" ? "Upload" : "Pakia"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => setImage(typeof reader.result === "string" ? reader.result : "");
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                )}

                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={image.startsWith("data:") ? "" : image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder={lang === "en" ? "Or paste image URL…" : "Au bandika URL ya picha…"}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                  />
                  <p className="text-[10px] text-slate-400">
                    {lang === "en"
                      ? "Upload from device or paste an image URL."
                      : "Pakia kutoka kifaani au bandika URL ya picha."}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#1f9c88] hover:bg-[#177d6d] px-4 py-2.5 text-xs font-bold text-white shadow-md transition cursor-pointer"
            >
              {t("addProduct")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface CreateBrandDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (data: { name: string; productName?: string; description?: string }) => void;
}

function CreateBrandDialog({ open, onOpenChange, onSubmit }: CreateBrandDialogProps) {
  const { lang, t } = useTranslate();
  const [name, setName] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onSubmit({ name, productName, description });
    setName("");
    setProductName("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
        <DialogHeader className="border-b border-slate-100 pb-3 mb-4">
          <DialogTitle className="text-base font-bold text-slate-900">{t("addBrand")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Brand Name" : "Jina la Chapa"} *</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === "en" ? "Brand Name" : "Jina la Chapa"}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Product Name (Initial Associated Product)" : "Jina la Bidhaa (Bidhaa Husika ya Kwanza)"}</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Premium Coffee 1kg"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("description")}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={lang === "en" ? "Brand description or details" : "Maelezo ya chapa"}
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#1f9c88] hover:bg-[#177d6d] px-4 py-2.5 text-xs font-bold text-white shadow-md transition"
            >
              {t("addBrand")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface ImportProductsDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onImportComplete: (importedProducts: any[]) => void;
}

function ImportProductsDialog({ open, onOpenChange, onImportComplete }: ImportProductsDialogProps) {
  const { lang, t } = useTranslate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setImporting(true);
    setProgress(10);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 30;
      });
    }, 400);

    setTimeout(() => {
      const newItems = [
        { name: "Imported Milk 1L", category: "Beverages", brand: "Apex", price: 3200, cost: 2500, stock: 120, type: "Goods" },
        { name: "Imported Biscuits 200g", category: "Groceries", brand: "Brava", price: 1500, cost: 1000, stock: 450, type: "Goods" },
        { name: "Imported Tea Bags 50s", category: "Beverages", brand: "Brava", price: 4000, cost: 3000, stock: 80, type: "Goods" },
      ];
      onImportComplete(newItems);
      setImporting(false);
      setSelectedFile(null);
      onOpenChange(false);
    }, 1600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
        <DialogHeader className="border-b border-slate-100 pb-3 mb-4">
          <DialogTitle className="text-base font-bold text-slate-900">
            {lang === "en" ? "Import Products (CSV/Excel)" : "Ingiza Bidhaa (CSV/Excel)"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleImport} className="space-y-4 pt-2">
          <div className="space-y-2">
            <p className="text-xs text-slate-500">
              {lang === "en" 
                ? "Download the official template file, fill in your product details, and upload the file below." 
                : "Pakua faili ya kiolezo, jaza maelezo ya bidhaa zako, kisha pakia faili hiyo hapa chini."}
            </p>
            <a 
              href="#"
              onClick={(e) => { e.preventDefault(); alert("Template downloaded!"); }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1f9c88] hover:underline"
            >
              <Download className="h-3.5 w-3.5" />
              {lang === "en" ? "Download CSV Template" : "Pakua Kiolezo cha CSV"}
            </a>
          </div>

          <div className="rounded-lg border-2 border-dashed border-slate-200 p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer relative">
            <input 
              type="file" 
              accept=".csv,.xlsx" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-slate-400" />
              {selectedFile ? (
                <div>
                  <p className="text-sm font-semibold text-slate-800">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-slate-600">
                    {lang === "en" ? "Click to upload or drag & drop" : "Bofya kupakia au buruta na uondoe"}
                  </p>
                  <p className="text-[10px] text-slate-400">CSV or XLSX (Max 10MB)</p>
                </div>
              )}
            </div>
          </div>

          {importing && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>{lang === "en" ? "Importing products..." : "Kuingiza bidhaa..."}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#1f9c88] h-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={!selectedFile || importing}
              className="rounded-xl bg-[#1f9c88] hover:bg-[#177d6d] px-4 py-2.5 text-xs font-bold text-white shadow-md transition disabled:opacity-50"
            >
              {lang === "en" ? "Import File" : "Ingiza Faili"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface PrintLabelsDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly products: any[];
}

function PrintLabelsDialog({ open, onOpenChange, products }: PrintLabelsDialogProps) {
  const { lang, t } = useTranslate();
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "");
  const [labelQty, setLabelQty] = useState(12);
  const [paperLayout, setPaperLayout] = useState("a4"); 
  
  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handlePrint = (e: React.FormEvent) => {
    e.preventDefault();
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
        <DialogHeader className="border-b border-slate-100 pb-3 mb-4">
          <DialogTitle className="text-base font-bold text-slate-900">
            {lang === "en" ? "Print Product Barcode Labels" : "Chapisha Lebo za Bidhaa (Barcodes)"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 md:grid-cols-12 pt-2">
          <form onSubmit={handlePrint} className="space-y-4 md:col-span-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {lang === "en" ? "Select Product" : "Chagua Bidhaa"}
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-[#1f9c88] focus:outline-none"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {lang === "en" ? "Label Quantity" : "Idadi ya Lebo"}
                </label>
                <input 
                  type="number"
                  min={1}
                  max={100}
                  value={labelQty}
                  onChange={(e) => setLabelQty(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-[#1f9c88] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {lang === "en" ? "Paper Size" : "Ukubwa wa Karatasi"}
                </label>
                <select
                  value={paperLayout}
                  onChange={(e) => setPaperLayout(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-[#1f9c88] focus:outline-none"
                >
                  <option value="a4">A4 Sheet (3x8 Grid)</option>
                  <option value="thermal">Thermal Roll (50x30mm)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-[#1f9c88] hover:bg-[#177d6d] text-white px-4 py-2.5 text-xs font-bold shadow-md transition"
              >
                <Printer className="inline h-3.5 w-3.5 mr-1" />
                {lang === "en" ? "Print Labels" : "Chapisha"}
              </button>
            </div>
          </form>

          <div className="md:col-span-7 bg-slate-50 rounded-xl border border-slate-100 p-4 flex flex-col justify-between max-h-[350px] overflow-y-auto">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {lang === "en" ? "Labels Sheets Preview" : "Uhakiki wa Lebo za Barcode"}
            </p>
            {selectedProduct && (
              <div className={cn(
                "grid gap-2 p-2 bg-white rounded-lg border border-slate-200 shadow-inner overflow-y-auto max-h-[280px]",
                paperLayout === "a4" ? "grid-cols-2" : "grid-cols-1 max-w-[200px] mx-auto"
              )}>
                {Array.from({ length: Math.min(labelQty, paperLayout === "a4" ? 6 : 1) }).map((_, idx) => (
                  <div key={idx} className="border border-slate-200 rounded p-2 text-center space-y-1 bg-white select-none">
                    <p className="text-[9px] font-bold text-slate-700 uppercase tracking-tight truncate">Lumen Trading Co.</p>
                    <p className="text-[10px] font-bold text-slate-900 leading-tight truncate">{selectedProduct.name}</p>
                    <div className="flex flex-col items-center py-1 bg-slate-50 rounded">
                      <div className="flex h-7 items-center justify-center gap-0.5 px-2">
                        {Array.from({ length: 18 }).map((_, barIdx) => (
                          <div 
                            key={barIdx} 
                            className="bg-slate-900 h-full" 
                            style={{ width: `${[1, 2, 1, 3, 1, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 1, 2][barIdx % 18]}px` }}
                          />
                        ))}
                      </div>
                      <span className="text-[8px] font-mono text-slate-500 leading-none">{selectedProduct.sku}</span>
                    </div>
                    <p className="text-[10px] font-extrabold text-[#1f9c88]">{currency(selectedProduct.price)}</p>
                  </div>
                ))}
              </div>
            )}
            {labelQty > 6 && paperLayout === "a4" && (
              <p className="text-[10px] text-center text-slate-400 italic mt-2">
                {lang === "en" ? `+ ${labelQty - 6} more labels will be printed...` : `+ Lebo zingine ${labelQty - 6} zitachapishwa...`}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
