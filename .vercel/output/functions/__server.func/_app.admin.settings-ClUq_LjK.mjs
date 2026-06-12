import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { T as TabbedPage } from "./_ssr/TabbedPage-DtxV7PSk.mjs";
import { G as GlassCard } from "./_ssr/GlassCard-BC9QkRR6.mjs";
import "./_ssr/utils-H80jjgLf.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
const Field = ({
  label,
  value,
  type = "text"
}) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: label }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, defaultValue: value, className: "mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm backdrop-blur" })
] });
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Settings", description: "System configuration and company information." }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
    key: "config",
    label: "Configurations",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-4 text-base font-semibold", children: "System Preferences" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Default Currency", value: "USD ($)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Fiscal Year Start", value: "January" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Timezone", value: "Africa/Nairobi" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Date Format", value: "YYYY-MM-DD" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tax Rate (%)", value: "16", type: "number" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Invoice Prefix", value: "INV-" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mt-6 rounded-lg bg-linear-to-r from-blue-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-md", children: "Save Changes" })
    ] })
  }, {
    key: "company",
    label: "Company Info",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-4 text-base font-semibold", children: "Company Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Company Name", value: "Lumen Trading Co." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Registration #", value: "C-128937" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "VAT Number", value: "P051234567A" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone", value: "+254 700 123 456" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", value: "info@lumen.co" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Website", value: "https://lumen.co" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm backdrop-blur", rows: 3, defaultValue: "Industrial Area, Nairobi, Kenya" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mt-6 rounded-lg bg-linear-to-r from-blue-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-md", children: "Update Company" })
    ] })
  }] })
] });
export {
  SplitComponent as component
};
