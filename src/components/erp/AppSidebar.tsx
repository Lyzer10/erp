import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  Package,
  Receipt,
  ScanLine,
  Settings,
  ShoppingCart,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { ShellUser } from "./Topbar";

type NavItem = { label: string; to: string };
type NavGroup = { label: string; icon: LucideIcon; items: NavItem[] };

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
  const { t } = useTranslate();
  const initials = user.username.slice(0, 2).toUpperCase();
  const groups: NavGroup[] = [
    {
      label: t("stakeholders"),
      icon: Users,
      items: [
        { label: t("customers"), to: "/stakeholders/customers" },
        { label: t("suppliers"), to: "/stakeholders/suppliers" },
      ],
    },
    {
      label: t("sales"),
      icon: Receipt,
      items: [
        { label: t("receipts"), to: "/sales/receipts" },
        { label: t("salesReports"), to: "/sales/reports" },
        { label: t("customerStatement"), to: "/sales/customer-statement" },
      ],
    },
    {
      label: t("inventory"),
      icon: Warehouse,
      items: [
        { label: t("currentStock"), to: "/store/stock" },
        { label: t("manageItems"), to: "/products/catalog" },
        { label: t("adjustment"), to: "/store/stock?adjust=true" },
      ],
    },
    {
      label: t("procurement"),
      icon: ShoppingCart,
      items: [
        { label: t("suppliers"), to: "/stakeholders/suppliers" },
        { label: t("purchases"), to: "/products/purchase-orders" },
      ],
    },
    { label: t("humanResource"), icon: Users, items: [{ label: t("staff"), to: "/hr/staff" }] },
  ];
  if (["SuperAdmin", "Admin"].includes(user.role))
    groups.push({
      label: t("administration"),
      icon: Settings,
      items: [
        { label: t("usersAudit"), to: "/admin/users" },
        { label: t("businessSettings"), to: "/admin/settings" },
      ],
    });

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
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-slate-100"
            aria-label="Collapse sidebar"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        )}
      </div>
      {collapsed && onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="mx-auto mt-3 rounded-lg p-1.5 text-muted-foreground hover:bg-slate-100"
          aria-label="Expand sidebar"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      )}
      <nav className={cn("flex-1 space-y-1 overflow-y-auto py-4", collapsed ? "px-2" : "px-3")}>
        <DirectLink
          to="/"
          label={t("dashboard")}
          icon={LayoutDashboard}
          active={pathname === "/"}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
        <DirectLink
          to="/pos"
          label={t("pointOfSale")}
          icon={ScanLine}
          active={pathname === "/pos"}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
        <div className="my-3 h-px bg-slate-200" />
        {groups.map((group) => (
          <NavGroupSection
            key={group.label}
            group={group}
            pathname={pathname}
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

function NavGroupSection({
  group,
  pathname,
  collapsed,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const active = group.items.some(
    (item) =>
      pathname === item.to.split("?")[0] || pathname.startsWith(`${item.to.split("?")[0]}/`),
  );
  const [open, setOpen] = useState(active);
  if (collapsed)
    return (
      <DirectLink
        to={group.items[0].to}
        label={group.label}
        icon={group.icon}
        active={active}
        collapsed
        onNavigate={onNavigate}
      />
    );
  const Icon = group.icon;
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-slate-100",
          active && "text-[#177d6d]",
        )}
        aria-expanded={open}
      >
        <Icon className="h-4 w-4" />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="ml-5 border-l border-slate-200 py-1 pl-3">
          {group.items.map((item) => (
            <Link
              key={`${item.to}-${item.label}`}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm transition hover:bg-slate-100",
                pathname === item.to.split("?")[0]
                  ? "font-semibold text-[#177d6d]"
                  : "text-slate-600",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function DirectLink({
  to,
  label,
  icon: Icon,
  active,
  collapsed,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
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
          ? "bg-blue-100 font-semibold text-blue-900"
          : "text-foreground/75 hover:bg-slate-100 hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="flex-1">{label}</span>}
    </Link>
  );
}
