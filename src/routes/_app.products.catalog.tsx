import { createFileRoute } from "@tanstack/react-router";
import { ImagePlus, Package, Plus, X } from "lucide-react";
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
  image?: string | null;
};

const emptyForm = () => ({
  name: "",
  genericName: "",
  category: "",
  brand: "",
  dosageForm: "",
  strength: "",
  barcode: "",
  purchaseUnit: "",
  sellingUnit: "",
  unitsPerPurchaseUnit: "",
  requiresPrescription: false,
  price: "",
  cost: "",
  reorder: "",
});

export const Route = createFileRoute("/_app/products/catalog")({
  head: () => ({ meta: [{ title: "Medicine Catalog — DeveleERP" }] }),
  loader: () => getProductsFn(),
  component: CatalogPage,
});

const money = (value: number) => `TZS ${new Intl.NumberFormat("en-TZ").format(value)}`;

function CatalogPage() {
  const { lang, t } = useTranslate();
  const loaded = Route.useLoaderData();
  const [products, setProducts] = useState<Product[]>(loaded.data as Product[]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imageUpload, setImageUpload] = useState<{
    dataUrl: string;
    fileName: string;
    contentType: "image/jpeg" | "image/png" | "image/webp";
  } | null>(null);
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
          unitsPerPurchaseUnit: Number(form.unitsPerPurchaseUnit),
          requiresPrescription: form.requiresPrescription,
          price: Number(form.price),
          cost: Number(form.cost),
          reorder: Number(form.reorder),
          stock: 0,
          imageUpload: imageUpload || undefined,
        },
      });
      setProducts((current) => [response.result as Product, ...current]);
      setOpen(false);
      setForm(emptyForm());
      setImageUpload(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Product could not be saved.");
    } finally {
      setSaving(false);
    }
  }
  function field<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function chooseImage(file?: File) {
    if (!file) return;
    try {
      setError(null);
      setImageUpload(await resizeProductImage(file));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("imageCouldNotBeRead"));
    }
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
            <Plus className="h-4 w-4" /> {t("newProduct")}
          </button>
        }
      />
      <DataTable
        data={products}
        columns={[
          {
            key: "image",
            header: t("image"),
            render: (row: Product) =>
              row.image ? (
                <img
                  src={row.image}
                  alt=""
                  loading="lazy"
                  className="h-11 w-11 rounded-lg border border-slate-200 object-cover"
                />
              ) : (
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-slate-100 text-slate-400">
                  <Package className="h-5 w-5" />
                </span>
              ),
          },
          { key: "sku", header: "SKU" },
          { key: "barcode", header: t("barcode") },
          { key: "name", header: t("productName") },
          { key: "genericName", header: t("genericName") },
          { key: "strength", header: t("strength") },
          { key: "dosageForm", header: t("dosageForm") },
          {
            key: "pack",
            header: t("packaging"),
            render: (row: Product) =>
              `${row.unitsPerPurchaseUnit} ${row.sellingUnit} / ${row.purchaseUnit}`,
          },
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
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">{t("newMedicineOrProduct")}</h2>
                <p className="text-sm text-muted-foreground">{t("productFormHelp")}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
                aria-label={t("close")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 block text-sm font-semibold">
                {t("productImage")}
                <span className="mt-1 flex min-h-28 items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
                  {imageUpload ? (
                    <img
                      src={imageUpload.dataUrl}
                      alt={t("productImagePreview")}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="grid h-20 w-20 place-items-center rounded-lg bg-white text-slate-400">
                      <ImagePlus className="h-7 w-7" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-slate-800">
                      {imageUpload ? imageUpload.fileName : t("chooseProductImage")}
                    </span>
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">
                      {t("imageHelp")}
                    </span>
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="max-w-52 text-xs"
                    onChange={(event) => void chooseImage(event.target.files?.[0])}
                  />
                </span>
              </label>
              <Text
                label={t("productName")}
                value={form.name}
                setValue={(value) => field("name", value)}
                required
              />
              <Text
                label={t("genericName")}
                value={form.genericName}
                setValue={(value) => field("genericName", value)}
              />
              <Text
                label={t("category")}
                value={form.category}
                setValue={(value) => field("category", value)}
                required
              />
              <Text
                label={t("brandManufacturer")}
                value={form.brand}
                setValue={(value) => field("brand", value)}
              />
              <Text
                label={t("dosageForm")}
                value={form.dosageForm}
                setValue={(value) => field("dosageForm", value)}
              />
              <Text
                label={t("strength")}
                value={form.strength}
                setValue={(value) => field("strength", value)}
              />
              <Text
                label={t("barcode")}
                value={form.barcode}
                setValue={(value) => field("barcode", value)}
              />
              <Text
                label={t("purchaseUnit")}
                value={form.purchaseUnit}
                setValue={(value) => field("purchaseUnit", value)}
                required
              />
              <Text
                label={t("sellingUnit")}
                value={form.sellingUnit}
                setValue={(value) => field("sellingUnit", value)}
                required
              />
              <NumberField
                label={t("unitsPerPurchaseUnit")}
                value={form.unitsPerPurchaseUnit}
                setValue={(value) => field("unitsPerPurchaseUnit", value)}
                min={1}
              />
              <NumberField
                label={t("costPerSellingUnit")}
                value={form.cost}
                setValue={(value) => field("cost", value)}
              />
              <NumberField
                label={t("sellingPrice")}
                value={form.price}
                setValue={(value) => field("price", value)}
              />
              <NumberField
                label={t("reorderLevel")}
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
              {t("requiresPrescription")}
            </label>
            <p className="rounded-xl bg-blue-50 p-3 text-xs text-blue-900">
              {t("openingStockHelp")}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border px-4 py-2 text-sm font-semibold"
              >
                {t("cancel")}
              </button>
              <button
                disabled={saving}
                className="rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-semibold text-white"
              >
                {saving ? t("saving") : t("saveProduct")}
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
  value: string;
  setValue: (value: string) => void;
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
        onChange={(event) => setValue(event.target.value)}
        className="input-field mt-1"
      />
    </label>
  );
}

async function resizeProductImage(file: File) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Use a JPG, PNG, or WebP image.");
  }
  if (file.size > 8_000_000) throw new Error("Choose an image smaller than 8 MB.");
  const source = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / Math.max(source.width, source.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(source.width * scale));
  canvas.height = Math.max(1, Math.round(source.height * scale));
  canvas.getContext("2d")?.drawImage(source, 0, 0, canvas.width, canvas.height);
  source.close();
  const contentType = "image/webp" as const;
  const dataUrl = canvas.toDataURL(contentType, 0.82);
  if (dataUrl.length > 2_700_000) throw new Error("The compressed image is still too large.");
  return { dataUrl, fileName: file.name, contentType };
}
