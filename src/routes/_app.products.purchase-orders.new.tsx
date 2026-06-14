import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Paperclip, X } from "lucide-react";
import { FormShell, InfoRail } from "@/components/erp/FormShell";
import { useTranslate } from "@/lib/i18n";


export const Route = createFileRoute("/_app/products/purchase-orders/new")({
  head: () => ({ meta: [{ title: "Create LPO — DeveleERP" }] }),
  component: CreateLPOPage,
});

const CURRENCIES = ["TZS", "USD", "EUR", "GBP", "KES"];
const SUPPLIERS = ["Supplier A Co.", "Supplier B Holdings", "Supplier C Industries", "Supplier D Co.", "Supplier E Logistics"];

const fmt = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

function CreateLPOPage() {
  const router = useRouter();
  const { lang, t } = useTranslate();

  const [product, setProduct] = useState("");
  const [brandCode, setBrandCode] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [description, setDescription] = useState("");
  const [qty, setQty] = useState("1");
  const [date, setDate] = useState("");
  const [supplier, setSupplier] = useState("");
  const [withholdingPct, setWithholdingPct] = useState("0");
  const [currency, setCurrency] = useState("TZS");
  const [discount, setDiscount] = useState("0");
  const [comment, setComment] = useState("");
  const [fileName, setFileName] = useState("");

  const unitCostNum = parseFloat(unitCost) || 0;
  const qtyNum = parseInt(qty) || 0;
  const discountNum = parseFloat(discount) || 0;
  const withholdingNum = parseFloat(withholdingPct) || 0;

  const lineTotal = unitCostNum * qtyNum;
  const subTotal = lineTotal;
  const discountAmount = subTotal * (discountNum / 100);
  const afterDiscount = subTotal - discountAmount;
  const withholdingAmount = afterDiscount * (withholdingNum / 100);
  const vatAmount = (afterDiscount - withholdingAmount) * 0.18;
  const grandTotal = afterDiscount - withholdingAmount + vatAmount;

  return (
    <FormShell
      header={
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.history.back()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            aria-label={t("cancel")}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{t("createLpoTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("createLpoSub")}</p>
          </div>
        </div>
      }
      aside={
        <InfoRail
          about={{
            title: t("aboutPurchaseOrdersTitle"),
            description: t("aboutPurchaseOrdersDesc"),
            bullets: [
              t("aboutPurchaseOrdersBullet1"),
              t("aboutPurchaseOrdersBullet2"),
              t("aboutPurchaseOrdersBullet3"),
            ],
          }}
          tips={[
            t("quickTip1"),
            t("quickTip2"),
            t("quickTip3"),
            t("quickTip4"),
          ]}
          notice={t("lpoNotice")}
        />
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main form */}
        <div className="space-y-5 lg:col-span-2">

          {/* Product details */}
          <div className="glass-card space-y-4 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("productDetails")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("productName")} required>
                <input
                  value={product} onChange={(e) => setProduct(e.target.value)}
                  placeholder={lang === "en" ? "e.g. Office Chair" : "mf. Kiti cha Ofisi"}
                  className="input-field"
                />
              </Field>
              <Field label={t("brandCode")}>
                <input
                  value={brandCode} onChange={(e) => setBrandCode(e.target.value)}
                  placeholder="e.g. BR-001"
                  className="input-field"
                />
              </Field>
              <Field label={t("unitCost")} required>
                <input
                  type="number" min="0" step="0.01"
                  value={unitCost} onChange={(e) => setUnitCost(e.target.value)}
                  placeholder="0.00"
                  className="input-field"
                />
              </Field>
              <Field label={t("quantity")} required>
                <input
                  type="number" min="1"
                  value={qty} onChange={(e) => setQty(e.target.value)}
                  className="input-field"
                />
              </Field>
            </div>
            <Field label={t("description")}>
              <textarea
                value={description} onChange={(e) => setDescription(e.target.value)}
                rows={3} placeholder={lang === "en" ? "Optional product description..." : "Maelezo ya bidhaa ya hiari..."}
                className="input-field resize-none"
              />
            </Field>

            {/* Line total */}
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5">
              <span className="text-sm font-medium text-slate-600">{lang === "en" ? "Line Total" : "Jumla ya Mstari"}</span>
              <span className="font-semibold text-slate-900">{currency} {fmt(lineTotal)}</span>
            </div>
          </div>

          {/* Order details */}
          <div className="glass-card space-y-4 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("orderDetails")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("selectDate")} required>
                <input
                  type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="input-field"
                />
              </Field>
              <Field label={t("selectSupplier")} required>
                <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className="input-field">
                  <option value="">{lang === "en" ? "Choose supplier..." : "Chagua muuzaji..."}</option>
                  {SUPPLIERS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label={t("currencyLabel")}>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input-field">
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label={`${t("withholdingTax")} (${withholdingPct}%)`}>
                <input
                  type="number" min="0" max="100" step="0.5"
                  value={withholdingPct} onChange={(e) => setWithholdingPct(e.target.value)}
                  className="input-field"
                />
              </Field>
            </div>
            <Field label={t("discount")}>
              <input
                type="number" min="0" max="100" step="0.5"
                value={discount} onChange={(e) => setDiscount(e.target.value)}
                placeholder="0"
                className="input-field max-w-xs"
              />
            </Field>
          </div>

          {/* Attachment + Comment */}
          <div className="glass-card space-y-4 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("attachmentsNotes")}</h2>
            <Field label={t("attachmentLimit")}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white/60 p-3 hover:bg-white/80">
                <Paperclip className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="text-sm text-muted-foreground">{fileName || t("chooseFile")}</span>
                {fileName && (
                  <button type="button" onClick={(e) => { e.preventDefault(); setFileName(""); }}
                    className="ml-auto rounded p-0.5 hover:text-rose-600">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <input
                  type="file" className="hidden"
                  accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f && f.size <= 5 * 1024 * 1024) setFileName(f.name);
                    else if (f) alert(lang === "en" ? "File exceeds 5 MB limit." : "Faili inazidi kikomo cha MB 5.");
                  }}
                />
              </label>
            </Field>
            <Field label={t("comment")}>
              <textarea
                value={comment} onChange={(e) => setComment(e.target.value)}
                rows={3} placeholder={lang === "en" ? "Internal note or instructions..." : "Maelezo ya ndani au maelekezo..."}
                className="input-field resize-none"
              />
            </Field>
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("orderSummary")}</h2>
            <div className="space-y-2.5 text-sm">
              <SummaryRow label={t("subTotal")} value={`${currency} ${fmt(subTotal)}`} />
              <SummaryRow label={`${t("discount").replace(" (%)", "")} (${discountNum}%)`} value={`- ${currency} ${fmt(discountAmount)}`} muted />
              <SummaryRow label={`${t("withholdingTax")} (${withholdingNum}%)`} value={`- ${currency} ${fmt(withholdingAmount)}`} muted />
              <div className="my-1 h-px bg-slate-100" />
              <SummaryRow label={t("vatAmount")} value={`+ ${currency} ${fmt(vatAmount)}`} accent />
              <div className="my-1 h-px bg-slate-200" />
              <SummaryRow label={t("grandTotal")} value={`${currency} ${fmt(grandTotal)}`} bold />
            </div>
          </div>

          <div className="space-y-2">
            <button
              className="w-full rounded-lg bg-[#1f9c88] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#177d6d] transition cursor-pointer"
              onClick={() => router.history.back()}
            >
              {t("submitLpo")}
            </button>
            <button
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              onClick={() => router.history.back()}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(226 232 240);
          background: var(--color-slate-50);
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s ease;
        }
        .input-field:focus {
          background: #ffffff;
          border-color: #1f9c88;
          box-shadow: 0 0 0 2px rgba(31, 156, 136, 0.15);
        }
      `}</style>
    </FormShell>

  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-slate-700">
        {label}{required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function SummaryRow({ label, value, muted, accent, bold }: { label: string; value: string; muted?: boolean; accent?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={muted ? "text-slate-400" : "text-slate-600"}>{label}</span>
      <span className={`tabular-nums ${bold ? "text-base font-bold text-slate-900" : accent ? "font-medium text-[#1f9c88]" : muted ? "text-slate-400" : "text-slate-700"}`}>
        {value}
      </span>
    </div>
  );
}
