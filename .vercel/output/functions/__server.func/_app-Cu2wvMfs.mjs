import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { d as useNavigate, O as Outlet, e as useRouterState, L as Link } from "./_libs/tanstack__react-router.mjs";
import { c as cn } from "./_ssr/utils-H80jjgLf.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuItem, d as DropdownMenuSeparator } from "./_ssr/dropdown-menu-C3foCxkR.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./_ssr/dialog-B5irAUYM.mjs";
import { X, b as Users, R as Receipt, P as Package, W as Wallet, c as UserCog, d as Warehouse, S as Settings, C as ChevronsLeft, e as ChevronsRight, L as LayoutDashboard, f as ScanLine, g as ChevronDown, M as Menu, h as Plus, B as Bell, i as User, j as LogOut } from "./_libs/lucide-react.mjs";
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
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-dropdown-menu.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
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
import "./_libs/radix-ui__react-dialog.mjs";
const groups = [
  { label: "Stakeholders", icon: Users, items: [
    { label: "Customers", to: "/stakeholders/customers" },
    { label: "Suppliers", to: "/stakeholders/suppliers" }
  ] },
  { label: "Sales", icon: Receipt, items: [
    { label: "Invoices", to: "/sales/invoices" },
    { label: "Sales Reports", to: "/sales/reports" },
    { label: "Receipts & Delivery", to: "/sales/receipts" },
    { label: "Customer Statement", to: "/sales/customer-statement" },
    { label: "Inter Branch", to: "/sales/inter-branch" }
  ] },
  { label: "Products & Purchases", icon: Package, items: [
    { label: "Products", to: "/products/catalog" },
    { label: "Purchase Orders", to: "/products/purchase-orders" },
    { label: "Expenses", to: "/products/expenses" },
    { label: "Self Service", to: "/products/self-service" }
  ] },
  { label: "Finance", icon: Wallet, items: [
    { label: "Financial Reports", to: "/finance/reports" },
    { label: "Chart of Accounts", to: "/finance/chart-of-accounts" },
    { label: "Payment Vouchers", to: "/finance/payment-vouchers" },
    { label: "Bank & Cash", to: "/finance/bank-cash" },
    { label: "Reconciliation", to: "/finance/reconciliation" },
    { label: "Ledgers", to: "/finance/ledgers" }
  ] },
  { label: "HR & Payroll", icon: UserCog, items: [
    { label: "Staff", to: "/hr/staff" },
    { label: "Leave", to: "/hr/leave" },
    { label: "Salary", to: "/hr/salary" },
    { label: "Payroll", to: "/hr/payroll" }
  ] },
  { label: "Store", icon: Warehouse, items: [
    { label: "Stock", to: "/store/stock" },
    { label: "Transfers", to: "/store/transfers" },
    { label: "Stores", to: "/store/stores" }
  ] },
  { label: "Admin", icon: Settings, items: [
    { label: "Users", to: "/admin/users" },
    { label: "Settings", to: "/admin/settings" }
  ] }
];
function AppSidebar({ onNavigate, collapsed = false, onToggle }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const initiallyOpen = (g) => g.items.some((i) => pathname.startsWith(i.to));
  const [open, setOpen] = reactExports.useState(
    () => Object.fromEntries(groups.map((g) => [g.label, initiallyOpen(g)]))
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "aside",
    {
      className: cn(
        "glass-nav fixed inset-y-0 left-0 z-40 hidden flex-col transition-[width] duration-300 lg:flex",
        collapsed ? "w-20" : "w-72"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
          "flex h-16 shrink-0 items-center gap-3 border-b border-white/40",
          collapsed ? "justify-center px-2" : "px-5"
        ), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/",
              onClick: onNavigate,
              className: cn(
                "flex min-w-0 items-center gap-3",
                !collapsed && "flex-1"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/devele-logo.png", alt: "DeveleICT", className: "h-14 w-14 shrink-0 object-contain" }),
                !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold leading-tight tracking-tight", children: "DeveleERP" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-medium uppercase tracking-widest text-muted-foreground", children: "Enterprise Suite" })
                ] })
              ]
            }
          ),
          !collapsed && onToggle && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onToggle,
              className: "rounded-lg p-1.5 text-muted-foreground transition hover:bg-white/60 hover:text-foreground",
              "aria-label": "Collapse sidebar",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsLeft, { className: "h-4 w-4" })
            }
          )
        ] }),
        collapsed && onToggle && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onToggle,
            className: "mx-auto mt-3 rounded-lg p-1.5 text-muted-foreground transition hover:bg-white/60 hover:text-foreground",
            "aria-label": "Expand sidebar",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsRight, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: cn("flex-1 space-y-0.5 overflow-y-auto py-4", collapsed ? "px-2" : "px-3"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/",
              onClick: onNavigate,
              title: "Dashboard",
              className: cn(
                "flex items-center rounded-xl text-sm font-medium transition",
                collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                pathname === "/" ? "bg-linear-to-r from-blue-500/20 to-emerald-500/10 text-blue-700 shadow-sm" : "text-foreground/75 hover:bg-white/50 hover:text-foreground"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "h-4 w-4 shrink-0" }),
                !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Dashboard" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/pos",
              onClick: onNavigate,
              title: "Point of Sale",
              style: { marginTop: "14px" },
              className: cn(
                "flex items-center rounded-xl text-sm font-medium transition",
                collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                pathname === "/pos" ? "bg-linear-to-r from-emerald-500/25 to-blue-500/10 text-emerald-700 shadow-sm" : "bg-linear-to-r from-emerald-500/10 to-transparent text-emerald-700 hover:from-emerald-500/20"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-4 w-4 shrink-0" }),
                !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: "Point of Sale" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700", children: "New" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-3 h-px bg-linear-to-r from-transparent via-white/60 to-transparent" }),
          groups.map((g) => {
            const Icon = g.icon;
            const isOpen = open[g.label];
            const groupActive = g.items.some((i) => pathname === i.to || pathname.startsWith(i.to + "/"));
            if (collapsed) {
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: g.items[0].to,
                  onClick: onNavigate,
                  title: g.label,
                  className: cn(
                    "flex items-center justify-center rounded-xl p-2.5 text-sm transition",
                    groupActive ? "bg-white/70 text-blue-700 shadow-sm" : "text-foreground/75 hover:bg-white/50"
                  ),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" })
                },
                g.label
              );
            }
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setOpen((s) => ({ ...s, [g.label]: !s[g.label] })),
                  className: "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/75 transition hover:bg-white/50 hover:text-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-left", children: g.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: cn(
                      "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180"
                    ) })
                  ]
                }
              ),
              isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-3 mt-1 space-y-0.5 border-l border-white/50 pl-3 pb-1", children: g.items.map((it) => {
                const active = pathname === it.to || pathname.startsWith(it.to + "/");
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: it.to,
                    onClick: onNavigate,
                    className: cn(
                      "block rounded-lg px-3 py-1.5 text-sm transition",
                      active ? "bg-white/70 font-medium text-blue-700 shadow-sm" : "text-foreground/65 hover:bg-white/40 hover:text-foreground"
                    ),
                    children: it.label
                  },
                  it.to
                );
              }) })
            ] }, g.label);
          })
        ] }),
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-white/40 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card flex items-center gap-3 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-linear-to-br from-violet-500 to-blue-500 text-sm font-semibold text-white", children: "AO" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold", children: "Aisha Otieno" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-muted-foreground", children: "Administrator" })
          ] })
        ] }) })
      ]
    }
  );
}
const DUMMY_USER = {
  name: "Aisha Otieno",
  initials: "AO",
  role: "System Administrator",
  email: "aisha.otieno@devele.co",
  department: "IT",
  branch: "Head Office",
  joined: "Jan 2024"
};
function useNow() {
  const [now, setNow] = reactExports.useState(() => /* @__PURE__ */ new Date());
  reactExports.useEffect(() => {
    const t = setInterval(() => setNow(/* @__PURE__ */ new Date()), 6e4);
    return () => clearInterval(t);
  }, []);
  return now;
}
function Topbar({ onMenuClick, onToggleSidebar }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const now = useNow();
  const [profileOpen, setProfileOpen] = reactExports.useState(false);
  const dateLabel = now.toLocaleDateString(void 0, { weekday: "short", day: "2-digit", month: "short" });
  const timeLabel = now.toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
  function handleLogout() {
    document.cookie = "is_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    navigate({ to: "/login" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "glass-topbar sticky top-0 z-30 flex h-16 items-center gap-2 px-3 lg:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onMenuClick,
        className: "rounded-lg p-2 text-muted-foreground transition hover:bg-white/50 hover:text-foreground lg:hidden",
        "aria-label": "Open menu",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden items-center gap-2 md:flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/sales/invoices/new",
          className: "inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            " Invoice"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/sales/invoices/proforma",
          className: "inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            " Proforma"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/products/purchase-orders",
          className: "inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            " Purchase Order"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/products/self-service",
          className: "inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            " Payment Request"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 truncate text-xs font-medium capitalize text-muted-foreground md:hidden", children: pathname === "/" ? "Dashboard" : pathname.split("/").filter(Boolean).join(" / ").replaceAll("-", " ") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden items-center text-right gap-2 md:flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: dateLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: timeLabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/pos",
          className: "group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-emerald-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Open POS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "relative rounded-xl border border-white/60 bg-white/50 p-2 backdrop-blur-md transition hover:bg-white/70",
          "aria-label": "Notifications",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-2 rounded-xl border border-white/60 bg-white/50 pl-1 pr-2 py-1 backdrop-blur-md transition hover:bg-white/70 focus:outline-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-7 w-7 place-items-center rounded-full bg-linear-to-br from-violet-500 to-blue-500 text-xs font-semibold text-white", children: DUMMY_USER.initials }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden text-xs font-medium text-slate-700 sm:block", children: DUMMY_USER.name.split(" ")[0] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 text-slate-400" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-64 p-0 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-linear-to-br from-blue-50 to-violet-50 px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-violet-500 to-blue-500 text-sm font-bold text-white shadow-md", children: DUMMY_USER.initials }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold text-slate-900", children: DUMMY_USER.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-slate-500", children: DUMMY_USER.email })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex gap-3 text-[11px] text-slate-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md bg-white/70 px-2 py-0.5 font-medium", children: DUMMY_USER.role }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md bg-white/70 px-2 py-0.5 font-medium", children: DUMMY_USER.branch })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DropdownMenuItem,
              {
                className: "gap-2 cursor-pointer rounded-lg px-3 py-2",
                onSelect: () => setProfileOpen(true),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-slate-400" }),
                  " View Profile"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { asChild: true, className: "gap-2 cursor-pointer rounded-lg px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/settings", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4 text-slate-400" }),
              " Settings"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DropdownMenuItem,
              {
                className: "gap-2 cursor-pointer rounded-lg px-3 py-2 text-rose-600 focus:text-rose-600",
                onSelect: handleLogout,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
                  " Log Out"
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: profileOpen, onOpenChange: setProfileOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "My Profile" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-violet-500 to-blue-500 text-xl font-bold text-white shadow-lg", children: DUMMY_USER.initials }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-slate-900", children: DUMMY_USER.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: DUMMY_USER.role })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 rounded-xl bg-slate-50 p-4 text-sm", children: [
          { label: "Email", value: DUMMY_USER.email },
          { label: "Department", value: DUMMY_USER.department },
          { label: "Branch", value: DUMMY_USER.branch },
          { label: "Joined", value: DUMMY_USER.joined }
        ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-700", children: value })
        ] }, label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleLogout,
            className: "w-full rounded-xl border border-rose-200 bg-rose-50 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100",
            children: "Log Out"
          }
        )
      ] })
    ] }) })
  ] });
}
function AppShell() {
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const [collapsed, setCollapsed] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, { collapsed, onToggle: () => setCollapsed((c) => !c) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("fixed inset-0 z-50 lg:hidden", mobileOpen ? "pointer-events-auto" : "pointer-events-none"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: cn(
            "absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          ),
          onClick: () => setMobileOpen(false)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
        "absolute inset-y-0 left-0 w-72 transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      ), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setMobileOpen(false),
            className: "absolute right-3 top-3 z-10 rounded-lg bg-white/80 p-1.5 text-slate-600 shadow-sm backdrop-blur transition hover:bg-white",
            "aria-label": "Close menu",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-nav h-full lg:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MobileSidebar, { onNavigate: () => setMobileOpen(false) }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("transition-[padding] duration-300", collapsed ? "lg:pl-20" : "lg:pl-72"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { onMenuClick: () => setMobileOpen(true), onToggleSidebar: () => setCollapsed((c) => !c) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "p-4 lg:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-slate-100 px-4 py-4 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
        "Copyright © 2026",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-blue-600", children: "DeveleERP Accounting Software." }),
        " ",
        "All rights reserved."
      ] }) })
    ] })
  ] });
}
function MobileSidebar({ onNavigate }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "[&>aside]:static [&>aside]:flex [&>aside]:h-full [&>aside]:w-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, { onNavigate, collapsed: false }) });
}
function AppShellWrapper() {
  const navigate = useNavigate();
  const [checking, setChecking] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const isLoggedIn = document.cookie.split("; ").some((item) => item.trim().startsWith("is_logged_in=true"));
    if (!isLoggedIn) {
      navigate({
        to: "/login",
        replace: true
      });
    } else {
      setChecking(false);
    }
  }, [navigate]);
  if (checking) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none fixed inset-0 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto h-12 w-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full border-4 border-slate-100" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-semibold tracking-wide text-slate-600 uppercase", children: "Verifying Session" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-slate-400", children: "Please wait while we secure your connection..." })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, {});
}
export {
  Outlet,
  AppShellWrapper as component
};
