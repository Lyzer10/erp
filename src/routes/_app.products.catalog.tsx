import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { products as initialProducts, currency } from "@/lib/mock";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslate } from "@/lib/i18n";

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

  const handleCreateProduct = (newProduct: Omit<Product, "id" | "sku">) => {
    const nextSkuNum = 4000 + productsList.length + 1;
    const nextPrdNum = 3000 + productsList.length + 1;
    const addedProduct: Product = {
      id: `PRD-${nextPrdNum}`,
      sku: `SKU-${nextSkuNum}`,
      ...newProduct,
    };

    setProductsList(prev => [addedProduct, ...prev]);

    // Reactively increment product count for the selected brand
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

    // If an associated product name was provided, let's create a corresponding mock product for it
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

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === "en" ? "Products & Services" : "Bidhaa na Huduma"}
        description={lang === "en" ? "Catalog, brands, and product codes." : "Katalogi, chapa, na misimbo ya bidhaa."}
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button
              onClick={() => setBrandOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition animate-fade-in"
            >
              <Plus className="h-4 w-4 text-slate-500" /> {t("addBrand")}
            </button>
            <button
              onClick={() => setProductOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition animate-fade-in"
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
                { key: "cost", header: t("cost"), align: "right", render: (r) => `TZS ${currency(r.cost).replace("$", "")}` },
                { key: "price", header: t("price"), align: "right", render: (r) => `TZS ${currency(r.price).replace("$", "")}` },
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
    </div>
  );
}

// --- Product Creation Dialog ---

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
      reorder: 50
    });
    setName("");
    setType("Goods");
    setCategory("");
    setBrand("");
    setCost(0);
    setPrice(0);
    setStock(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
        <DialogHeader className="border-b border-slate-100 pb-3 mb-4">
          <DialogTitle className="text-base font-bold text-slate-900">{lang === "en" ? "New Product/Service" : "Bidhaa / Huduma Mpya"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Product Name" : "Jina la Bidhaa"} *</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === "en" ? "Product Name" : "Jina la Bidhaa"}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Product Type" : "Aina ya Bidhaa"}</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              >
                {Object.keys(PRODUCT_TYPE_TRANSLATIONS).map((k) => (
                  <option key={k} value={k}>{PRODUCT_TYPE_TRANSLATIONS[k]?.[lang] || k}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("category")} *</label>
              <input
                required
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={t("category")}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Brand" : "Chapa"}</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
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
              className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 transition h-10 w-10 flex items-center justify-center shrink-0"
              title="Create New Brand Inline"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Cost (TZS)" : "Gharama (TZS)"}</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={cost || ""}
                onChange={(e) => setCost(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Price (TZS)" : "Bei (TZS)"}</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={price || ""}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("stock")}</label>
              <input
                type="number"
                min={0}
                value={stock || ""}
                onChange={(e) => setStock(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
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
              className="rounded-xl bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-600 transition"
            >
              {t("addProduct")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Brand Creation Dialog ---

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
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Product Name (Initial Associated Product)" : "Jina la Bidhaa (Bidhaa Husika ya Kwanza)"}</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Premium Coffee 1kg"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("description")}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={lang === "en" ? "Brand description or details" : "Maelezo ya chapa"}
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
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
              className="rounded-xl bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-600 transition"
            >
              {t("addBrand")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
