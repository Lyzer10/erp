import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Receipt,
  ScanLine,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShellUser } from "./Topbar";

const links = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Point of Sale", to: "/pos", icon: ScanLine },
  { label: "Products", to: "/products/catalog", icon: Package },
  { label: "Purchases", to: "/products/purchase-orders", icon: ShoppingCart },
  { label: "Stock & Expiry", to: "/store/stock", icon: Package },
  { label: "Customers", to: "/stakeholders/customers", icon: Users },
  { label: "Suppliers", to: "/stakeholders/suppliers", icon: Users },
  { label: "Receipts", to: "/sales/receipts", icon: Receipt },
  { label: "Sales Reports", to: "/sales/reports", icon: Receipt },
  { label: "Customer Statement", to: "/sales/customer-statement", icon: Receipt },
  { label: "Expenses", to: "/products/expenses", icon: Receipt },
];

export function AppSidebar({
  onNavigate,
  collapsed = false,
  user,
}: {
  readonly onNavigate?: () => void;
  readonly collapsed?: boolean;
  readonly onToggle?: () => void;
  readonly user: ShellUser;
}) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const visible = [
    ...links,
    ...(["SuperAdmin", "Admin"].includes(user.role)
      ? [
          { label: "Users & Audit", to: "/admin/users", icon: Settings },
          { label: "Business Settings", to: "/admin/settings", icon: Settings },
        ]
      : []),
  ];
  return (
    <aside
      className={cn(
        "glass-nav fixed inset-y-0 left-0 z-40 hidden flex-col lg:flex",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <Link to="/" className="flex h-16 items-center gap-3 border-b px-4">
        <img src="/devele-logo.png" alt="DeveleERP" className="h-10 w-10 object-contain" />
        {!collapsed && (
          <div>
            <p className="font-black">DeveleERP</p>
            <p className="text-[10px] uppercase text-muted-foreground">Pharmacy operations</p>
          </div>
        )}
      </Link>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {visible.map(({ label, to, icon: Icon }) => {
          const active = pathname === to || (to !== "/" && pathname.startsWith(`${to}/`));
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              title={label}
              className={cn(
                "flex items-center rounded-xl py-2.5 text-sm font-semibold",
                collapsed ? "justify-center px-2" : "gap-3 px-3",
                active ? "bg-blue-100 text-blue-900" : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>
      {!collapsed && (
        <div className="border-t p-4">
          <p className="truncate text-sm font-bold">{user.username}</p>
          <p className="truncate text-xs text-muted-foreground">{user.role}</p>
        </div>
      )}
    </aside>
  );
}
