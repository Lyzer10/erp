import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ImagePlus, Package, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/erp/DataTable";
import { PageHeader } from "@/components/erp/PageHeader";
import { createProductFn, deleteProductsFn, getProductsFn } from "@/lib/api/domain";
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
  openingQuantity: "",
  openingBatchNumber: "",
  openingExpiryDate: "",
  openingReason: "",
});

export const Route = createFileRoute("/_app/products/catalog")({
  head: () => ({ meta: [{ title: "Medicine Catalog — DeveleERP" }] }),
  loader: () => getProductsFn(),
  component: CatalogPage,
});

const money = (value: number) => `TZS ${new Intl.NumberFormat("en-TZ").format(value)}`;

const purchaseUnits = [
  ["box", "Box", "Boksi"],
  ["carton", "Carton", "Katoni"],
  ["pack", "Pack", "Pakiti"],
  ["bottle", "Bottle", "Chupa"],
  ["strip", "Strip", "Stripu"],
  ["tube", "Tube", "Tyubu"],
  ["sachet", "Sachet", "Kifuko"],
  ["vial", "Vial", "Kichupa cha dawa"],
  ["ampoule", "Ampoule", "Ampuli"],
  ["piece", "Single piece", "Moja moja"],
] as const;

const sellingUnits = [
  ["tablet", "Tablet", "Kidonge"],
  ["capsule", "Capsule", "Kapsuli"],
  ["bottle", "Bottle", "Chupa"],
  ["strip", "Strip", "Stripu"],
  ["pack", "Pack", "Pakiti"],
  ["sachet", "Sachet", "Kifuko"],
  ["tube", "Tube", "Tyubu"],
  ["vial", "Vial", "Kichupa cha dawa"],
  ["ampoule", "Ampoule", "Ampuli"],
  ["piece", "Piece", "Moja"],
  ["ml", "Millilitre (ml)", "Mililita (ml)"],
  ["gram", "Gram (g)", "Gramu (g)"],
] as const;

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
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

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
          openingStock: form.openingQuantity
            ? {
                quantity: Number(form.openingQuantity),
                batchNumber: form.openingBatchNumber,
                expiryDate: form.openingExpiryDate,
                reason: form.openingReason,
              }
            : undefined,
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

  function toggleProduct(productId: number) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }

  function toggleAll() {
    setSelected((current) =>
      current.size === products.length ? new Set() : new Set(products.map((product) => product.id)),
    );
  }

  function requestSingleDelete(productId: number) {
    setSelected(new Set([productId]));
    setDeleteNotice(null);
    setDeleteOpen(true);
  }

  async function removeSelected() {
    setDeleting(true);
    setDeleteNotice(null);
    try {
      const result = await deleteProductsFn({ data: { productIds: [...selected] } });
      const deletedIds = new Set(result.deleted.map((product) => product.id));
      setProducts((current) => current.filter((product) => !deletedIds.has(product.id)));
      setSelected(new Set(result.blocked.map((product) => product.id)));
      if (result.blocked.length) {
        setDeleteNotice(
          lang === "en"
            ? `${result.deleted.length} deleted. ${result.blocked.length} kept because they have stock or transaction history.`
            : `${result.deleted.length} zimefutwa. ${result.blocked.length} zimehifadhiwa kwa sababu zina stoo au historia ya miamala.`,
        );
      } else {
        setDeleteOpen(false);
        setDeleteNotice(
          lang === "en"
            ? `${result.deleted.length} product${result.deleted.length === 1 ? "" : "s"} deleted.`
            : `Bidhaa ${result.deleted.length} zimefutwa.`,
        );
      }
    } catch (cause) {
      setDeleteNotice(cause instanceof Error ? cause.message : t("productsCouldNotBeDeleted"));
    } finally {
      setDeleting(false);
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
      {deleteNotice && !deleteOpen && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900"
        >
          <span>{deleteNotice}</span>
          <button
            type="button"
            onClick={() => setDeleteNotice(null)}
            className="rounded-lg p-1 hover:bg-emerald-100"
            aria-label={t("close")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {loaded.canDelete && selected.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-sm font-semibold text-slate-700">
            {selected.size} {t("itemsSelected")}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              {t("clearSelection")}
            </button>
            <button
              type="button"
              onClick={() => {
                setDeleteNotice(null);
                setDeleteOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-3 py-2 text-sm font-bold text-white hover:bg-rose-700"
            >
              <Trash2 className="h-4 w-4" />
              {t("deleteSelected")}
            </button>
          </div>
        </div>
      )}
      <DataTable
        data={products}
        columns={[
          ...(loaded.canDelete
            ? [
                {
                  key: "select",
                  header: (
                    <input
                      type="checkbox"
                      checked={products.length > 0 && selected.size === products.length}
                      onChange={toggleAll}
                      aria-label={t("selectAllProducts")}
                      className="h-4 w-4 accent-[#1f9c88]"
                    />
                  ),
                  render: (row: Product) => (
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      onChange={() => toggleProduct(row.id)}
                      aria-label={`${t("selectProduct")} ${row.name}`}
                      className="h-4 w-4 accent-[#1f9c88]"
                    />
                  ),
                },
              ]
            : []),
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
          ...(loaded.canDelete
            ? [
                {
                  key: "actions",
                  header: t("actions"),
                  align: "right" as const,
                  render: (row: Product) => (
                    <button
                      type="button"
                      onClick={() => requestSingleDelete(row.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                      aria-label={`${t("deleteProduct")} ${row.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {t("delete")}
                    </button>
                  ),
                },
              ]
            : []),
        ]}
      />
      {deleteOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"
          onMouseDown={() => !deleting && setDeleteOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-products-title"
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-white p-6"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <h2 id="delete-products-title" className="text-lg font-bold text-slate-900">
                  {t("deleteProductsTitle")}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{t("deleteProductsHelp")}</p>
              </div>
            </div>
            <div className="mt-4 max-h-44 overflow-y-auto rounded-xl bg-slate-50 p-3 text-sm">
              {products
                .filter((product) => selected.has(product.id))
                .map((product) => (
                  <div key={product.id} className="flex justify-between gap-3 py-1.5">
                    <span className="font-semibold">{product.name}</span>
                    <span className="text-slate-500">{product.sku}</span>
                  </div>
                ))}
            </div>
            {deleteNotice && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-900"
              >
                {deleteNotice}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                disabled={deleting || selected.size === 0}
                onClick={() => void removeSelected()}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? t("deleting") : t("confirmDelete")}
              </button>
            </div>
          </section>
        </div>
      )}
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
              <SelectField
                label={t("purchaseUnit")}
                value={form.purchaseUnit}
                setValue={(value) => field("purchaseUnit", value)}
                options={purchaseUnits.map(([value, en, sw]) => ({
                  value,
                  label: lang === "en" ? en : sw,
                }))}
                placeholder={t("choosePurchaseUnit")}
                help={t("purchaseUnitHelp")}
                required
              />
              <SelectField
                label={t("sellingUnit")}
                value={form.sellingUnit}
                setValue={(value) => field("sellingUnit", value)}
                options={sellingUnits.map(([value, en, sw]) => ({
                  value,
                  label: lang === "en" ? en : sw,
                }))}
                placeholder={t("chooseSellingUnit")}
                help={t("sellingUnitHelp")}
                required
              />
              <NumberField
                label={t("unitsPerPurchaseUnit")}
                value={form.unitsPerPurchaseUnit}
                setValue={(value) => field("unitsPerPurchaseUnit", value)}
                help={t("unitsPerPurchaseUnitHelp")}
                min={1}
              />
              <NumberField
                label={t("costPerSellingUnit")}
                value={form.cost}
                setValue={(value) => field("cost", value)}
                help={t("costPerSellingUnitHelp")}
              />
              <NumberField
                label={t("sellingPrice")}
                value={form.price}
                setValue={(value) => field("price", value)}
                help={t("sellingPriceHelp")}
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
            <fieldset className="space-y-3 rounded-xl border border-slate-200 p-4">
              <legend className="px-1 text-sm font-bold text-slate-900">{t("openingStock")}</legend>
              <p className="text-xs text-slate-600">{t("openingStockHelp")}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  label={t("openingQuantity")}
                  value={form.openingQuantity}
                  setValue={(value) => field("openingQuantity", value)}
                  help={t("openingQuantityHelp")}
                  min={1}
                />
                <Text
                  label={t("batchNumber")}
                  value={form.openingBatchNumber}
                  setValue={(value) => field("openingBatchNumber", value)}
                  required={Boolean(form.openingQuantity)}
                  help={t("batchNumberHelp")}
                />
                <label className="block text-sm font-semibold">
                  {t("expiryDate")}
                  <input
                    required={Boolean(form.openingQuantity)}
                    type="date"
                    value={form.openingExpiryDate}
                    onChange={(event) => field("openingExpiryDate", event.target.value)}
                    className="input-field mt-1"
                  />
                  <span className="mt-1 block text-xs font-normal text-slate-500">
                    {t("expiryDateHelp")}
                  </span>
                </label>
                <Text
                  label={t("openingStockReason")}
                  value={form.openingReason}
                  setValue={(value) => field("openingReason", value)}
                  required={Boolean(form.openingQuantity)}
                  help={t("openingStockReasonHelp")}
                />
              </div>
            </fieldset>
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
                type="submit"
                value="save"
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
  help,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  required?: boolean;
  help?: string;
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
      {help && <span className="mt-1 block text-xs font-normal text-slate-500">{help}</span>}
    </label>
  );
}
function NumberField({
  label,
  value,
  setValue,
  min = 0,
  help,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  min?: number;
  help?: string;
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
      {help && <span className="mt-1 block text-xs font-normal text-slate-500">{help}</span>}
    </label>
  );
}

function SelectField({
  label,
  value,
  setValue,
  options,
  placeholder,
  required,
  help,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  required?: boolean;
  help?: string;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <select
        required={required}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="input-field mt-1"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {help && <span className="mt-1 block text-xs font-normal text-slate-500">{help}</span>}
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
