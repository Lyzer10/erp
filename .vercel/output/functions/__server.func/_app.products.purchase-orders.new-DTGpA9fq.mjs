import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useRouter } from "./_libs/tanstack__react-router.mjs";
import { a0 as ArrowLeft, a1 as Paperclip, X } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
const CURRENCIES = ["TZS", "USD", "EUR", "GBP", "KES"];
const SUPPLIERS = ["Supplier A Co.", "Supplier B Holdings", "Supplier C Industries", "Supplier D Co.", "Supplier E Logistics"];
const fmt = (n) => new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2
}).format(n);
function CreateLPOPage() {
  const router = useRouter();
  const [product, setProduct] = reactExports.useState("");
  const [brandCode, setBrandCode] = reactExports.useState("");
  const [unitCost, setUnitCost] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [qty, setQty] = reactExports.useState("1");
  const [date, setDate] = reactExports.useState("");
  const [supplier, setSupplier] = reactExports.useState("");
  const [withholdingPct, setWithholdingPct] = reactExports.useState("0");
  const [currency, setCurrency] = reactExports.useState("TZS");
  const [discount, setDiscount] = reactExports.useState("0");
  const [comment, setComment] = reactExports.useState("");
  const [fileName, setFileName] = reactExports.useState("");
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => router.history.back(), className: "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50", "aria-label": "Back", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold tracking-tight", children: "Create Local Purchase Order" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Fill in the details below to raise a new LPO." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card space-y-4 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold uppercase tracking-wide text-muted-foreground", children: "Product Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Product Name", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: product, onChange: (e) => setProduct(e.target.value), placeholder: "e.g. Office Chair", className: "input-field" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Brand Code", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: brandCode, onChange: (e) => setBrandCode(e.target.value), placeholder: "e.g. BR-001", className: "input-field" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Unit Cost", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", step: "0.01", value: unitCost, onChange: (e) => setUnitCost(e.target.value), placeholder: "0.00", className: "input-field" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Quantity", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "1", value: qty, onChange: (e) => setQty(e.target.value), className: "input-field" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), rows: 3, placeholder: "Optional product description...", className: "input-field resize-none" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-600", children: "Line Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-slate-900", children: [
              currency,
              " ",
              fmt(lineTotal)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card space-y-4 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold uppercase tracking-wide text-muted-foreground", children: "Order Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Select Date", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: date, onChange: (e) => setDate(e.target.value), className: "input-field" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Select Supplier", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: supplier, onChange: (e) => setSupplier(e.target.value), className: "input-field", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Choose supplier..." }),
              SUPPLIERS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Currency", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: currency, onChange: (e) => setCurrency(e.target.value), className: "input-field", children: CURRENCIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c)) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: `Withholding Tax (${withholdingPct}%)`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", max: "100", step: "0.5", value: withholdingPct, onChange: (e) => setWithholdingPct(e.target.value), className: "input-field" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Discount (%)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", max: "100", step: "0.5", value: discount, onChange: (e) => setDiscount(e.target.value), placeholder: "0", className: "input-field max-w-xs" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card space-y-4 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold uppercase tracking-wide text-muted-foreground", children: "Attachment & Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Attachment (max 5 MB)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white/60 p-3 hover:bg-white/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-4 w-4 shrink-0 text-slate-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: fileName || "Choose file (.pdf, .xlsx, .jpg)" }),
            fileName && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => {
              e.preventDefault();
              setFileName("");
            }, className: "ml-auto rounded p-0.5 hover:text-rose-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", className: "hidden", accept: ".pdf,.xlsx,.xls,.jpg,.jpeg,.png", onChange: (e) => {
              const f = e.target.files?.[0];
              if (f && f.size <= 5 * 1024 * 1024) setFileName(f.name);
              else if (f) alert("File exceeds 5 MB limit.");
            } })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Comment", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: comment, onChange: (e) => setComment(e.target.value), rows: 3, placeholder: "Internal note or instructions...", className: "input-field resize-none" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground", children: "Order Summary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: "Sub Total", value: `${currency} ${fmt(subTotal)}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: `Discount (${discountNum}%)`, value: `- ${currency} ${fmt(discountAmount)}`, muted: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: `Withholding Tax (${withholdingNum}%)`, value: `- ${currency} ${fmt(withholdingAmount)}`, muted: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-1 h-px bg-slate-100" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: "VAT Amount (18%)", value: `+ ${currency} ${fmt(vatAmount)}`, accent: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-1 h-px bg-slate-200" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: "Grand Total", value: `${currency} ${fmt(grandTotal)}`, bold: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full rounded-lg bg-linear-to-r from-blue-500 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90", onClick: () => router.history.back(), children: "Submit LPO" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50", onClick: () => router.history.back(), children: "Cancel" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
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
      ` })
  ] });
}
function Field({
  label,
  required,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs font-medium text-slate-700", children: [
      label,
      required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-0.5 text-rose-500", children: "*" })
    ] }),
    children
  ] });
}
function SummaryRow({
  label,
  value,
  muted,
  accent,
  bold
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: muted ? "text-slate-400" : "text-slate-600", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `tabular-nums ${bold ? "text-base font-bold text-slate-900" : accent ? "font-medium text-blue-600" : muted ? "text-slate-400" : "text-slate-700"}`, children: value })
  ] });
}
export {
  CreateLPOPage as component
};
