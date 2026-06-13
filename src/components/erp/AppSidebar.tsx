import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslate } from "@/lib/i18n";
import {
  LayoutDashboard, Users, Receipt, Package, Wallet, UserCog, Warehouse,
  Settings, ScanLine, ChevronDown, ChevronsLeft, ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { label: string; to: string };
type Group = { label: string; icon: React.ComponentType<{ className?: string }>; items: Item[] };

interface Props {
  readonly onNavigate?: () => void;
  readonly collapsed?: boolean;
  readonly onToggle?: () => void;
}

export function AppSidebar({ onNavigate, collapsed = false, onToggle }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t, lang } = useTranslate();

  const groups: Group[] = [
    {
      label: t("stakeholders"),
      icon: Users,
      items: [
        { label: t("customers"), to: "/stakeholders/customers" },
        { label: t("suppliers"), to: "/stakeholders/suppliers" },
      ]
    },
    {
      label: t("sales"),
      icon: Receipt,
      items: [
        { label: t("invoices"), to: "/sales/invoices" },
        { label: t("reports"), to: "/sales/reports" },
        { label: t("receipts"), to: "/sales/receipts" },
        { label: t("statement"), to: "/sales/customer-statement" },
        { label: t("stockRequest"), to: "/sales/inter-branch" },
      ]
    },
    {
      label: t("products"),
      icon: Package,
      items: [
        { label: t("products"), to: "/products/catalog" },
        { label: t("purchaseOrder"), to: "/products/purchase-orders" },
        { label: t("expenses"), to: "/products/expenses" },
        { label: t("paymentRequest"), to: "/products/self-service" },
      ]
    },
    {
      label: t("finance"),
      icon: Wallet,
      items: [
        { label: t("reports"), to: "/finance/reports" },
        { label: t("bankCash"), to: "/finance/bank-cash" },
        { label: t("ledgers"), to: "/finance/ledgers" },
      ]
    },
    {
      label: t("hrPayroll"),
      icon: UserCog,
      items: [
        { label: t("staff"), to: "/hr/staff" },
        { label: t("leave"), to: "/hr/leave" },
        { label: t("salary"), to: "/hr/salary" },
        { label: t("payroll"), to: "/hr/payroll" },
      ]
    },
    {
      label: t("store"),
      icon: Warehouse,
      items: [
        { label: t("stock"), to: "/store/stock" },
        { label: t("transfers"), to: "/store/transfers" },
        { label: t("stores"), to: "/store/stores" },
      ]
    },
    {
      label: t("admin"),
      icon: Settings,
      items: [
        { label: t("staff"), to: "/admin/users" },
        { label: t("settings"), to: "/admin/settings" },
      ]
    },
  ];

  const initiallyOpen = (g: Group) => g.items.some((i) => pathname.startsWith(i.to));
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g) => [g.label, initiallyOpen(g)])),
  );

  return (
    <aside
      className={cn(
        "glass-nav fixed inset-y-0 left-0 z-40 hidden flex-col lg:flex",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 py-1",
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
          <img 
            src="/devele-logo.png" 
            alt="DeveleICT" 
            className={cn("shrink-0 object-contain", collapsed ? "h-9 w-9" : "h-11 w-11")} 
          />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-tight tracking-tight">DeveleERP</p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground font-display">Enterprise Suite</p>
            </div>
          )}
        </Link>
        {!collapsed && onToggle && (
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-slate-100 hover:text-foreground"
            aria-label="Collapse sidebar"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {collapsed && onToggle && (
        <button
          onClick={onToggle}
          className="mx-auto mt-3 rounded-lg p-1.5 text-muted-foreground transition hover:bg-slate-100 hover:text-foreground"
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
          title={t("dashboard")}
          className={cn(
            "flex items-center rounded-xl text-sm font-medium transition",
            collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
            pathname === "/"
              ? "bg-blue-500 text-white shadow-sm font-semibold"
              : "text-foreground/75 hover:bg-slate-100 hover:text-foreground",
          )}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!collapsed && <span>{t("dashboard")}</span>}
        </Link>

        {/* POS */}
        <Link
          to="/pos"
          onClick={onNavigate}
          title="Point of Sale"
          style={{ marginTop: "14px" }}
          className={cn(
            "flex items-center rounded-xl text-sm font-medium transition",
            collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
            pathname === "/pos"
              ? "bg-blue-500 text-white shadow-sm font-semibold"
              : "text-foreground/75 hover:bg-slate-100 hover:text-foreground",
          )}
        >
          <ScanLine className="h-4 w-4 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1">{t("openPos")}</span>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase transition-colors",
                pathname === "/pos"
                  ? "bg-white text-blue-600"
                  : "bg-emerald-100 text-emerald-800"
              )}>
                {lang === "en" ? "New" : "Mpya"}
              </span>
            </>
          )}
        </Link>

        <div className="my-3 h-px bg-slate-200" />

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
                    ? "bg-blue-500 text-white shadow-sm font-semibold"
                    : "text-foreground/75 hover:bg-slate-100",
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
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/75 transition hover:bg-slate-100 hover:text-foreground"
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-left">{g.label}</span>
                <ChevronDown className={cn(
                  "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180",
                )} />
              </button>

              {isOpen && (
                <div className="ml-3 mt-1 space-y-0.5 border-l border-slate-200 pl-3 pb-1">
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
                            ? "bg-blue-500 font-semibold text-white shadow-sm"
                            : "text-foreground/65 hover:bg-slate-100 hover:text-foreground",
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
        <div className="border-t border-slate-200 p-4">
          <div className="glass-card flex items-center gap-3 p-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-semibold text-blue-900">
              AO
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Aisha Otieno</p>
              <p className="truncate text-xs text-muted-foreground">
                {lang === "en" ? "Administrator" : "Msimamizi"}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
