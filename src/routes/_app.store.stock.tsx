import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AlertTriangle, Plus } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/erp/DataTable";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { adjustStockFn, getInventoryFn } from "@/lib/api/operations";
import { useTranslate } from "@/lib/i18n";

type Product = {
  id: number;
  sku: string;
  name: string;
  category: string;
  stock: number;
  reorder: number;
  cost: number;
  price: number;
  image?: string | null;
};
type Batch = {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unitCost: number;
};
type Movement = {
  id: number;
  productId: number;
  movementType: string;
  quantity: number;
  referenceType: string;
  reason?: string | null;
  createdAt: Date | string;
};

export const Route = createFileRoute("/_app/store/stock")({
  head: () => ({ meta: [{ title: "Pharmacy Stock — DeveleERP" }] }),
  loader: () => getInventoryFn(),
  component: StockPage,
});

const money = (value: number) => `TZS ${new Intl.NumberFormat("en-TZ").format(value)}`;

function StockPage() {
  const router = useRouter();
  const { lang } = useTranslate();
  const initial = Route.useLoaderData();
  const [products, setProducts] = useState<Product[]>(initial.products as Product[]);
  const [batches, setBatches] = useState<Batch[]>(initial.batches as Batch[]);
  const [movements, setMovements] = useState<Movement[]>(initial.movements as Movement[]);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [productId, setProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const next = await getInventoryFn();
    setProducts(next.products as Product[]);
    setBatches(next.batches as Batch[]);
    setMovements(next.movements as Movement[]);
    await router.invalidate();
  }

  async function submitAdjustment(event: React.FormEvent) {
    event.preventDefault();
    if (!productId || !quantity) return;
    setSaving(true);
    setError(null);
    try {
      await adjustStockFn({
        data: {
          productId,
          quantity,
          reason,
          batchNumber: quantity > 0 ? batchNumber : undefined,
          expiryDate: quantity > 0 ? expiryDate : undefined,
        },
      });
      await refresh();
      setAdjustOpen(false);
      setQuantity(0);
      setReason("");
      setBatchNumber("");
      setExpiryDate("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Stock adjustment failed.");
    } finally {
      setSaving(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const warningDate = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === "en" ? "Pharmacy Stock" : "Bidhaa za Duka la Dawa"}
        description={
          lang === "en"
            ? "Live stock, batches, expiry dates and an immutable movement history."
            : "Bidhaa, makundi, mwisho wa matumizi na historia ya mabadiliko."
        }
        actions={
          <button
            onClick={() => setAdjustOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4" /> Adjust stock
          </button>
        }
      />
      <TabbedPage
        tabs={[
          {
            key: "stock",
            label: "Stock",
            render: () => (
              <DataTable
                data={products}
                columns={[
                  {
                    key: "image",
                    header: "Image",
                    render: (row: Product) =>
                      row.image ? (
                        <img
                          src={row.image}
                          alt=""
                          loading="lazy"
                          className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
                        />
                      ) : (
                        <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-xs text-slate-400">
                          —
                        </span>
                      ),
                  },
                  { key: "sku", header: "SKU" },
                  { key: "name", header: "Product" },
                  { key: "category", header: "Category" },
                  {
                    key: "stock",
                    header: "On hand",
                    align: "right",
                    render: (row: Product) => (
                      <span
                        className={
                          row.stock <= row.reorder ? "font-bold text-rose-600" : "font-bold"
                        }
                      >
                        {row.stock}
                      </span>
                    ),
                  },
                  { key: "reorder", header: "Reorder", align: "right" },
                  {
                    key: "value",
                    header: "Value",
                    align: "right",
                    render: (row: Product) => money(row.stock * row.cost),
                  },
                ]}
              />
            ),
          },
          {
            key: "batches",
            label: "Batches & Expiry",
            render: () => (
              <DataTable
                data={batches}
                columns={[
                  { key: "sku", header: "SKU" },
                  { key: "productName", header: "Product" },
                  { key: "batchNumber", header: "Batch" },
                  {
                    key: "expiryDate",
                    header: "Expiry",
                    render: (row: Batch) => (
                      <span
                        className={
                          row.expiryDate < today
                            ? "font-bold text-rose-700"
                            : row.expiryDate <= warningDate
                              ? "font-bold text-amber-700"
                              : ""
                        }
                      >
                        {row.expiryDate}
                      </span>
                    ),
                  },
                  { key: "quantity", header: "Quantity", align: "right" },
                  {
                    key: "unitCost",
                    header: "Unit cost",
                    align: "right",
                    render: (row: Batch) => money(row.unitCost),
                  },
                ]}
              />
            ),
          },
          {
            key: "movements",
            label: "Movement history",
            render: () => (
              <DataTable
                data={movements}
                columns={[
                  {
                    key: "createdAt",
                    header: "Date",
                    render: (row: Movement) => new Date(row.createdAt).toLocaleString(),
                  },
                  { key: "productId", header: "Product ID" },
                  { key: "movementType", header: "Type" },
                  {
                    key: "quantity",
                    header: "Quantity",
                    align: "right",
                    render: (row: Movement) => (
                      <span
                        className={
                          row.quantity < 0
                            ? "font-bold text-rose-600"
                            : "font-bold text-emerald-700"
                        }
                      >
                        {row.quantity > 0 ? "+" : ""}
                        {row.quantity}
                      </span>
                    ),
                  },
                  { key: "referenceType", header: "Reference" },
                  { key: "reason", header: "Reason" },
                ]}
              />
            ),
          },
        ]}
      />

      {adjustOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"
          onMouseDown={() => setAdjustOpen(false)}
        >
          <form
            onSubmit={submitAdjustment}
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div>
              <h2 className="text-lg font-bold">Stock adjustment</h2>
              <p className="text-sm text-muted-foreground">
                Use a negative quantity to remove stock. Every change is audited.
              </p>
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700"
              >
                {error}
              </p>
            )}
            <label className="block text-sm font-semibold">
              Product
              <select
                required
                value={productId}
                onChange={(event) => setProductId(Number(event.target.value) || "")}
                className="input-field mt-1"
              >
                <option value="">Choose product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} — {product.stock} available
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Quantity change
              <input
                required
                type="number"
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
                className="input-field mt-1"
              />
            </label>
            {quantity > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-semibold">
                  Batch number
                  <input
                    required
                    value={batchNumber}
                    onChange={(event) => setBatchNumber(event.target.value)}
                    className="input-field mt-1"
                  />
                </label>
                <label className="block text-sm font-semibold">
                  Expiry date
                  <input
                    required
                    type="date"
                    value={expiryDate}
                    onChange={(event) => setExpiryDate(event.target.value)}
                    className="input-field mt-1"
                  />
                </label>
              </div>
            )}
            <label className="block text-sm font-semibold">
              Reason
              <textarea
                required
                minLength={3}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="input-field mt-1 min-h-20"
              />
            </label>
            <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" /> Adjustments cannot be silently deleted;
              reverse an error with a second explained adjustment.
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAdjustOpen(false)}
                className="rounded-xl border px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={saving}
                className="rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save adjustment"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
