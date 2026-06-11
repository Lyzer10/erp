import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard, Users, Receipt, Package, Wallet, UserCog, Warehouse,
  Settings, ScanLine, ChevronDown, Sparkles,
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

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const initiallyOpen = (g: Group) => g.items.some((i) => pathname.startsWith(i.to));
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g) => [g.label, initiallyOpen(g) || g.label === "Sales"])),
  );

  return (
    <aside className="glass-nav fixed inset-y-0 left-0 z-40 hidden w-72 flex-col lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-white/40 px-5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 text-white shadow-lg">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight">Lumen ERP</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Enterprise Suite</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <Link to="/" onClick={onNavigate} className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
          pathname === "/" ? "bg-gradient-to-r from-blue-500/20 to-emerald-500/10 text-blue-700 shadow-sm"
            : "text-foreground/80 hover:bg-white/50"
        )}>
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        <Link to="/pos" onClick={onNavigate} className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
          pathname === "/pos" ? "bg-gradient-to-r from-emerald-500/25 to-blue-500/10 text-emerald-700 shadow-sm"
            : "bg-gradient-to-r from-emerald-500/10 to-transparent text-emerald-700 hover:from-emerald-500/20"
        )}>
          <ScanLine className="h-4 w-4" />
          Point of Sale
          <span className="ml-auto rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">New</span>
        </Link>

        <div className="my-3 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

        {groups.map((g) => {
          const Icon = g.icon;
          const isOpen = open[g.label];
          return (
            <div key={g.label}>
              <button
                onClick={() => setOpen((s) => ({ ...s, [g.label]: !s[g.label] }))}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 transition hover:bg-white/50"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-left">{g.label}</span>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition", isOpen && "rotate-180")} />
              </button>
              {isOpen && (
                <div className="ml-3 mt-1 space-y-0.5 border-l border-white/50 pl-3">
                  {g.items.map((it) => {
                    const active = pathname === it.to || pathname.startsWith(it.to + "/");
                    return (
                      <Link key={it.to} to={it.to} onClick={onNavigate} className={cn(
                        "block rounded-lg px-3 py-1.5 text-sm transition",
                        active ? "bg-white/70 font-medium text-blue-700 shadow-sm"
                          : "text-foreground/70 hover:bg-white/40 hover:text-foreground"
                      )}>
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

      <div className="border-t border-white/40 p-4">
        <div className="glass-card flex items-center gap-3 p-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-semibold text-white">AO</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Aisha Otieno</p>
            <p className="truncate text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
