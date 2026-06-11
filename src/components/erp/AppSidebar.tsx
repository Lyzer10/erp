import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard, Users, Receipt, Package, Wallet, UserCog, Warehouse,
  Settings, ScanLine, ChevronDown, ChevronsLeft, ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { label: string; to: string };
type Group = { label: string; icon: React.ComponentType<{ className?: string }>; items: Item[] };

const groups: Group[] = [
  { label: "Stakeholders", icon: Users, items: [
    { label: "Customers", to: "/stakeholders/customers" },
    { label: "Suppliers", to: "/stakeholders/suppliers" },
  ]},
  { label: "Sales", icon: Receipt, items: [
    { label: "Invoices", to: "/sales/invoices" },
    { label: "Sales Reports", to: "/sales/reports" },
    { label: "Receipts & Delivery", to: "/sales/receipts" },
    { label: "Customer Statement", to: "/sales/customer-statement" },
    { label: "Inter Branch", to: "/sales/inter-branch" },
  ]},
  { label: "Products & Purchases", icon: Package, items: [
    { label: "Products", to: "/products/catalog" },
    { label: "Purchase Orders", to: "/products/purchase-orders" },
    { label: "Expenses", to: "/products/expenses" },
    { label: "Self Service", to: "/products/self-service" },
  ]},
  { label: "Finance", icon: Wallet, items: [
    { label: "Financial Reports", to: "/finance/reports" },
    { label: "Chart of Accounts", to: "/finance/chart-of-accounts" },
    { label: "Payment Vouchers", to: "/finance/payment-vouchers" },
    { label: "Bank & Cash", to: "/finance/bank-cash" },
    { label: "Reconciliation", to: "/finance/reconciliation" },
    { label: "Ledgers", to: "/finance/ledgers" },
  ]},
  { label: "HR & Payroll", icon: UserCog, items: [
    { label: "Staff", to: "/hr/staff" },
    { label: "Leave", to: "/hr/leave" },
    { label: "Salary", to: "/hr/salary" },
    { label: "Payroll", to: "/hr/payroll" },
  ]},
  { label: "Store", icon: Warehouse, items: [
    { label: "Stock", to: "/store/stock" },
    { label: "Transfers", to: "/store/transfers" },
    { label: "Stores", to: "/store/stores" },
  ]},
  { label: "Admin", icon: Settings, items: [
    { label: "Users", to: "/admin/users" },
    { label: "Settings", to: "/admin/settings" },
  ]},
];

interface Props {
  readonly onNavigate?: () => void;
  readonly collapsed?: boolean;
  readonly onToggle?: () => void;
}

export function AppSidebar({ onNavigate, collapsed = false, onToggle }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const initiallyOpen = (g: Group) => g.items.some((i) => pathname.startsWith(i.to));
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g) => [g.label, initiallyOpen(g)])),
  );

  return (
    <aside
      className={cn(
        "glass-nav fixed inset-y-0 left-0 z-40 hidden flex-col transition-[width] duration-300 lg:flex",
        collapsed ? "w-20" : "w-72",
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex h-16 shrink-0 items-center gap-3 border-b border-white/40",
        collapsed ? "justify-center px-2" : "px-5",
      )}>
        <Link
          to="/"
          onClick={onNavigate}
          className={cn(
            "flex min-w-0 items-center gap-3",
            !collapsed && "flex-1",
          )}
        >
          <img src="/devele-logo.jpg" alt="DeveleICT" className="h-14 w-14 shrink-0 object-contain" style={{ mixBlendMode: "multiply" }} />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-tight tracking-tight">DeveleERP</p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Enterprise Suite</p>
            </div>
          )}
        </Link>
        {!collapsed && onToggle && (
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-white/60 hover:text-foreground"
            aria-label="Collapse sidebar"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {collapsed && onToggle && (
        <button
          onClick={onToggle}
          className="mx-auto mt-3 rounded-lg p-1.5 text-muted-foreground transition hover:bg-white/60 hover:text-foreground"
          aria-label="Expand sidebar"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      )}

      <nav className={cn("flex-1 space-y-0.5 overflow-y-auto py-4", collapsed ? "px-2" : "px-3")}>
        {/* Dashboard */}
        <Link
          to="/"
          onClick={onNavigate}
          title="Dashboard"
          className={cn(
            "flex items-center rounded-xl text-sm font-medium transition",
            collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
            pathname === "/"
              ? "bg-linear-to-r from-blue-500/20 to-emerald-500/10 text-blue-700 shadow-sm"
              : "text-foreground/75 hover:bg-white/50 hover:text-foreground",
          )}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </Link>

        {/* POS — extra top margin to visually separate from Dashboard */}
        <Link
          to="/pos"
          onClick={onNavigate}
          title="Point of Sale"
          style={{ marginTop: "6px" }}
          className={cn(
            "flex items-center rounded-xl text-sm font-medium transition",
            collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
            pathname === "/pos"
              ? "bg-linear-to-r from-emerald-500/25 to-blue-500/10 text-emerald-700 shadow-sm"
              : "bg-linear-to-r from-emerald-500/10 to-transparent text-emerald-700 hover:from-emerald-500/20",
          )}
        >
          <ScanLine className="h-4 w-4 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1">Point of Sale</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">
                New
              </span>
            </>
          )}
        </Link>

        <div className="my-3 h-px bg-linear-to-r from-transparent via-white/60 to-transparent" />

        {groups.map((g) => {
          const Icon = g.icon;
          const isOpen = open[g.label];
          const groupActive = g.items.some((i) => pathname === i.to || pathname.startsWith(i.to + "/"));

          if (collapsed) {
            return (
              <Link
                key={g.label}
                to={g.items[0].to}
                onClick={onNavigate}
                title={g.label}
                className={cn(
                  "flex items-center justify-center rounded-xl p-2.5 text-sm transition",
                  groupActive
                    ? "bg-white/70 text-blue-700 shadow-sm"
                    : "text-foreground/75 hover:bg-white/50",
                )}
              >
                <Icon className="h-4 w-4" />
              </Link>
            );
          }

          return (
            <div key={g.label}>
              <button
                onClick={() => setOpen((s) => ({ ...s, [g.label]: !s[g.label] }))}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/75 transition hover:bg-white/50 hover:text-foreground"
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-left">{g.label}</span>
                <ChevronDown className={cn(
                  "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180",
                )} />
              </button>

              {isOpen && (
                <div className="ml-3 mt-1 space-y-0.5 border-l border-white/50 pl-3 pb-1">
                  {g.items.map((it) => {
                    const active = pathname === it.to || pathname.startsWith(it.to + "/");
                    return (
                      <Link
                        key={it.to}
                        to={it.to}
                        onClick={onNavigate}
                        className={cn(
                          "block rounded-lg px-3 py-1.5 text-sm transition",
                          active
                            ? "bg-white/70 font-medium text-blue-700 shadow-sm"
                            : "text-foreground/65 hover:bg-white/40 hover:text-foreground",
                        )}
                      >
                        {it.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      {!collapsed && (
        <div className="border-t border-white/40 p-4">
          <div className="glass-card flex items-center gap-3 p-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-linear-to-br from-violet-500 to-blue-500 text-sm font-semibold text-white">
              AO
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Aisha Otieno</p>
              <p className="truncate text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
