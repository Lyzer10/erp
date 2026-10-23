import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Eye, Printer, X } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/erp/DataTable";
import { PageHeader } from "@/components/erp/PageHeader";
import { StatusPill } from "@/components/erp/StatusPill";
import { getSaleReceiptFn, getSalesFn, voidSaleFn } from "@/lib/api/operations";
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
type ReceiptDetail = Awaited<ReturnType<typeof getSaleReceiptFn>>;

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
  const [detail, setDetail] = useState<ReceiptDetail | null>(null);
  const [loadingReceipt, setLoadingReceipt] = useState<number | null>(null);

  async function viewReceipt(sale: Sale) {
    setLoadingReceipt(sale.id);
    setError(null);
    try { setDetail(await getSaleReceiptFn({ data: { saleId: sale.id } })); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Receipt details could not be loaded."); }
    finally { setLoadingReceipt(null); }
  }

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
          {
            key: "receiptNumber",
            header: lang === "en" ? "Receipt" : "Risiti",
            render: (row: Sale) => (
              <button type="button" onClick={() => void viewReceipt(row)} className="font-semibold text-[#087b69] hover:underline">
                {row.receiptNumber}
              </button>
            ),
          },
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
            render: (row: Sale) => (
              <div className="flex items-center justify-end gap-2">
                <button type="button" disabled={loadingReceipt === row.id} onClick={() => void viewReceipt(row)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1 text-xs font-bold disabled:opacity-50">
                  <Eye className="h-3.5 w-3.5" /> {loadingReceipt === row.id ? (lang === "en" ? "Opening..." : "Inafungua...") : (lang === "en" ? "View" : "Angalia")}
                </button>
                {row.status === "Completed" && <button
                  onClick={() => setVoiding(row)}
                  className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700"
                >
                  {lang === "en" ? "Void" : "Batilisha"}
                </button>}
              </div>
            ),
          },
        ]}
      />
      {detail && <ReceiptDialog detail={detail} lang={lang} onClose={() => setDetail(null)} />}
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

function ReceiptDialog({ detail, lang, onClose }: { detail: ReceiptDetail; lang: "en" | "sw"; onClose: () => void }) {
  const { receipt, items, payments, business } = detail;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 p-4 print:static print:bg-white print:p-0" onMouseDown={onClose}>
      <div className="mx-auto my-6 w-full max-w-2xl rounded-2xl bg-white shadow-xl print:my-0 print:max-w-none print:rounded-none print:shadow-none" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b px-5 py-4 print:hidden">
          <div><h2 className="font-bold">{lang === "en" ? "Receipt details" : "Maelezo ya risiti"}</h2><p className="text-xs text-slate-500">{receipt.receiptNumber}</p></div>
          <div className="flex gap-2"><button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-3 py-2 text-sm font-bold text-white"><Printer className="h-4 w-4" />{lang === "en" ? "Print receipt" : "Chapisha risiti"}</button><button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
        </div>
        <article id="receipt-print-area" className="p-6 sm:p-8">
          <div className="text-center">
            <h1 className="text-xl font-bold">{business.businessName}</h1>
            {business.address && <p className="text-sm text-slate-600">{business.address}</p>}
            {(business.phone || business.email) && <p className="text-xs text-slate-500">{[business.phone, business.email].filter(Boolean).join(" · ")}</p>}
            {business.tin && <p className="text-xs text-slate-500">TIN: {business.tin}</p>}
            <h2 className="mt-4 text-sm font-bold uppercase tracking-wide">{lang === "en" ? "Sales receipt" : "Risiti ya mauzo"}</h2>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 border-y py-4 text-sm">
            <Info label={lang === "en" ? "Receipt" : "Risiti"} value={receipt.receiptNumber} />
            <Info label={lang === "en" ? "Date" : "Tarehe"} value={new Date(receipt.createdAt).toLocaleString()} />
            <Info label={lang === "en" ? "Customer" : "Mteja"} value={receipt.customer || (lang === "en" ? "Walk-in Customer" : "Mteja wa kawaida")} />
            <Info label={lang === "en" ? "Cashier" : "Mhudumu"} value={receipt.cashier} />
            <Info label={lang === "en" ? "Status" : "Hali"} value={receipt.status} />
          </dl>
          <div className="mt-5 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left text-xs uppercase text-slate-500"><th className="py-2">{lang === "en" ? "Product" : "Bidhaa"}</th><th className="py-2 text-right">{lang === "en" ? "Qty" : "Idadi"}</th><th className="py-2 text-right">{lang === "en" ? "Unit price" : "Bei"}</th><th className="py-2 text-right">{lang === "en" ? "Total" : "Jumla"}</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-b"><td className="py-2.5">{item.product}</td><td className="py-2.5 text-right">{item.quantity}</td><td className="py-2.5 text-right">{money(item.unitPrice)}</td><td className="py-2.5 text-right font-semibold">{money(item.lineTotal)}</td></tr>)}</tbody></table></div>
          <div className="ml-auto mt-5 max-w-xs space-y-2 text-sm"><Total label={lang === "en" ? "Subtotal" : "Jumla ndogo"} value={receipt.subtotal} />{receipt.discount > 0 && <Total label={lang === "en" ? "Discount" : "Punguzo"} value={-receipt.discount} />}<Total label={lang === "en" ? "Tax" : "Kodi"} value={receipt.tax} /><div className="flex justify-between border-t pt-2 text-base font-bold"><span>{lang === "en" ? "Total" : "Jumla"}</span><span>{money(receipt.total)}</span></div></div>
          <div className="mt-6 rounded-xl bg-slate-50 p-4 print:border print:bg-white"><h3 className="text-xs font-bold uppercase text-slate-500">{lang === "en" ? "Payment" : "Malipo"}</h3>{payments.map((payment) => <div key={payment.id} className="mt-2 flex justify-between gap-4 text-sm"><span className="capitalize">{payment.method}{payment.reference ? ` · ${payment.reference}` : ""}</span><span className="font-semibold">{money(payment.amount)}</span></div>)}</div>
          <p className="mt-6 text-center text-xs text-slate-500">{lang === "en" ? "Thank you for your purchase." : "Asante kwa kununua nasi."}</p>
        </article>
      </div>
      <style>{`@media print { body * { visibility: hidden !important; } #receipt-print-area, #receipt-print-area * { visibility: visible !important; } #receipt-print-area { position: absolute; inset: 0; width: 100%; } }`}</style>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs text-slate-500">{label}</dt><dd className="font-semibold">{value}</dd></div>; }
function Total({ label, value }: { label: string; value: number }) { return <div className="flex justify-between"><span className="text-slate-600">{label}</span><span>{money(value)}</span></div>; }
