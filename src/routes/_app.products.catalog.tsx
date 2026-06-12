import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { products as initialProducts, currency } from "@/lib/mock";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

function CatalogPage() {
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
        title="Products & Services"
        description="Catalog, brands, and product codes."
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button
              onClick={() => setBrandOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              <Plus className="h-4 w-4 text-slate-500" /> Add Brand
            </button>
            <button
              onClick={() => setProductOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition"
            >
              <Plus className="h-4 w-4" /> Add Product
            </button>
          </div>
        }
      />

      <TabbedPage tabs={[
        {
          key: "products",
          label: "Products / Services",
          render: () => (
            <DataTable
              data={productsList}
              columns={[
                { key: "sku", header: "SKU" },
                { key: "name", header: "Name" },
                { key: "type", header: "Type", render: (r) => r.type || "Goods" },
                { key: "category", header: "Category" },
                { key: "brand", header: "Brand", render: (r) => r.brand || "—" },
                { key: "cost", header: "Cost", align: "right", render: (r) => currency(r.cost) },
                { key: "price", header: "Price", align: "right", render: (r) => currency(r.price) },
                {
                  key: "stock",
                  header: "Stock",
                  align: "right",
                  render: (r) => (
                    <span className={r.stock < r.reorder ? "font-medium text-rose-600" : ""}>
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
          label: "Brands & Codes",
          render: () => (
            <DataTable
              data={brandsList}
              columns={[
                { key: "code", header: "Code" },
                { key: "name", header: "Brand" },
                { key: "description", header: "Description", render: (r) => r.description || "—" },
                { key: "products", header: "Products", align: "right" },
                { key: "active", header: "Status", render: (r) => r.active ? "Active" : "Inactive" },
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Product/Service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Product Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product Name"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Product Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              >
                <option>Goods</option>
                <option>Service</option>
                <option>Raw Material</option>
                <option>Fixed Asset</option>
                <option>Intangible Asset</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</label>
              <input
                required
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              >
                <option value="">Select Brand</option>
                {brandsList.map(b => (
                  <option key={b.code} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={onCreateBrandInline}
              className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 transition h-9 w-9 flex items-center justify-center"
              title="Create New Brand Inline"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cost ($)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Stock</label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition"
            >
              Add Product
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Brand</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Brand Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Brand Name"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Product Name (Initial Associated Product)</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Premium Coffee 1kg"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brand description or details"
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition"
            >
              Create Brand
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
