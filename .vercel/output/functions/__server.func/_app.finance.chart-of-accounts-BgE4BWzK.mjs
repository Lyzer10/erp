import { j as jsxRuntimeExports, r as reactExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { G as GlassCard } from "./_ssr/GlassCard-BC9QkRR6.mjs";
import { c as cn } from "./_ssr/utils-H80jjgLf.mjs";
import { V as ChevronRight } from "./_libs/lucide-react.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
const tree = [{
  code: "1000",
  name: "Assets",
  children: [{
    code: "1100",
    name: "Current Assets",
    children: [{
      code: "1110",
      name: "Cash"
    }, {
      code: "1120",
      name: "Bank Accounts"
    }, {
      code: "1130",
      name: "Accounts Receivable"
    }, {
      code: "1140",
      name: "Inventory"
    }]
  }, {
    code: "1200",
    name: "Fixed Assets",
    children: [{
      code: "1210",
      name: "Equipment"
    }, {
      code: "1220",
      name: "Vehicles"
    }]
  }]
}, {
  code: "2000",
  name: "Liabilities",
  children: [{
    code: "2100",
    name: "Accounts Payable"
  }, {
    code: "2200",
    name: "Loans"
  }]
}, {
  code: "3000",
  name: "Equity",
  children: [{
    code: "3100",
    name: "Capital"
  }, {
    code: "3200",
    name: "Retained Earnings"
  }]
}, {
  code: "4000",
  name: "Revenue",
  children: [{
    code: "4100",
    name: "Sales"
  }, {
    code: "4200",
    name: "Service Income"
  }]
}, {
  code: "5000",
  name: "Expenses",
  children: [{
    code: "5100",
    name: "COGS"
  }, {
    code: "5200",
    name: "Salaries"
  }, {
    code: "5300",
    name: "Rent"
  }, {
    code: "5400",
    name: "Utilities"
  }]
}];
function TreeNode({
  node,
  depth = 0
}) {
  const [open, setOpen] = reactExports.useState(depth < 1);
  const hasChildren = !!node.children?.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen((v) => !v), disabled: !hasChildren, className: "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition hover:bg-white/50", style: {
      paddingLeft: 8 + depth * 18
    }, children: [
      hasChildren ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: cn("h-3.5 w-3.5 text-muted-foreground transition", open && "rotate-90") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3.5 w-3.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: node.code }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: node.name })
    ] }),
    hasChildren && open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: node.children.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(TreeNode, { node: c, depth: depth + 1 }, c.code)) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Chart of Accounts", description: "Hierarchical structure of all financial accounts." }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: tree.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(TreeNode, { node: n }, n.code)) })
] });
export {
  SplitComponent as component
};
