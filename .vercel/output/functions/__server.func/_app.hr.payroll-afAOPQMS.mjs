import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { T as TabbedPage } from "./_ssr/TabbedPage-DtxV7PSk.mjs";
import { D as DataTable } from "./_ssr/DataTable-DDCglJ7Y.mjs";
import { S as StatusPill } from "./_ssr/StatusPill-czaQIIwM.mjs";
import { E as ExportMenu } from "./_ssr/ExportMenu-CSr9UXhP.mjs";
import { b as payrollRuns, c as currency } from "./_ssr/mock-CXuNXaWS.mjs";
import { O as Play } from "./_libs/lucide-react.mjs";
import "./_ssr/utils-H80jjgLf.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_ssr/dropdown-menu-C3foCxkR.mjs";
import "./_libs/radix-ui__react-dropdown-menu.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-menu.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-roving-focus.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "tslib";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
const num = (n) => new Intl.NumberFormat("en-US").format(n);
const previewRows = [{
  name: "John Mwamba",
  basic: 8e5,
  allowance: 15e4,
  gross: 95e4,
  nssf: 6e4,
  taxable: 89e4,
  paye: 12e4,
  wcf: 9500,
  nhif: 3e4,
  sdl: 14250,
  heslb: 0,
  saccoss: 0,
  social: 0,
  advance: 5e4,
  loan: 0,
  loss: 0,
  other: 0,
  totalDed: 283750,
  net: 666250
}, {
  name: "Fatuma Ally",
  basic: 65e4,
  allowance: 1e5,
  gross: 75e4,
  nssf: 45e3,
  taxable: 705e3,
  paye: 85e3,
  wcf: 7500,
  nhif: 22500,
  sdl: 11250,
  heslb: 0,
  saccoss: 0,
  social: 0,
  advance: 3e4,
  loan: 0,
  loss: 0,
  other: 0,
  totalDed: 201250,
  net: 548750
}, {
  name: "Peter Nkosi",
  basic: 12e5,
  allowance: 25e4,
  gross: 145e4,
  nssf: 1e5,
  taxable: 135e4,
  paye: 28e4,
  wcf: 14500,
  nhif: 45e3,
  sdl: 21750,
  heslb: 0,
  saccoss: 0,
  social: 0,
  advance: 8e4,
  loan: 0,
  loss: 0,
  other: 0,
  totalDed: 541250,
  net: 908750
}];
const totalsRow = previewRows.reduce((acc, r) => {
  Object.keys(r).forEach((k) => {
    if (k !== "name") acc[k] = (acc[k] || 0) + r[k];
  });
  return acc;
}, {
  name: "Totals"
});
const PAYROLL_COLS = [{
  key: "sn",
  label: "S/N",
  width: "48px"
}, {
  key: "name",
  label: "Employee Name",
  width: "160px",
  sticky: true
}, {
  key: "basic",
  label: "Basic Salary"
}, {
  key: "allowance",
  label: "Allowance"
}, {
  key: "gross",
  label: "Gross Salary"
}, {
  key: "nssf",
  label: "NSSF"
}, {
  key: "taxable",
  label: "Taxable Income"
}, {
  key: "paye",
  label: "PAYE Tax"
}, {
  key: "wcf",
  label: "WCF"
}, {
  key: "nhif",
  label: "NHIF"
}, {
  key: "sdl",
  label: "SDL"
}, {
  key: "heslb",
  label: "HESLB"
}, {
  key: "saccoss",
  label: "SACCOSS"
}, {
  key: "social",
  label: "Social"
}, {
  key: "advance",
  label: "Salary Advance"
}, {
  key: "loan",
  label: "Loan"
}, {
  key: "loss",
  label: "Loss"
}, {
  key: "other",
  label: "Other Deductions"
}, {
  key: "totalDed",
  label: "Total Deductions"
}, {
  key: "net",
  label: "Net Pay"
}];
function PrepareTab() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "All amounts in TZS" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card overflow-hidden p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-teal-600 text-xs uppercase tracking-wide text-white", children: PAYROLL_COLS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: {
        width: c.width,
        minWidth: c.width
      }, className: `whitespace-nowrap px-3 py-3 text-left font-semibold ${c.sticky ? "sticky left-0 z-10 bg-teal-600" : ""}`, children: c.label }, c.key)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        previewRows.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-slate-100 hover:bg-slate-50/60", children: PAYROLL_COLS.map((c) => {
          const isSn = c.key === "sn";
          const isName = c.key === "name";
          const val = isSn ? i + 1 : r[c.key];
          return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `whitespace-nowrap px-3 py-2.5 ${isName ? "sticky left-0 z-10 bg-white font-medium" : ""} ${isSn ? "text-slate-500" : ""} ${!isSn && !isName ? "text-right tabular-nums" : ""}`, children: isSn || isName ? val : num(val) }, c.key);
        }) }, r.name)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-slate-100 font-bold", children: PAYROLL_COLS.map((c) => {
          const isSn = c.key === "sn";
          const isName = c.key === "name";
          const val = isSn ? "" : totalsRow[c.key];
          return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `whitespace-nowrap px-3 py-3 ${isName ? "sticky left-0 z-10 bg-slate-100" : ""} ${!isSn && !isName ? "text-right tabular-nums" : ""}`, children: isSn ? "" : isName ? "Totals" : num(val) }, c.key);
        }) })
      ] })
    ] }) }) })
  ] });
}
function PayrollPage() {
  const cols = [{
    key: "id",
    header: "Run #"
  }, {
    key: "period",
    header: "Period"
  }, {
    key: "employees",
    header: "Employees",
    align: "right"
  }, {
    key: "gross",
    header: "Gross",
    align: "right",
    render: (r) => currency(r.gross)
  }, {
    key: "net",
    header: "Net",
    align: "right",
    render: (r) => currency(r.net)
  }, {
    key: "status",
    header: "Status",
    render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: r.status })
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Payroll Management", description: "Prepare, approve, and complete payroll cycles.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExportMenu, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4" }),
        " Run Payroll"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
      key: "prepare",
      label: "Prepare",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(PrepareTab, {})
    }, {
      key: "approved",
      label: "Approved",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: payrollRuns.filter((p) => p.status === "Approved"), columns: cols })
    }, {
      key: "completed",
      label: "Completed",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: payrollRuns.filter((p) => p.status === "Completed"), columns: cols })
    }, {
      key: "rejected",
      label: "Rejected",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: payrollRuns.filter((p) => p.status === "Rejected"), columns: cols })
    }] })
  ] });
}
export {
  PayrollPage as component
};
