import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { T as TabbedPage } from "./_ssr/TabbedPage-DtxV7PSk.mjs";
import { D as DataTable } from "./_ssr/DataTable-DDCglJ7Y.mjs";
import { E as ExportMenu } from "./_ssr/ExportMenu-CSr9UXhP.mjs";
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
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Stores & Conversions", description: "Physical store locations and conversion formulas.", actions: /* @__PURE__ */ jsxRuntimeExports.jsx(ExportMenu, {}) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
    key: "stores",
    label: "Stores",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: [{
      code: "ST-01",
      name: "Main Warehouse",
      location: "Industrial Area",
      manager: "John Mwangi",
      items: 1240
    }, {
      code: "ST-02",
      name: "Westlands Store",
      location: "Westlands",
      manager: "Maria Banda",
      items: 580
    }, {
      code: "ST-03",
      name: "Mombasa Outlet",
      location: "Mombasa",
      manager: "David Kumar",
      items: 412
    }, {
      code: "ST-04",
      name: "Kisumu Depot",
      location: "Kisumu",
      manager: "Grace Mensah",
      items: 298
    }], columns: [{
      key: "code",
      header: "Code"
    }, {
      key: "name",
      header: "Store"
    }, {
      key: "location",
      header: "Location"
    }, {
      key: "manager",
      header: "Manager"
    }, {
      key: "items",
      header: "Items",
      align: "right"
    }] })
  }, {
    key: "conversions",
    label: "Conversion Formulas",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: [{
      code: "CF-01",
      from: "Sugar 50kg Bag",
      to: "Sugar 2kg Pack",
      ratio: "1 : 25"
    }, {
      code: "CF-02",
      from: "Cooking Oil 20L",
      to: "Cooking Oil 5L",
      ratio: "1 : 4"
    }, {
      code: "CF-03",
      from: "Coffee 25kg",
      to: "Coffee 1kg",
      ratio: "1 : 25"
    }, {
      code: "CF-04",
      from: "Detergent 100L",
      to: "Detergent 1L",
      ratio: "1 : 100"
    }], columns: [{
      key: "code",
      header: "Code"
    }, {
      key: "from",
      header: "From"
    }, {
      key: "to",
      header: "To"
    }, {
      key: "ratio",
      header: "Ratio"
    }] })
  }] })
] });
export {
  SplitComponent as component
};
