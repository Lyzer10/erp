import { useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { FormShell } from "@/components/erp/FormShell";
import { useTranslate } from "@/lib/i18n";

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

function genId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 9);
}

export function InvoiceForm({ variant }: Props) {
  const router = useRouter();
  const { t, lang } = useTranslate();
  const isInvoice = variant === "invoice";
  
  const title = isInvoice 
    ? (lang === "en" ? "Create Invoice" : "Tengeneza Ankara") 
    : (lang === "en" ? "Create Proforma" : "Tengeneza Proforma");

  const submitLabel = isInvoice 
    ? (lang === "en" ? "Submit Invoice" : "Wasilisha Ankara") 
    : (lang === "en" ? "Submit Proforma" : "Wasilisha Proforma");

  const [items, setItems] = useState<LineItem[]>([
    { id: genId(), productId: "", description: "", qty: 1, price: 0 },
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
    setItems((arr) => [...arr, { id: genId(), productId: "", description: "", qty: 1, price: 0 }]);
  const removeItem = (id: string) => setItems((arr) => arr.filter((x) => x.id !== id));
  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setItems((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const onPickProduct = (id: string, pid: string) => {
    const p = PRODUCTS.find((x) => x.id === pid);
    updateItem(id, { productId: pid, price: p?.price ?? 0 });
  };

  const localizedProductName = (name: string) => {
    if (lang === "en") return name;
    const map: Record<string, string> = {
      "Premium Coffee 1kg": "Kahawa ya Kwanza 1kg",
      "Organic Sugar 2kg": "Sukari ya Asili 2kg",
      "Hand Sanitizer 500ml": "Sanitaiza ya Mikono 500ml",
      "LED Bulb 9W": "Taa ya LED 9W",
      "Office Chair": "Kiti cha Ofisi",
    };
    return map[name] || name;
  };

  return (
    <FormShell
      header={
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.history.back()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              aria-label={lang === "en" ? "Back" : "Rudi"}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          </div>
        </div>
      }
    >
      {/* Section 1: Meta */}
      <Section title={lang === "en" ? "Customer & Details" : "Mteja na Maelezo"}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Field label={lang === "en" ? "Select Customer" : "Mteja"} full>
            <select className={inputCls}>
              <option value="">{lang === "en" ? "Search customer..." : "Tafuta mteja..."}</option>
              <option>Acme Trading Ltd</option>
              <option>Skyline Holdings</option>
              <option>Bluepeak Industries</option>
              <option>Greenfield Co.</option>
              <option>Harbor Logistics</option>
            </select>
          </Field>
          <Field label={lang === "en" ? "Date" : "Tarehe"}><input type="date" className={inputCls} defaultValue={new Date().toISOString().slice(0,10)} /></Field>
          <Field label={lang === "en" ? "Payment Terms" : "Masharti ya Malipo"}>
            <select className={inputCls}>
              <option value="Cash">{lang === "en" ? "Cash" : "Taslimu"}</option>
              <option value="Credit 30">{lang === "en" ? "Credit 30 days" : "Mkopo siku 30"}</option>
              <option value="Credit 60">{lang === "en" ? "Credit 60 days" : "Mkopo siku 60"}</option>
              <option value="Credit 90">{lang === "en" ? "Credit 90 days" : "Mkopo siku 90"}</option>
            </select>
          </Field>
          <Field label={lang === "en" ? "Payment Account" : "Akaunti ya Malipo"}>
            <select className={inputCls}>
              <option value="Cash">{lang === "en" ? "Cash Account" : "Akaunti ya Taslimu"}</option>
              <option>NMB Mbezi Luis</option>
              <option>CRDB Main</option>
            </select>
          </Field>
          <Field label={lang === "en" ? "Sales Person" : "Muuzaji (Mfanyakazi)"}>
            <select className={inputCls}>
              <option>Aisha Otieno</option>
              <option>John Mwamba</option>
              <option>Fatuma Ally</option>
            </select>
          </Field>
          <Field label={lang === "en" ? "Project (optional)" : "Mradi (hiari)"}>
            <input type="text" className={inputCls} placeholder={lang === "en" ? "Project name" : "Jina la mradi"} />
          </Field>
          <Field label={lang === "en" ? "Currency" : "Sarafu"}>
            <select className={inputCls}><option>TZS</option><option>USD</option><option>EUR</option></select>
          </Field>

          {isInvoice && <>
            <Field label={lang === "en" ? "Ship To" : "Safirisha Kwenda"}>
              <input type="text" className={inputCls} placeholder={lang === "en" ? "Delivery address" : "Anwani ya uwasilishaji"} />
            </Field>
            <Field label={lang === "en" ? "LPO No" : "Namba ya LPO"}>
              <input type="text" className={inputCls} placeholder={lang === "en" ? "LPO reference" : "Kielelezo cha LPO"} />
            </Field>
            <Field label={lang === "en" ? "LPO Date" : "Tarehe ya LPO"}><input type="date" className={inputCls} /></Field>
            <Field label={lang === "en" ? "Customer Advance (optional)" : "Amana ya Mteja (hiari)"}>
              <select className={inputCls}>
                <option value="">—</option>
                <option value="adv1">Adv-001 ({lang === "en" ? "TZS 250,000" : "TZS 250,000"})</option>
              </select>
            </Field>
          </>}

          <Field label={lang === "en" ? "Invoice Type" : "Aina ya Ankara"}>
            <select className={inputCls}>
              {isInvoice ? (
                <>
                  <option value="Tax">{lang === "en" ? "Tax Invoice" : "Ankara ya Kodi"}</option>
                  <option value="Proforma">Proforma</option>
                  <option value="Credit">{lang === "en" ? "Credit Note" : "Hati ya Mkopo"}</option>
                </>
              ) : (
                <>
                  <option value="Standard">{lang === "en" ? "Standard" : "Kawaida"}</option>
                  <option value="Commercial">{lang === "en" ? "Commercial" : "Ya Kibiashara"}</option>
                  <option value="Customs">{lang === "en" ? "Customs" : "Ya Forodha"}</option>
                </>
              )}
            </select>
          </Field>

          {isInvoice && (
            <Field label={lang === "en" ? "Tender No (optional)" : "Namba ya Zabuni (hiari)"}>
              <input type="text" className={inputCls} placeholder={lang === "en" ? "Tender ref" : "Kielelezo cha zabuni"} />
            </Field>
          )}
        </div>
      </Section>

      {/* Section 2: Line items */}
      <Section title={lang === "en" ? "Line Items" : "Vipengele vya Bidhaa"}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                {[
                  "#",
                  lang === "en" ? "Product Name" : "Jina la Bidhaa",
                  lang === "en" ? "Brand" : "Chapa",
                  lang === "en" ? "Store" : "Stoo",
                  lang === "en" ? "Description" : "Maelezo",
                  lang === "en" ? "Avail Qty" : "Zilizopo",
                  lang === "en" ? "Quantity" : "Idadi",
                  lang === "en" ? "Price" : "Bei",
                  lang === "en" ? "Total" : "Jumla",
                  ""
                ].map((h, i) => (
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
                        <option value="">{lang === "en" ? "Select product..." : "Chagua bidhaa..."}</option>
                        {PRODUCTS.map((x) => <option key={x.id} value={x.id}>{localizedProductName(x.name)}</option>)}
                      </select>
                    </td>
                    <td className="px-2 py-2 text-xs">{p?.brand ?? "—"}</td>
                    <td className="px-2 py-2 text-xs">{p?.store ? (lang === "en" ? p.store : p.store.replace("Main Store", "Stoo Kuu").replace("Warehouse", "Ghala")) : "—"}</td>
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
          <Plus className="h-3.5 w-3.5" /> 
          {lang === "en" ? "Add Item" : "Ongeza Kipengele"}
        </button>
      </Section>

      {/* Section 3: Terms & Totals */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Section title={lang === "en" ? "Notes" : "Maelezo ya Nyongeza"} className="lg:col-span-2">
          <div className="space-y-3">
            <Field label={lang === "en" ? "Terms & Condition" : "Masharti na Vigezo"}>
              <textarea rows={3} className={inputCls} placeholder={lang === "en" ? "Payment terms, conditions..." : "Vigezo vya malipo, vigezo..."} />
            </Field>
            <Field label={isInvoice ? (lang === "en" ? "Invoice Description" : "Maelezo ya Ankara") : (lang === "en" ? "Proforma Description" : "Maelezo ya Proforma")}>
              <textarea rows={3} className={inputCls} placeholder={lang === "en" ? "Description..." : "Maelezo..."} />
            </Field>
          </div>
        </Section>

        <div className="glass-card space-y-3 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">{lang === "en" ? "Totals" : "Hesabu ya Jumla"}</h3>
          <RowKV label={lang === "en" ? "Sub Total" : "Nusu Jumla"} value={tzs(subTotal)} />
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">{lang === "en" ? "Discount (%)" : "Punguzo (%)"}</span>
            <input type="number" min={0} max={100} value={discountPct}
              onChange={(e) => setDiscountPct(Number(e.target.value) || 0)}
              className={inputCls + " w-20 text-right"} />
          </div>
          <RowKV label={lang === "en" ? "Discount Amount" : "Kiasi cha Punguzo"} value={tzs(discountAmt)} muted />
          <label className="flex items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">VAT (18%)</span>
            <input type="checkbox" checked={vatOn} onChange={(e) => setVatOn(e.target.checked)}
              className="h-4 w-4 accent-blue-600" />
          </label>
          <RowKV label={lang === "en" ? "VAT Amount" : "Kiasi cha VAT"} value={tzs(vatAmt)} muted />
          <div className="mt-3 border-t border-slate-200 pt-3">
            <div className="flex items-center justify-between text-base font-bold">
              <span>{lang === "en" ? "Grand Total" : "Jumla Kuu"}</span>
              <span className="text-blue-700">{tzs(grandTotal)}</span>
            </div>
          </div>
          {isInvoice && (
            <div className="flex items-center justify-between gap-2 pt-2 text-sm">
              <span className="text-muted-foreground">{lang === "en" ? "Payment Amount" : "Kiasi cha Malipo"}</span>
              <input type="number" min={0} value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value) || 0)}
                className={inputCls + " w-32 text-right"} />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          {lang === "en" ? "Save Draft" : "Hifadhi Rasimu"}
        </button>
        <button className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">
          {lang === "en" ? "Preview" : "Uhakiki"}
        </button>
        <button className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          {submitLabel}
        </button>
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
