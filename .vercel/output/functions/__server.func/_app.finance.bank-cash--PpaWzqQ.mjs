import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { T as TabbedPage } from "./_ssr/TabbedPage-DtxV7PSk.mjs";
import { D as DataTable } from "./_ssr/DataTable-DDCglJ7Y.mjs";
import { E as ExportMenu } from "./_ssr/ExportMenu-CSr9UXhP.mjs";
import { c as currency } from "./_ssr/mock-CXuNXaWS.mjs";
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
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Bank & Cash", description: "Bank accounts, cash accounts, banks, and branches.", actions: /* @__PURE__ */ jsxRuntimeExports.jsx(ExportMenu, {}) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
    key: "bank",
    label: "Bank Accounts",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: [{
      id: "BA-01",
      bank: "KCB",
      branch: "Nairobi CBD",
      account: "1234567890",
      balance: 86320
    }, {
      id: "BA-02",
      bank: "Equity",
      branch: "Westlands",
      account: "0998877665",
      balance: 42810
    }, {
      id: "BA-03",
      bank: "NCBA",
      branch: "Mombasa",
      account: "5544332211",
      balance: 18420
    }], columns: [{
      key: "id",
      header: "ID"
    }, {
      key: "bank",
      header: "Bank"
    }, {
      key: "branch",
      header: "Branch"
    }, {
      key: "account",
      header: "Account #"
    }, {
      key: "balance",
      header: "Balance",
      align: "right",
      render: (r) => currency(r.balance)
    }] })
  }, {
    key: "cash",
    label: "Cash Account",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: [{
      id: "CA-01",
      name: "Main Till",
      custodian: "Aisha Otieno",
      balance: 12420
    }, {
      id: "CA-02",
      name: "Petty Cash",
      custodian: "John Mwangi",
      balance: 1850
    }], columns: [{
      key: "id",
      header: "ID"
    }, {
      key: "name",
      header: "Account"
    }, {
      key: "custodian",
      header: "Custodian"
    }, {
      key: "balance",
      header: "Balance",
      align: "right",
      render: (r) => currency(r.balance)
    }] })
  }, {
    key: "banks",
    label: "Banks",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: ["KCB", "Equity", "NCBA", "Co-operative", "Stanbic"].map((b, i) => ({
      code: `BK-${10 + i}`,
      name: b,
      branches: 3 + i
    })), columns: [{
      key: "code",
      header: "Code"
    }, {
      key: "name",
      header: "Bank"
    }, {
      key: "branches",
      header: "Branches",
      align: "right"
    }] })
  }, {
    key: "branches",
    label: "Bank Branches",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: ["CBD", "Westlands", "Mombasa", "Kisumu", "Eldoret"].map((b, i) => ({
      code: `BR-${20 + i}`,
      bank: "KCB",
      name: b,
      swift: `KCBLKE${i}1`
    })), columns: [{
      key: "code",
      header: "Code"
    }, {
      key: "bank",
      header: "Bank"
    }, {
      key: "name",
      header: "Branch"
    }, {
      key: "swift",
      header: "SWIFT"
    }] })
  }] })
] });
export {
  SplitComponent as component
};
