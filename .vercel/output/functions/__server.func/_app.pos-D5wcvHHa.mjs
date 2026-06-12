import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useRouter } from "./_libs/tanstack__react-router.mjs";
import { f as ScanLine, k as ShoppingCart, x as CreditCard, y as Sparkles } from "./_libs/lucide-react.mjs";
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
function PosPage() {
  const router = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[70vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel relative max-w-2xl overflow-hidden rounded-3xl p-12 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-12 -top-12 h-48 w-48 rounded-full bg-linear-to-br from-emerald-400/40 to-transparent blur-2xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-linear-to-br from-blue-400/40 to-transparent blur-2xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-linear-to-br from-blue-500 to-emerald-500 text-white shadow-2xl shadow-emerald-500/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-10 w-10" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 text-3xl font-bold tracking-tight", children: "Point of Sale" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "A fast, touch-friendly POS terminal is on the way. Scan, ring up, and accept payments — all from one clean screen." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "mx-auto h-6 w-6 text-blue-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs font-medium", children: "Quick Checkout" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "mx-auto h-6 w-6 text-emerald-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs font-medium", children: "Multi-payment" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mx-auto h-6 w-6 text-violet-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs font-medium", children: "Offline Mode" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => router.history.back(), className: "mt-8 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30", children: "Back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-xs text-muted-foreground", children: "Coming soon" })
    ] })
  ] }) });
}
export {
  PosPage as component
};
