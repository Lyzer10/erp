import { Link, useRouterState } from "@tanstack/react-router";
import {
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

const links: Array<Item & { icon: LucideIcon }> = [
  { label: "Customers", to: "/stakeholders/customers", icon: Users },
  { label: "Suppliers", to: "/stakeholders/suppliers", icon: Users },
  { label: "Receipts", to: "/sales/receipts", icon: Receipt },
  { label: "Sales reports", to: "/sales/reports", icon: Receipt },
  { label: "Customer statement", to: "/sales/customer-statement", icon: Receipt },
  { label: "Medicine catalog", to: "/products/catalog", icon: Package },
  { label: "Purchase orders", to: "/products/purchase-orders", icon: Package },
  { label: "Expenses", to: "/products/expenses", icon: Receipt },
  { label: "Stock & expiry", to: "/store/stock", icon: Warehouse },
];

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
  const visibleLinks = [
    ...links,
    ...(["SuperAdmin", "Admin"].includes(user.role)
      ? [
          { label: "Users & audit", to: "/admin/users", icon: Settings },
          { label: "Business settings", to: "/admin/settings", icon: Settings },
        ]
      : []),
  ];
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

        {visibleLinks.map(({ label, to, icon }) => (
          <DirectLink
            key={to}
            to={to}
            label={label}
            icon={icon}
            active={pathname === to || pathname.startsWith(`${to}/`)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
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
