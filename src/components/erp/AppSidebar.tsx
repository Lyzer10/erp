import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  Package,
  Receipt,
  ScanLine,
  Settings,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShellUser } from "./Topbar";

type Item = { label: string; to: string };
type Group = { label: string; icon: LucideIcon; items: Item[] };

export function AppSidebar({
  onNavigate,
  collapsed = false,
  onToggle,
  user,
}: {
  readonly onNavigate?: () => void;
  readonly collapsed?: boolean;
  readonly onToggle?: () => void;
  readonly user: ShellUser;
}) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const groups: Group[] = [
    {
      label: "Stakeholders",
      icon: Users,
      items: [
        { label: "Customers", to: "/stakeholders/customers" },
        { label: "Suppliers", to: "/stakeholders/suppliers" },
      ],
    },
    {
      label: "Sales",
      icon: Receipt,
      items: [
        { label: "Receipts", to: "/sales/receipts" },
        { label: "Sales reports", to: "/sales/reports" },
        { label: "Customer statement", to: "/sales/customer-statement" },
      ],
    },
    {
      label: "Products",
      icon: Package,
      items: [
        { label: "Medicine catalog", to: "/products/catalog" },
        { label: "Purchase orders", to: "/products/purchase-orders" },
        { label: "Expenses", to: "/products/expenses" },
      ],
    },
    {
      label: "Store",
      icon: Warehouse,
      items: [{ label: "Stock & expiry", to: "/store/stock" }],
    },
  ];

  if (["SuperAdmin", "Admin"].includes(user.role)) {
    groups.push({
      label: "Administration",
      icon: Settings,
      items: [
        { label: "Users & audit", to: "/admin/users" },
        { label: "Business settings", to: "/admin/settings" },
      ],
    });
  }

  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      groups.map((group) => [
        group.label,
        group.items.some((item) => pathname === item.to || pathname.startsWith(`${item.to}/`)),
      ]),
    ),
  );
  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <aside
      className={cn(
        "glass-nav fixed inset-y-0 left-0 z-40 hidden flex-col transition-[width] duration-200 ease-out lg:flex",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 py-1",
          collapsed ? "justify-center px-2" : "px-5",
        )}
      >
        <Link
          to="/"
          onClick={onNavigate}
          className={cn("flex min-w-0 items-center gap-3", !collapsed && "flex-1")}
        >
          <img
            src="/devele-logo.png"
            alt="DeveleERP"
            className={cn("shrink-0 object-contain", collapsed ? "h-9 w-9" : "h-11 w-11")}
          />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-tight tracking-tight">DeveleERP</p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Pharmacy operations
              </p>
            </div>
          )}
        </Link>
        {!collapsed && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-slate-100 hover:text-foreground"
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {collapsed && onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="mx-auto mt-3 rounded-lg p-1.5 text-muted-foreground transition hover:bg-slate-100 hover:text-foreground"
          aria-label="Expand sidebar"
          title="Expand sidebar"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      )}

      <nav className={cn("flex-1 space-y-0.5 overflow-y-auto py-4", collapsed ? "px-2" : "px-3")}>
        <DirectLink
          to="/"
          label="Dashboard"
          icon={LayoutDashboard}
          active={pathname === "/"}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
        <div className="pt-3">
          <DirectLink
            to="/pos"
            label="Point of Sale"
            icon={ScanLine}
            active={pathname === "/pos"}
            collapsed={collapsed}
            onNavigate={onNavigate}
            badge="New"
          />
        </div>

        <div className="my-3 h-px bg-slate-200" />

        {groups.map((group) => {
          const active = group.items.some(
            (item) => pathname === item.to || pathname.startsWith(`${item.to}/`),
          );
          const Icon = group.icon;
          if (collapsed) {
            return (
              <Link
                key={group.label}
                to={group.items[0].to}
                onClick={onNavigate}
                title={group.label}
                className={cn(
                  "flex items-center justify-center rounded-xl p-2.5 text-sm transition",
                  active
                    ? "bg-blue-100 font-semibold text-blue-900 shadow-sm"
                    : "text-foreground/75 hover:bg-slate-100 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
              </Link>
            );
          }
          return (
            <div key={group.label}>
              <button
                type="button"
                onClick={() =>
                  setOpen((current) => ({ ...current, [group.label]: !current[group.label] }))
                }
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "text-blue-900"
                    : "text-foreground/75 hover:bg-slate-100 hover:text-foreground",
                )}
                aria-expanded={Boolean(open[group.label])}
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-left">{group.label}</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                    open[group.label] && "rotate-180",
                  )}
                />
              </button>
              {open[group.label] && (
                <div className="ml-3 mt-1 space-y-0.5 border-l border-slate-200 pb-1 pl-3">
                  {group.items.map((item) => {
                    const itemActive = pathname === item.to || pathname.startsWith(`${item.to}/`);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={onNavigate}
                        className={cn(
                          "block rounded-lg px-3 py-1.5 text-sm transition",
                          itemActive
                            ? "bg-blue-100 font-semibold text-blue-900 shadow-sm"
                            : "text-foreground/65 hover:bg-slate-100 hover:text-foreground",
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-semibold text-blue-900">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.username}</p>
              <p className="truncate text-xs text-muted-foreground">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function DirectLink({
  to,
  label,
  icon: Icon,
  active,
  collapsed,
  onNavigate,
  badge,
}: {
  to: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
  badge?: string;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      title={label}
      className={cn(
        "flex items-center rounded-xl text-sm font-medium transition",
        collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
        active
          ? "bg-blue-100 font-semibold text-blue-900 shadow-sm"
          : "text-foreground/75 hover:bg-slate-100 hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="flex-1">{label}</span>}
      {!collapsed && badge && (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
            active ? "bg-white text-blue-600" : "bg-emerald-100 text-emerald-800",
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
