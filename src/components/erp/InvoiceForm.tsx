import { useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { FormShell, InfoRail } from "@/components/erp/FormShell";


const tzs = (n: number) => "TZS " + new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const PRODUCTS = [
  { id: "p1", name: "Premium Coffee 1kg",   brand: "Brava",     store: "Main Store",   price:  25_000, avail: 120 },
  { id: "p2", name: "Organic Sugar 2kg",    brand: "Northstar", store: "Main Store",   price:  18_500, avail:  80 },
  { id: "p3", name: "Hand Sanitizer 500ml", brand: "Helios",    store: "Branch A",     price:  12_000, avail: 200 },
  { id: "p4", name: "LED Bulb 9W",          brand: "Verde",     store: "Branch B",     price:   8_500, avail: 340 },
  { id: "p5", name: "Office Chair",         brand: "Apex",      store: "Warehouse 1",  price: 320_000, avail:  15 },
];

type LineItem = {
  id: string;
  productId: string;
  description: string;
  qty: number;
  price: number;
};

interface Props {
  variant: "invoice" | "proforma";
}

export function InvoiceForm({ variant }: Props) {
  const router = useRouter();
  const isInvoice = variant === "invoice";
  const title = isInvoice ? "Create Invoice" : "Create Proforma";
  const submitLabel = isInvoice ? "Submit Invoice" : "Submit Proforma";

  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), productId: "", description: "", qty: 1, price: 0 },
  ]);
  const [discountPct, setDiscountPct] = useState(0);
  const [vatOn, setVatOn] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const subTotal = useMemo(
    () => items.reduce((s, it) => s + it.qty * it.price, 0),
    [items],
  );
  const discountAmt = subTotal * (discountPct / 100);
  const taxable = subTotal - discountAmt;
  const vatAmt = vatOn ? taxable * 0.18 : 0;
  const grandTotal = taxable + vatAmt;

  const addItem = () =>
    setItems((arr) => [...arr, { id: crypto.randomUUID(), productId: "", description: "", qty: 1, price: 0 }]);
  const removeItem = (id: string) => setItems((arr) => arr.filter((x) => x.id !== id));
  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setItems((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const onPickProduct = (id: string, pid: string) => {
    const p = PRODUCTS.find((x) => x.id === pid);
    updateItem(id, { productId: pid, price: p?.price ?? 0 });
  };

  return (
    <FormShell
      header={
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.history.back()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          </div>
        </div>
      }
      aside={
        <InfoRail
          about={{
            title: isInvoice ? "About Invoicing" : "About Proforma",
            description: isInvoice
              ? "Tax invoices are the official record of a sale. They drive receivables, VAT reporting, and customer statements."
              : "A proforma is a quotation-style document sent before an invoice. It is not posted to the ledger until converted.",
            bullets: isInvoice
              ? ["Posts to debtors and revenue", "Triggers VAT obligation", "Available in customer statement"]
              : ["No accounting entries posted", "Can be converted to a tax invoice", "Useful for quotes and pre-orders"],
          }}
          tips={[
            "Verify the customer's TIN before saving.",
            "Toggle VAT off only for exempt goods.",
            "Use Payment Terms to drive due-date alerts.",
            "Attach LPO references for traceability.",
          ]}
          notice={isInvoice ? "All tax invoices must comply with TRA EFD regulations." : undefined}
        />
      }
    >


      {/* Section 1: Meta */}
      <Section title="Customer & Details">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Field label="Select Customer" full>
            <select className={inputCls}>
              <option value="">Search customer...</option>
              <option>Acme Trading Ltd</option>
              <option>Skyline Holdings</option>
              <option>Bluepeak Industries</option>
              <option>Greenfield Co.</option>
              <option>Harbor Logistics</option>
            </select>
          </Field>
          <Field label="Date"><input type="date" className={inputCls} defaultValue={new Date().toISOString().slice(0,10)} /></Field>
          <Field label="Payment Terms">
            <select className={inputCls}>
              <option>Cash</option><option>Credit 30 days</option><option>Credit 60 days</option><option>Credit 90 days</option>
            </select>
          </Field>
          <Field label="Payment Account">
            <select className={inputCls}>
              <option>Cash Account</option><option>NMB Mbezi Luis</option><option>CRDB Main</option>
            </select>
          </Field>
          <Field label="Sales Person">
            <select className={inputCls}>
              <option>Aisha Otieno</option><option>John Mwamba</option><option>Fatuma Ally</option>
            </select>
          </Field>
          <Field label="Project (optional)"><input type="text" className={inputCls} placeholder="Project name" /></Field>
          <Field label="Currency">
            <select className={inputCls}><option>TZS</option><option>USD</option><option>EUR</option></select>
          </Field>

          {isInvoice && <>
            <Field label="Ship To"><input type="text" className={inputCls} placeholder="Delivery address" /></Field>
            <Field label="LPO No"><input type="text" className={inputCls} placeholder="LPO reference" /></Field>
            <Field label="LPO Date"><input type="date" className={inputCls} /></Field>
            <Field label="Customer Advance (optional)">
              <select className={inputCls}><option>—</option><option>Adv-001 (TZS 250,000)</option></select>
            </Field>
          </>}

          <Field label="Invoice Type">
            <select className={inputCls}>
              {isInvoice ? (<><option>Tax Invoice</option><option>Proforma</option><option>Credit Note</option></>)
                        : (<><option>Standard</option><option>Commercial</option><option>Customs</option></>)}
            </select>
          </Field>

          {isInvoice && <Field label="Tender No (optional)"><input type="text" className={inputCls} placeholder="Tender ref" /></Field>}
        </div>
      </Section>

      {/* Section 2: Line items */}
      <Section title="Line Items">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                {["#","Product Name","Brand","Store","Description","Avail Qty","Quantity","Price","Total",""].map((h, i) => (
                  <th key={i} className="whitespace-nowrap px-2 py-2.5 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => {
                const p = PRODUCTS.find((x) => x.id === it.productId);
                return (
                  <tr key={it.id} className="border-b border-slate-100 align-top">
                    <td className="px-2 py-2 text-slate-500">{i + 1}</td>
                    <td className="px-2 py-2">
                      <select value={it.productId} onChange={(e) => onPickProduct(it.id, e.target.value)} className={inputCls + " min-w-[180px]"}>
                        <option value="">Select product...</option>
                        {PRODUCTS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                      </select>
                    </td>
                    <td className="px-2 py-2 text-xs">{p?.brand ?? "—"}</td>
                    <td className="px-2 py-2 text-xs">{p?.store ?? "—"}</td>
                    <td className="px-2 py-2">
                      <input type="text" value={it.description} onChange={(e) => updateItem(it.id, { description: e.target.value })} className={inputCls + " min-w-[140px]"} />
                    </td>
                    <td className="px-2 py-2 text-xs">{p?.avail ?? "—"}</td>
                    <td className="px-2 py-2">
                      <input type="number" min={1} value={it.qty} onChange={(e) => updateItem(it.id, { qty: Number(e.target.value) || 0 })} className={inputCls + " w-20"} />
                    </td>
                    <td className="px-2 py-2">
                      <input type="number" min={0} value={it.price} onChange={(e) => updateItem(it.id, { price: Number(e.target.value) || 0 })} className={inputCls + " w-28"} />
                    </td>
                    <td className="px-2 py-2 font-semibold whitespace-nowrap">{tzs(it.qty * it.price)}</td>
                    <td className="px-2 py-2">
                      <button type="button" onClick={() => removeItem(it.id)} disabled={items.length === 1}
                        className="rounded p-1.5 text-rose-600 hover:bg-rose-50 disabled:opacity-30">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={addItem}
          className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100">
          <Plus className="h-3.5 w-3.5" /> Add Item
        </button>
      </Section>

      {/* Section 3: Terms & Totals */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Section title="Notes" className="lg:col-span-2">
          <div className="space-y-3">
            <Field label="Terms & Condition">
              <textarea rows={3} className={inputCls} placeholder="Payment terms, conditions..." />
            </Field>
            <Field label={isInvoice ? "Invoice Description" : "Proforma Description"}>
              <textarea rows={3} className={inputCls} placeholder="Description..." />
            </Field>
          </div>
        </Section>

        <div className="glass-card space-y-3 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Totals</h3>
          <RowKV label="Sub Total" value={tzs(subTotal)} />
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">Discount (%)</span>
            <input type="number" min={0} max={100} value={discountPct}
              onChange={(e) => setDiscountPct(Number(e.target.value) || 0)}
              className={inputCls + " w-20 text-right"} />
          </div>
          <RowKV label="Discount Amount" value={tzs(discountAmt)} muted />
          <label className="flex items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">VAT (18%)</span>
            <input type="checkbox" checked={vatOn} onChange={(e) => setVatOn(e.target.checked)}
              className="h-4 w-4 accent-blue-600" />
          </label>
          <RowKV label="VAT Amount" value={tzs(vatAmt)} muted />
          <div className="mt-3 border-t border-slate-200 pt-3">
            <div className="flex items-center justify-between text-base font-bold">
              <span>Grand Total</span>
              <span className="text-blue-700">{tzs(grandTotal)}</span>
            </div>
          </div>
          {isInvoice && (
            <div className="flex items-center justify-between gap-2 pt-2 text-sm">
              <span className="text-muted-foreground">Payment Amount</span>
              <input type="number" min={0} value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value) || 0)}
                className={inputCls + " w-32 text-right"} />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Save Draft</button>
        <button className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">Preview</button>
        <button className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">{submitLabel}</button>
      </div>
    </FormShell>

  );
}

const inputCls = "w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all";

function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-card p-5 ${className}`}>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-600">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "lg:col-span-3 md:col-span-2" : ""}>
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      {children}
    </div>
  );
}

function RowKV({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={muted ? "text-slate-600" : "font-semibold"}>{value}</span>
    </div>
  );
}
