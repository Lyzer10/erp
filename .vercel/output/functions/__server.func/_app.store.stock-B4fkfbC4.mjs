import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { T as TabbedPage } from "./_ssr/TabbedPage-DtxV7PSk.mjs";
import { D as DataTable } from "./_ssr/DataTable-DDCglJ7Y.mjs";
import { G as GlassCard } from "./_ssr/GlassCard-BC9QkRR6.mjs";
import { E as EChart } from "./_ssr/EChart-VxhO2r3D.mjs";
import { E as ExportMenu } from "./_ssr/ExportMenu-CSr9UXhP.mjs";
import { p as products, c as currency } from "./_ssr/mock-CXuNXaWS.mjs";
import "./_ssr/utils-H80jjgLf.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/lucide-react.mjs";
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
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Stock", description: "Stock levels, movements, adjustments, and conversions.", actions: /* @__PURE__ */ jsxRuntimeExports.jsx(ExportMenu, {}) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
    key: "report",
    label: "Stock Report",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: products, columns: [{
      key: "sku",
      header: "SKU"
    }, {
      key: "name",
      header: "Product"
    }, {
      key: "category",
      header: "Category"
    }, {
      key: "stock",
      header: "On Hand",
      align: "right",
      render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: r.stock < r.reorder ? "font-medium text-rose-600" : "", children: r.stock })
    }, {
      key: "reorder",
      header: "Reorder",
      align: "right"
    }, {
      key: "price",
      header: "Value",
      align: "right",
      render: (r) => currency(r.price * r.stock)
    }] })
  }, {
    key: "movement",
    label: "Movement",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(EChart, { height: 320, option: {
      legend: {
        data: ["In", "Out"]
      },
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      },
      yAxis: {
        type: "value"
      },
      series: [{
        name: "In",
        type: "bar",
        data: [120, 180, 90, 220, 160, 80, 50],
        itemStyle: {
          borderRadius: [6, 6, 0, 0]
        },
        barWidth: 18
      }, {
        name: "Out",
        type: "bar",
        data: [90, 110, 150, 180, 200, 60, 30],
        itemStyle: {
          borderRadius: [6, 6, 0, 0]
        },
        barWidth: 18
      }]
    } }) })
  }, {
    key: "by-product",
    label: "By Product",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: products.slice(0, 12).map((p) => ({
      ...p,
      in: 120 + p.stock % 50,
      out: 80 + p.stock % 40
    })), columns: [{
      key: "sku",
      header: "SKU"
    }, {
      key: "name",
      header: "Product"
    }, {
      key: "in",
      header: "In",
      align: "right"
    }, {
      key: "out",
      header: "Out",
      align: "right"
    }, {
      key: "stock",
      header: "Balance",
      align: "right"
    }] })
  }, {
    key: "adjust",
    label: "Adjust Stock",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: products.slice(0, 8).map((p, i) => ({
      id: `ADJ-${100 + i}`,
      sku: p.sku,
      product: p.name,
      reason: ["Damaged", "Lost", "Found", "Count diff"][i % 4],
      qty: i % 2 ? 5 : -3
    })), columns: [{
      key: "id",
      header: "Adj #"
    }, {
      key: "sku",
      header: "SKU"
    }, {
      key: "product",
      header: "Product"
    }, {
      key: "reason",
      header: "Reason"
    }, {
      key: "qty",
      header: "Qty",
      align: "right",
      render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: r.qty < 0 ? "text-rose-600" : "text-emerald-600", children: [
        r.qty > 0 ? "+" : "",
        r.qty
      ] })
    }] })
  }, {
    key: "convert",
    label: "Convert",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: [{
      from: "Sugar 50kg Bag",
      to: "Sugar 2kg Pack",
      ratio: "1:25"
    }, {
      from: "Cooking Oil 20L",
      to: "Cooking Oil 5L",
      ratio: "1:4"
    }, {
      from: "Coffee 25kg",
      to: "Coffee 1kg",
      ratio: "1:25"
    }], columns: [{
      key: "from",
      header: "From"
    }, {
      key: "to",
      header: "To"
    }, {
      key: "ratio",
      header: "Ratio"
    }] })
  }, {
    key: "import",
    label: "Import Stock",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Upload a stock import file to bulk update inventory." }) })
  }] })
] });
export {
  SplitComponent as component
};
