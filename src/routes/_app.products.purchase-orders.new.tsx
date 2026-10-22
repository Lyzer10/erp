import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { FormShell } from "@/components/erp/FormShell";
import { getProductsFn, getSuppliersFn } from "@/lib/api/domain";
import { createPurchaseOrderFn } from "@/lib/api/purchases";
import { useTranslate } from "@/lib/i18n";

type ProductOption = { id: number; name: string; sku: string; cost: number };
type SupplierOption = { id: number; name: string };
type PurchaseLine = {
  key: string;
  productId: number | "";
  quantity: number;
  unitCost: number;
  batchNumber: string;
  expiryDate: string;
};

function emptyLine(): PurchaseLine {
  return {
    key: crypto.randomUUID(),
    productId: "",
    quantity: 1,
    unitCost: 0,
    batchNumber: "",
    expiryDate: "",
  };
}

export const Route = createFileRoute("/_app/products/purchase-orders/new")({
  head: () => ({ meta: [{ title: "New purchase — DeveleERP" }] }),
  loader: async () => {
    const [productsResult, suppliersResult] = await Promise.all([
      getProductsFn(),
      getSuppliersFn(),
    ]);
    return {
      products: productsResult.data as ProductOption[],
      suppliers: suppliersResult.data as SupplierOption[],
      isTestUser: productsResult.isTestUser,
    };
  },
  component: CreatePurchasePage,
});

const money = (value: number) =>
  new Intl.NumberFormat("en-TZ", { maximumFractionDigits: 0 }).format(value);

function CreatePurchasePage() {
  const navigate = useNavigate();
  const { lang, t } = useTranslate();
  const { products, suppliers, isTestUser } = Route.useLoaderData();
  const [supplierId, setSupplierId] = useState<number | "">("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [receiveNow, setReceiveNow] = useState(true);
  const [lines, setLines] = useState<PurchaseLine[]>([emptyLine()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity * line.unitCost, 0),
    [lines],
  );

  function updateLine(key: string, patch: Partial<PurchaseLine>) {
    setLines((current) => current.map((line) => (line.key === key ? { ...line, ...patch } : line)));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (isTestUser) {
      setError(
        lang === "en"
          ? "Demo mode cannot create a production purchase."
          : "Hali ya majaribio haiwezi kuhifadhi manunuzi halisi.",
      );
      return;
    }
    if (
      !supplierId ||
      lines.some((line) => !line.productId || !line.batchNumber || !line.expiryDate)
    ) {
      setError(
        lang === "en"
          ? "Choose a supplier and complete the product, batch and expiry fields for every line."
          : "Chagua msambazaji na ujaze bidhaa, kundi na tarehe ya mwisho kwa kila mstari.",
      );
      return;
    }
    setSaving(true);
    try {
      await createPurchaseOrderFn({
        data: {
          supplierId,
          date,
          notes: notes || undefined,
          receiveNow,
          items: lines.map((line) => ({
            productId: Number(line.productId),
            quantity: line.quantity,
            unitCost: line.unitCost,
            batchNumber: line.batchNumber,
            expiryDate: line.expiryDate,
          })),
        },
      });
      await navigate({ to: "/products/purchase-orders" });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : lang === "en"
            ? "The purchase could not be saved."
            : "Manunuzi hayakuweza kuhifadhiwa.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormShell
      header={
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => history.back()}
            className="rounded-lg border p-2"
            aria-label={lang === "en" ? "Back" : "Rudi"}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold">
              {lang === "en" ? "New Pharmacy Purchase" : "Manunuzi Mapya ya Duka la Dawa"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {lang === "en"
                ? "Record supplier stock by batch and expiry date."
                : "Sajili bidhaa kwa kundi na tarehe ya mwisho."}
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        {error && (
          <p
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700"
          >
            {error}
          </p>
        )}

        <p className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          {lang === "en"
            ? "This creates an internal purchase order in DeveleERP. It does not automatically send anything to the supplier."
            : "Hii inatengeneza agizo la manunuzi ndani ya DeveleERP. Haitumi taarifa moja kwa moja kwa msambazaji."}
        </p>

        <section className="glass-card grid gap-4 p-5 sm:grid-cols-3">
          <Field label={lang === "en" ? "Supplier" : "Muuzaji"}>
            <select
              required
              value={supplierId}
              onChange={(event) => setSupplierId(Number(event.target.value) || "")}
              className="input-field"
            >
              <option value="">{lang === "en" ? "Choose supplier" : "Chagua muuzaji"}</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label={lang === "en" ? "Purchase date" : "Tarehe ya manunuzi"}>
            <input
              required
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="input-field"
            />
          </Field>
          <label className="flex items-center gap-3 self-end rounded-xl border border-slate-200 p-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={receiveNow}
              onChange={(event) => setReceiveNow(event.target.checked)}
            />
            {lang === "en" ? "Receive stock now" : "Pokea bidhaa sasa"}
          </label>
        </section>

        <section className="glass-card overflow-x-auto p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">{lang === "en" ? "Purchase items" : "Bidhaa za manunuzi"}</h2>
            <button
              type="button"
              onClick={() => setLines((current) => [...current, emptyLine()])}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" /> {lang === "en" ? "Add line" : "Ongeza mstari"}
            </button>
          </div>
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                <th className="p-2">{lang === "en" ? "Product" : "Bidhaa"}</th>
                <th className="p-2">{lang === "en" ? "Qty" : "Idadi"}</th>
                <th className="p-2">{lang === "en" ? "Unit cost" : "Gharama kwa kipimo"}</th>
                <th className="p-2">{lang === "en" ? "Batch" : "Kundi"}</th>
                <th className="p-2">{lang === "en" ? "Expiry" : "Mwisho wa matumizi"}</th>
                <th className="p-2 text-right">{lang === "en" ? "Total" : "Jumla"}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.key} className="border-b border-slate-100">
                  <td className="p-2">
                    <select
                      required
                      value={line.productId}
                      onChange={(event) => {
                        const productId = Number(event.target.value);
                        const selected = products.find((product) => product.id === productId);
                        updateLine(line.key, {
                          productId: productId || "",
                          unitCost: selected?.cost || 0,
                        });
                      }}
                      className="input-field min-w-56"
                    >
                      <option value="">{lang === "en" ? "Choose product" : "Chagua bidhaa"}</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      required
                      min={1}
                      type="number"
                      value={line.quantity}
                      onChange={(event) =>
                        updateLine(line.key, { quantity: Math.max(1, Number(event.target.value)) })
                      }
                      className="input-field w-20"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      required
                      min={0}
                      type="number"
                      value={line.unitCost}
                      onChange={(event) =>
                        updateLine(line.key, { unitCost: Math.max(0, Number(event.target.value)) })
                      }
                      className="input-field w-32"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      required
                      value={line.batchNumber}
                      onChange={(event) =>
                        updateLine(line.key, { batchNumber: event.target.value })
                      }
                      className="input-field w-36"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      required
                      type="date"
                      value={line.expiryDate}
                      onChange={(event) => updateLine(line.key, { expiryDate: event.target.value })}
                      className="input-field w-40"
                    />
                  </td>
                  <td className="p-2 text-right font-semibold">
                    TZS {money(line.quantity * line.unitCost)}
                  </td>
                  <td className="p-2">
                    <button
                      type="button"
                      disabled={lines.length === 1}
                      onClick={() =>
                        setLines((current) => current.filter((item) => item.key !== line.key))
                      }
                      className="rounded p-2 text-rose-600 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="glass-card grid gap-4 p-5 sm:grid-cols-[1fr_auto]">
          <Field label={lang === "en" ? "Notes" : "Maelezo"}>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="input-field min-h-20"
            />
          </Field>
          <div className="min-w-52 self-end text-right">
            <p className="text-xs uppercase text-muted-foreground">
              {lang === "en" ? "Grand total" : "Jumla kuu"}
            </p>
            <p className="text-xl font-black">TZS {money(total)}</p>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => history.back()}
            className="rounded-xl border px-5 py-2.5 text-sm font-semibold"
          >
            {t("cancel")}
          </button>
          <button
            disabled={saving}
            className="rounded-xl bg-[#1f9c88] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving
              ? t("saving")
              : receiveNow
                ? lang === "en"
                  ? "Save & receive"
                  : "Hifadhi na pokea"
                : lang === "en"
                  ? "Save order"
                  : "Hifadhi agizo"}
          </button>
        </div>
      </form>
    </FormShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1 text-xs font-semibold text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  );
}
