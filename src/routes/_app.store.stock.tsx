import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AlertTriangle, Plus } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/erp/DataTable";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { adjustStockFn, getInventoryFn } from "@/lib/api/operations";
import { useTranslate } from "@/lib/i18n";
import { z } from "zod";

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
  validateSearch: z.object({
    adjust: z.coerce.boolean().optional(),
    productId: z.coerce.number().int().positive().optional(),
  }),
  head: () => ({ meta: [{ title: "Pharmacy Stock — DeveleERP" }] }),
  loader: () => getInventoryFn(),
  component: StockPage,
});

const money = (value: number) => `TZS ${new Intl.NumberFormat("en-TZ").format(value)}`;

function StockPage() {
  const search = Route.useSearch();
  const router = useRouter();
  const { t } = useTranslate();
  const initial = Route.useLoaderData();
  const [products, setProducts] = useState<Product[]>(initial.products as Product[]);
  const [batches, setBatches] = useState<Batch[]>(initial.batches as Batch[]);
  const [movements, setMovements] = useState<Movement[]>(initial.movements as Movement[]);
  const [adjustOpen, setAdjustOpen] = useState(search.adjust === true);
  const [productId, setProductId] = useState<number | "">(search.productId ?? "");
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
      setError(cause instanceof Error ? cause.message : t("stockAdjustmentFailed"));
    } finally {
      setSaving(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const warningDate = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pharmacyStock")}
        description={t("pharmacyStockDescription")}
        actions={
          <button
            onClick={() => setAdjustOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4" /> {t("adjustStock")}
          </button>
        }
      />
      <TabbedPage
        tabs={[
          {
            key: "stock",
            label: t("stock"),
            render: () => (
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
                          className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
                        />
                      ) : (
                        <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-xs text-slate-400">
                          —
                        </span>
                      ),
                  },
                  { key: "sku", header: "SKU" },
                  { key: "name", header: t("productName") },
                  { key: "category", header: t("category") },
                  {
                    key: "stock",
                    header: t("onHand"),
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
                  { key: "reorder", header: t("reorder"), align: "right" },
                  {
                    key: "value",
                    header: t("value"),
                    align: "right",
                    render: (row: Product) => money(row.stock * row.cost),
                  },
                ]}
              />
            ),
          },
          {
            key: "batches",
            label: t("batchesAndExpiry"),
            render: () => (
              <DataTable
                data={batches}
                columns={[
                  { key: "sku", header: "SKU" },
                  { key: "productName", header: t("productName") },
                  { key: "batchNumber", header: t("batch") },
                  {
                    key: "expiryDate",
                    header: t("expiry"),
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
                  { key: "quantity", header: t("quantity"), align: "right" },
                  {
                    key: "unitCost",
                    header: t("unitCost"),
                    align: "right",
                    render: (row: Batch) => money(row.unitCost),
                  },
                ]}
              />
            ),
          },
          {
            key: "movements",
            label: t("movementHistory"),
            render: () => (
              <DataTable
                data={movements}
                columns={[
                  {
                    key: "createdAt",
                    header: t("date"),
                    render: (row: Movement) => new Date(row.createdAt).toLocaleString(),
                  },
                  { key: "productId", header: t("productId") },
                  { key: "movementType", header: t("type") },
                  {
                    key: "quantity",
                    header: t("quantity"),
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
                  { key: "referenceType", header: t("reference") },
                  { key: "reason", header: t("reason") },
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
              <h2 className="text-lg font-bold">{t("stockAdjustment")}</h2>
              <p className="text-sm text-muted-foreground">{t("stockAdjustmentHelp")}</p>
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
              {t("productName")}
              <select
                required
                value={productId}
                onChange={(event) => setProductId(Number(event.target.value) || "")}
                className="input-field mt-1"
              >
                <option value="">{t("chooseProduct")}</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} — {product.stock} {t("available")}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold">
              {t("quantityChange")}
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
                  {t("batchNumber")}
                  <input
                    required
                    value={batchNumber}
                    onChange={(event) => setBatchNumber(event.target.value)}
                    className="input-field mt-1"
                  />
                </label>
                <label className="block text-sm font-semibold">
                  {t("expiryDate")}
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
              {t("reason")}
              <textarea
                required
                minLength={3}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="input-field mt-1 min-h-20"
              />
            </label>
            <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" /> {t("adjustmentAuditWarning")}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAdjustOpen(false)}
                className="rounded-xl border px-4 py-2 text-sm font-semibold"
              >
                {t("cancel")}
              </button>
              <button
                disabled={saving}
                className="rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? t("saving") : t("saveAdjustment")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
