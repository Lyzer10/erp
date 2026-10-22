import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/erp/DataTable";
import { PageHeader } from "@/components/erp/PageHeader";
import { StatusPill } from "@/components/erp/StatusPill";
import { getSalesFn, voidSaleFn } from "@/lib/api/operations";
import { useTranslate } from "@/lib/i18n";

type Sale = {
  id: number;
  receiptNumber: string;
  customer?: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: string;
  createdAt: Date | string;
};

export const Route = createFileRoute("/_app/sales/receipts")({
  head: () => ({ meta: [{ title: "Receipts — DeveleERP" }] }),
  loader: () => getSalesFn(),
  component: ReceiptsPage,
});

const money = (value: number) => `TZS ${new Intl.NumberFormat("en-TZ").format(value)}`;

function ReceiptsPage() {
  const { lang } = useTranslate();
  const router = useRouter();
  // Read loader data directly so background refreshes (e.g. after a POS sale) show up.
  const sales = Route.useLoaderData() as Sale[];
  const [voiding, setVoiding] = useState<Sale | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function voidSale(event: React.FormEvent) {
    event.preventDefault();
    if (!voiding) return;
    setError(null);
    try {
      await voidSaleFn({ data: { saleId: voiding.id, reason } });
      setVoiding(null);
      setReason("");
      await router.invalidate();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sale could not be voided.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === "en" ? "Sales Receipts" : "Risiti za Mauzo"}
        description={
          lang === "en"
            ? "Posted sales from the point of sale. Voids restore the original stock batches."
            : "Mauzo halisi kutoka sehemu ya mauzo."
        }
        actions={
          <Link
            to="/pos"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            {lang === "en" ? "Back to POS" : "Rudi Kituo cha Mauzo"}
          </Link>
        }
      />
      <DataTable
        data={sales}
        columns={[
          { key: "receiptNumber", header: "Receipt" },
          {
            key: "createdAt",
            header: "Date",
            render: (row: Sale) => new Date(row.createdAt).toLocaleString(),
          },
          {
            key: "customer",
            header: "Customer",
            render: (row: Sale) => row.customer || "Walk-in Customer",
          },
          {
            key: "subtotal",
            header: "Subtotal",
            align: "right",
            render: (row: Sale) => money(row.subtotal),
          },
          { key: "tax", header: "Tax", align: "right", render: (row: Sale) => money(row.tax) },
          {
            key: "total",
            header: "Total",
            align: "right",
            render: (row: Sale) => money(row.total),
          },
          {
            key: "status",
            header: "Status",
            render: (row: Sale) => <StatusPill status={row.status} />,
          },
          {
            key: "action",
            header: "",
            render: (row: Sale) =>
              row.status === "Completed" ? (
                <button
                  onClick={() => setVoiding(row)}
                  className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700"
                >
                  Void
                </button>
              ) : null,
          },
        ]}
      />
      {voiding && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"
          onMouseDown={() => setVoiding(null)}
        >
          <form
            onSubmit={voidSale}
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6"
          >
            <h2 className="text-lg font-bold">Void {voiding.receiptNumber}?</h2>
            <p className="text-sm text-muted-foreground">
              This posts a reversing stock movement and preserves the original receipt for audit.
            </p>
            {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
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
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setVoiding(null)}
                className="rounded-xl border px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white">
                Void sale
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
