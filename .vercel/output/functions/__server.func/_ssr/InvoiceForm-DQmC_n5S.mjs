import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter } from "../_libs/tanstack__react-router.mjs";
import { a0 as ArrowLeft, K as Trash2, h as Plus } from "../_libs/lucide-react.mjs";
const tzs = (n) => "TZS " + new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const PRODUCTS = [
  { id: "p1", name: "Premium Coffee 1kg", brand: "Brava", store: "Main Store", price: 25e3, avail: 120 },
  { id: "p2", name: "Organic Sugar 2kg", brand: "Northstar", store: "Main Store", price: 18500, avail: 80 },
  { id: "p3", name: "Hand Sanitizer 500ml", brand: "Helios", store: "Branch A", price: 12e3, avail: 200 },
  { id: "p4", name: "LED Bulb 9W", brand: "Verde", store: "Branch B", price: 8500, avail: 340 },
  { id: "p5", name: "Office Chair", brand: "Apex", store: "Warehouse 1", price: 32e4, avail: 15 }
];
function InvoiceForm({ variant }) {
  const router = useRouter();
  const isInvoice = variant === "invoice";
  const title = isInvoice ? "Create Invoice" : "Create Proforma";
  const submitLabel = isInvoice ? "Submit Invoice" : "Submit Proforma";
  const [items, setItems] = reactExports.useState([
    { id: crypto.randomUUID(), productId: "", description: "", qty: 1, price: 0 }
  ]);
  const [discountPct, setDiscountPct] = reactExports.useState(0);
  const [vatOn, setVatOn] = reactExports.useState(true);
  const [paymentAmount, setPaymentAmount] = reactExports.useState(0);
  const subTotal = reactExports.useMemo(
    () => items.reduce((s, it) => s + it.qty * it.price, 0),
    [items]
  );
  const discountAmt = subTotal * (discountPct / 100);
  const taxable = subTotal - discountAmt;
  const vatAmt = vatOn ? taxable * 0.18 : 0;
  const grandTotal = taxable + vatAmt;
  const addItem = () => setItems((arr) => [...arr, { id: crypto.randomUUID(), productId: "", description: "", qty: 1, price: 0 }]);
  const removeItem = (id) => setItems((arr) => arr.filter((x) => x.id !== id));
  const updateItem = (id, patch) => setItems((arr) => arr.map((x) => x.id === id ? { ...x, ...patch } : x));
  const onPickProduct = (id, pid) => {
    const p = PRODUCTS.find((x) => x.id === pid);
    updateItem(id, { productId: pid, price: p?.price ?? 0 });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => router.history.back(),
          className: "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
          "aria-label": "Back",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: title })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Customer & Details", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Select Customer", full: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: inputCls, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Search customer..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Acme Trading Ltd" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Skyline Holdings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Bluepeak Industries" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Greenfield Co." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Harbor Logistics" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Date", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", className: inputCls, defaultValue: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Payment Terms", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: inputCls, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Cash" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Credit 30 days" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Credit 60 days" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Credit 90 days" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Payment Account", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: inputCls, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Cash Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "NMB Mbezi Luis" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "CRDB Main" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sales Person", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: inputCls, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Aisha Otieno" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "John Mwamba" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Fatuma Ally" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Project (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", className: inputCls, placeholder: "Project name" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Currency", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: inputCls, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "TZS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "USD" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "EUR" })
      ] }) }),
      isInvoice && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Ship To", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", className: inputCls, placeholder: "Delivery address" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "LPO No", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", className: inputCls, placeholder: "LPO reference" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "LPO Date", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", className: inputCls }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Customer Advance (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: inputCls, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Adv-001 (TZS 250,000)" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Invoice Type", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: inputCls, children: isInvoice ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Tax Invoice" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Proforma" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Credit Note" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Standard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Commercial" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Customs" })
      ] }) }) }),
      isInvoice && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tender No (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", className: inputCls, placeholder: "Tender ref" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Line Items", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-xs uppercase tracking-wide text-slate-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: ["#", "Product Name", "Brand", "Store", "Description", "Avail Qty", "Quantity", "Price", "Total", ""].map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "whitespace-nowrap px-2 py-2.5 text-left font-medium", children: h }, i)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: items.map((it, i) => {
          const p = PRODUCTS.find((x) => x.id === it.productId);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-slate-100 align-top", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-slate-500", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: it.productId, onChange: (e) => onPickProduct(it.id, e.target.value), className: inputCls + " min-w-[180px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select product..." }),
              PRODUCTS.map((x) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: x.id, children: x.name }, x.id))
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-xs", children: p?.brand ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-xs", children: p?.store ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: it.description, onChange: (e) => updateItem(it.id, { description: e.target.value }), className: inputCls + " min-w-[140px]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-xs", children: p?.avail ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, value: it.qty, onChange: (e) => updateItem(it.id, { qty: Number(e.target.value) || 0 }), className: inputCls + " w-20" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 0, value: it.price, onChange: (e) => updateItem(it.id, { price: Number(e.target.value) || 0 }), className: inputCls + " w-28" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 font-semibold whitespace-nowrap", children: tzs(it.qty * it.price) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => removeItem(it.id),
                disabled: items.length === 1,
                className: "rounded p-1.5 text-rose-600 hover:bg-rose-50 disabled:opacity-30",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            ) })
          ] }, it.id);
        }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: addItem,
          className: "mt-3 inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            " Add Item"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Notes", className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Terms & Condition", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 3, className: inputCls, placeholder: "Payment terms, conditions..." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: isInvoice ? "Invoice Description" : "Proforma Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 3, className: inputCls, placeholder: "Description..." }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card space-y-3 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold uppercase tracking-wide text-slate-600", children: "Totals" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RowKV, { label: "Sub Total", value: tzs(subTotal) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Discount (%)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              min: 0,
              max: 100,
              value: discountPct,
              onChange: (e) => setDiscountPct(Number(e.target.value) || 0),
              className: inputCls + " w-20 text-right"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RowKV, { label: "Discount Amount", value: tzs(discountAmt), muted: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "VAT (18%)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: vatOn,
              onChange: (e) => setVatOn(e.target.checked),
              className: "h-4 w-4 accent-blue-600"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RowKV, { label: "VAT Amount", value: tzs(vatAmt), muted: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 border-t border-slate-200 pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-base font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Grand Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-700", children: tzs(grandTotal) })
        ] }) }),
        isInvoice && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Payment Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              min: 0,
              value: paymentAmount,
              onChange: (e) => setPaymentAmount(Number(e.target.value) || 0),
              className: inputCls + " w-32 text-right"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50", children: "Save Draft" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100", children: "Preview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700", children: submitLabel })
    ] })
  ] });
}
const inputCls = "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200";
function Section({ title, children, className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `glass-card p-5 ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-4 text-sm font-semibold uppercase tracking-wide text-slate-600", children: title }),
    children
  ] });
}
function Field({ label, children, full }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: full ? "lg:col-span-3 md:col-span-2" : "", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-medium text-slate-600", children: label }),
    children
  ] });
}
function RowKV({ label, value, muted }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: muted ? "text-slate-600" : "font-semibold", children: value })
  ] });
}
export {
  InvoiceForm as I
};
