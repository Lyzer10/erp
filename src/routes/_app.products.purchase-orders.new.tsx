import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Paperclip, X } from "lucide-react";
import { FormShell, InfoRail } from "@/components/erp/FormShell";


export const Route = createFileRoute("/_app/products/purchase-orders/new")({
  head: () => ({ meta: [{ title: "Create LPO — DeveleERP" }] }),
  component: CreateLPOPage,
});

const CURRENCIES = ["TZS", "USD", "EUR", "GBP", "KES"];
const SUPPLIERS = ["Supplier A Co.", "Supplier B Holdings", "Supplier C Industries", "Supplier D Co.", "Supplier E Logistics"];

const fmt = (n: number) => new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(n);

function CreateLPOPage() {
  const router = useRouter();

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
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Create Local Purchase Order</h1>
            <p className="text-sm text-muted-foreground">Fill in the details below to raise a new LPO.</p>
          </div>
        </div>
      }
      aside={
        <InfoRail
          about={{
            title: "About Purchase Orders",
            description: "An LPO authorises a supplier to deliver goods at agreed terms. It is the first step in the procurement cycle.",
            bullets: ["Locks supplier pricing", "Tracks goods receipt", "Feeds 3-way matching"],
          }}
          tips={[
            "Confirm the supplier's bank details before issuing.",
            "Set withholding tax only where statutorily required.",
            "Attach quotations for audit traceability.",
            "Use the Comment field for internal context.",
          ]}
          notice="LPOs over TZS 5,000,000 require dual approval."
        />
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main form */}
        <div className="space-y-5 lg:col-span-2">

          {/* Product details */}
          <div className="glass-card space-y-4 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Product Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product Name" required>
                <input
                  value={product} onChange={(e) => setProduct(e.target.value)}
                  placeholder="e.g. Office Chair"
                  className="input-field"
                />
              </Field>
              <Field label="Brand Code">
                <input
                  value={brandCode} onChange={(e) => setBrandCode(e.target.value)}
                  placeholder="e.g. BR-001"
                  className="input-field"
                />
              </Field>
              <Field label="Unit Cost" required>
                <input
                  type="number" min="0" step="0.01"
                  value={unitCost} onChange={(e) => setUnitCost(e.target.value)}
                  placeholder="0.00"
                  className="input-field"
                />
              </Field>
              <Field label="Quantity" required>
                <input
                  type="number" min="1"
                  value={qty} onChange={(e) => setQty(e.target.value)}
                  className="input-field"
                />
              </Field>
            </div>
            <Field label="Description">
              <textarea
                value={description} onChange={(e) => setDescription(e.target.value)}
                rows={3} placeholder="Optional product description..."
                className="input-field resize-none"
              />
            </Field>

            {/* Line total */}
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5">
              <span className="text-sm font-medium text-slate-600">Line Total</span>
              <span className="font-semibold text-slate-900">{currency} {fmt(lineTotal)}</span>
            </div>
          </div>

          {/* Order details */}
          <div className="glass-card space-y-4 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Order Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Select Date" required>
                <input
                  type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="input-field"
                />
              </Field>
              <Field label="Select Supplier" required>
                <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className="input-field">
                  <option value="">Choose supplier...</option>
                  {SUPPLIERS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Currency">
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input-field">
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label={`Withholding Tax (${withholdingPct}%)`}>
                <input
                  type="number" min="0" max="100" step="0.5"
                  value={withholdingPct} onChange={(e) => setWithholdingPct(e.target.value)}
                  className="input-field"
                />
              </Field>
            </div>
            <Field label="Discount (%)">
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
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Attachment & Notes</h2>
            <Field label="Attachment (max 5 MB)">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white/60 p-3 hover:bg-white/80">
                <Paperclip className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="text-sm text-muted-foreground">{fileName || "Choose file (.pdf, .xlsx, .jpg)"}</span>
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
                    else if (f) alert("File exceeds 5 MB limit.");
                  }}
                />
              </label>
            </Field>
            <Field label="Comment">
              <textarea
                value={comment} onChange={(e) => setComment(e.target.value)}
                rows={3} placeholder="Internal note or instructions..."
                className="input-field resize-none"
              />
            </Field>
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Order Summary</h2>
            <div className="space-y-2.5 text-sm">
              <SummaryRow label="Sub Total" value={`${currency} ${fmt(subTotal)}`} />
              <SummaryRow label={`Discount (${discountNum}%)`} value={`- ${currency} ${fmt(discountAmount)}`} muted />
              <SummaryRow label={`Withholding Tax (${withholdingNum}%)`} value={`- ${currency} ${fmt(withholdingAmount)}`} muted />
              <div className="my-1 h-px bg-slate-100" />
              <SummaryRow label="VAT Amount (18%)" value={`+ ${currency} ${fmt(vatAmount)}`} accent />
              <div className="my-1 h-px bg-slate-200" />
              <SummaryRow label="Grand Total" value={`${currency} ${fmt(grandTotal)}`} bold />
            </div>
          </div>

          <div className="space-y-2">
            <button
              className="w-full rounded-lg bg-linear-to-r from-blue-500 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90"
              onClick={() => router.history.back()}
            >
              Submit LPO
            </button>
            <button
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              onClick={() => router.history.back()}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(226 232 240);
          background: rgba(255,255,255,0.7);
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input-field:focus {
          ring: 2px;
          border-color: rgb(147 197 253);
          box-shadow: 0 0 0 2px rgba(147,197,253,0.4);
        }
      `}</style>
    </div>
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
      <span className={`tabular-nums ${bold ? "text-base font-bold text-slate-900" : accent ? "font-medium text-blue-600" : muted ? "text-slate-400" : "text-slate-700"}`}>
        {value}
      </span>
    </div>
  );
}
