import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/erp/DataTable";
import { PageHeader } from "@/components/erp/PageHeader";
import { createProductFn, getProductsFn } from "@/lib/api/domain";
import { useTranslate } from "@/lib/i18n";

type Product = {
  id: number;
  sku: string;
  name: string;
  genericName?: string | null;
  category: string;
  brand?: string | null;
  dosageForm?: string | null;
  strength?: string | null;
  barcode?: string | null;
  purchaseUnit: string;
  sellingUnit: string;
  unitsPerPurchaseUnit: number;
  requiresPrescription: boolean;
  price: number;
  cost: number;
  stock: number;
  reorder: number;
};

export const Route = createFileRoute("/_app/products/catalog")({
  head: () => ({ meta: [{ title: "Medicine Catalog — DeveleERP" }] }),
  loader: () => getProductsFn(),
  component: CatalogPage,
});

const money = (value: number) => `TZS ${new Intl.NumberFormat("en-TZ").format(value)}`;

function CatalogPage() {
  const { lang } = useTranslate();
  const loaded = Route.useLoaderData();
  const [products, setProducts] = useState<Product[]>(loaded.data as Product[]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    genericName: "",
    category: "Medicine",
    brand: "",
    dosageForm: "",
    strength: "",
    barcode: "",
    purchaseUnit: "box",
    sellingUnit: "piece",
    unitsPerPurchaseUnit: 1,
    requiresPrescription: false,
    price: 0,
    cost: 0,
    reorder: 10,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const response = await createProductFn({
        data: {
          name: form.name,
          genericName: form.genericName || undefined,
          category: form.category,
          brand: form.brand || undefined,
          dosageForm: form.dosageForm || undefined,
          strength: form.strength || undefined,
          barcode: form.barcode || undefined,
          purchaseUnit: form.purchaseUnit,
          sellingUnit: form.sellingUnit,
          unitsPerPurchaseUnit: form.unitsPerPurchaseUnit,
          requiresPrescription: form.requiresPrescription,
          price: form.price,
          cost: form.cost,
          reorder: form.reorder,
          stock: 0,
        },
      });
      setProducts((current) => [response.result as Product, ...current]);
      setOpen(false);
      setForm({
        name: "",
        genericName: "",
        category: "Medicine",
        brand: "",
        dosageForm: "",
        strength: "",
        barcode: "",
        purchaseUnit: "box",
        sellingUnit: "piece",
        unitsPerPurchaseUnit: 1,
        requiresPrescription: false,
        price: 0,
        cost: 0,
        reorder: 10,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Product could not be saved.");
    } finally {
      setSaving(false);
    }
  }
  function field<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === "en" ? "Medicine Catalog" : "Orodha ya Dawa"}
        description={
          lang === "en"
            ? "Products, dosage details, pack conversion, prices and reorder levels."
            : "Dawa, vipimo, bei na kiwango cha kuagiza."
        }
        actions={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4" /> New product
          </button>
        }
      />
      <DataTable
        data={products}
        columns={[
          { key: "sku", header: "SKU" },
          { key: "barcode", header: "Barcode" },
          { key: "name", header: "Product" },
          { key: "genericName", header: "Generic" },
          { key: "strength", header: "Strength" },
          { key: "dosageForm", header: "Form" },
          {
            key: "cost",
            header: "Cost",
            align: "right",
            render: (row: Product) => money(row.cost),
          },
          {
            key: "price",
            header: "Price",
            align: "right",
            render: (row: Product) => money(row.price),
          },
          {
            key: "stock",
            header: "Stock",
            align: "right",
            render: (row: Product) => (
              <span className={row.stock <= row.reorder ? "font-bold text-rose-600" : "font-bold"}>
                {row.stock}
              </span>
            ),
          },
          {
            key: "requiresPrescription",
            header: "Rx",
            render: (row: Product) => (row.requiresPrescription ? "Required" : "No"),
          },
        ]}
      />
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/40 p-4"
          onMouseDown={() => setOpen(false)}
        >
          <form
            onSubmit={create}
            onMouseDown={(event) => event.stopPropagation()}
            className="my-8 w-full max-w-2xl space-y-4 rounded-2xl bg-white p-6"
          >
            <h2 className="text-lg font-bold">New medicine or product</h2>
            {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <Text
                label="Product name"
                value={form.name}
                setValue={(value) => field("name", value)}
                required
              />
              <Text
                label="Generic name"
                value={form.genericName}
                setValue={(value) => field("genericName", value)}
              />
              <Text
                label="Category"
                value={form.category}
                setValue={(value) => field("category", value)}
                required
              />
              <Text
                label="Brand / manufacturer"
                value={form.brand}
                setValue={(value) => field("brand", value)}
              />
              <Text
                label="Dosage form"
                value={form.dosageForm}
                setValue={(value) => field("dosageForm", value)}
              />
              <Text
                label="Strength"
                value={form.strength}
                setValue={(value) => field("strength", value)}
              />
              <Text
                label="Barcode"
                value={form.barcode}
                setValue={(value) => field("barcode", value)}
              />
              <Text
                label="Purchase unit"
                value={form.purchaseUnit}
                setValue={(value) => field("purchaseUnit", value)}
                required
              />
              <Text
                label="Selling unit"
                value={form.sellingUnit}
                setValue={(value) => field("sellingUnit", value)}
                required
              />
              <NumberField
                label="Units per purchase unit"
                value={form.unitsPerPurchaseUnit}
                setValue={(value) => field("unitsPerPurchaseUnit", value)}
                min={1}
              />
              <NumberField
                label="Cost per selling unit (TZS)"
                value={form.cost}
                setValue={(value) => field("cost", value)}
              />
              <NumberField
                label="Selling price (TZS)"
                value={form.price}
                setValue={(value) => field("price", value)}
              />
              <NumberField
                label="Reorder level"
                value={form.reorder}
                setValue={(value) => field("reorder", value)}
              />
            </div>
            <label className="flex items-center gap-3 rounded-xl border p-3 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.requiresPrescription}
                onChange={(event) => field("requiresPrescription", event.target.checked)}
              />{" "}
              Requires a prescription
            </label>
            <p className="rounded-xl bg-blue-50 p-3 text-xs text-blue-900">
              Opening stock is intentionally not entered here. Receive it through a supplier
              purchase or an audited positive stock adjustment with batch and expiry information.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={saving}
                className="rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-semibold text-white"
              >
                {saving ? "Saving..." : "Save product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Text({
  label,
  value,
  setValue,
  required,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        required={required}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="input-field mt-1"
      />
    </label>
  );
}
function NumberField({
  label,
  value,
  setValue,
  min = 0,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
  min?: number;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        required
        min={min}
        type="number"
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="input-field mt-1"
      />
    </label>
  );
}
