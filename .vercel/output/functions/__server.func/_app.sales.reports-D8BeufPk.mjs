import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { T as TabbedPage } from "./_ssr/TabbedPage-DtxV7PSk.mjs";
import { G as GlassCard } from "./_ssr/GlassCard-BC9QkRR6.mjs";
import { E as EChart } from "./_ssr/EChart-VxhO2r3D.mjs";
import { D as DataTable } from "./_ssr/DataTable-DDCglJ7Y.mjs";
import { E as ExportMenu } from "./_ssr/ExportMenu-CSr9UXhP.mjs";
import { c as currency, a as customers, p as products } from "./_ssr/mock-CXuNXaWS.mjs";
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
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Sales Reports", description: "Analyze revenue across customers, products, and categories.", actions: /* @__PURE__ */ jsxRuntimeExports.jsx(ExportMenu, {}) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
    key: "summary",
    label: "Summary",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(EChart, { height: 380, option: {
      legend: {
        data: ["Gross", "Discount", "Net"]
      },
      xAxis: {
        type: "category",
        data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      },
      yAxis: {
        type: "value"
      },
      series: [{
        name: "Gross",
        type: "bar",
        data: [52e3, 58e3, 61e3, 56e3, 67e3, 72e3],
        itemStyle: {
          borderRadius: [6, 6, 0, 0]
        },
        barWidth: 14
      }, {
        name: "Discount",
        type: "bar",
        data: [3200, 3800, 4100, 3500, 4400, 4800],
        itemStyle: {
          borderRadius: [6, 6, 0, 0]
        },
        barWidth: 14
      }, {
        name: "Net",
        type: "bar",
        data: [48800, 54200, 56900, 52500, 62600, 67200],
        itemStyle: {
          borderRadius: [6, 6, 0, 0]
        },
        barWidth: 14
      }]
    } }) })
  }, {
    key: "detailed",
    label: "Detailed",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: customers.slice(0, 15).map((c, i) => ({
      id: c.id,
      customer: c.name,
      invoices: 4 + i,
      units: 22 + i * 3,
      gross: 5400 + i * 320,
      net: 4900 + i * 290
    })), columns: [{
      key: "id",
      header: "ID"
    }, {
      key: "customer",
      header: "Customer"
    }, {
      key: "invoices",
      header: "Invoices",
      align: "right"
    }, {
      key: "units",
      header: "Units",
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
    }] })
  }, {
    key: "by-customer",
    label: "By Customer",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(EChart, { height: 380, option: {
      grid: {
        left: 160
      },
      xAxis: {
        type: "value"
      },
      yAxis: {
        type: "category",
        data: customers.slice(0, 8).map((c) => c.name)
      },
      series: [{
        type: "bar",
        data: customers.slice(0, 8).map(() => Math.round(Math.random() * 8e4 + 1e4)),
        itemStyle: {
          borderRadius: [0, 8, 8, 0],
          color: "#3b82f6"
        },
        barWidth: 14
      }]
    } }) })
  }, {
    key: "by-product",
    label: "By Product",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: products.slice(0, 12).map((p) => ({
      id: p.id,
      name: p.name,
      qty: Math.floor(Math.random() * 200),
      revenue: Math.round(Math.random() * 4e4)
    })), columns: [{
      key: "id",
      header: "Code"
    }, {
      key: "name",
      header: "Product"
    }, {
      key: "qty",
      header: "Qty Sold",
      align: "right"
    }, {
      key: "revenue",
      header: "Revenue",
      align: "right",
      render: (r) => currency(r.revenue)
    }] })
  }, {
    key: "by-category",
    label: "By Category",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(EChart, { height: 380, option: {
      tooltip: {
        trigger: "item"
      },
      series: [{
        type: "pie",
        radius: ["45%", "75%"],
        padAngle: 3,
        itemStyle: {
          borderRadius: 8
        },
        data: [{
          value: 42e3,
          name: "Beverages"
        }, {
          value: 28e3,
          name: "Groceries"
        }, {
          value: 18e3,
          name: "Electronics"
        }, {
          value: 12e3,
          name: "Stationery"
        }, {
          value: 9e3,
          name: "Household"
        }]
      }]
    } }) })
  }, {
    key: "collection",
    label: "Collection",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(EChart, { height: 380, option: {
      legend: {
        data: ["Billed", "Collected"]
      },
      xAxis: {
        type: "category",
        data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      },
      yAxis: {
        type: "value"
      },
      series: [{
        name: "Billed",
        type: "line",
        smooth: true,
        data: [48e3, 52e3, 56e3, 61e3, 65e3, 72e3],
        lineStyle: {
          width: 3
        }
      }, {
        name: "Collected",
        type: "line",
        smooth: true,
        data: [42e3, 47e3, 51e3, 55e3, 6e4, 66e3],
        lineStyle: {
          width: 3
        },
        areaStyle: {}
      }]
    } }) })
  }] })
] });
export {
  SplitComponent as component
};
