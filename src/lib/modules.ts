// Client-safe module registry. Server-side resolution lives in ./permissions.

export const MODULE_KEYS = [
  "dashboard",
  "pos",
  "stakeholders",
  "sales",
  "inventory",
  "procurement",
  "hr",
  "administration",
] as const;

export type ModuleKey = (typeof MODULE_KEYS)[number];
export const MANAGEABLE_ROLES = ["Admin", "Pharmacist", "Cashier", "Storekeeper", "Accountant"] as const;
export type ManageableRole = (typeof MANAGEABLE_ROLES)[number];

const DEFAULTS: Record<ManageableRole, readonly ModuleKey[]> = {
  Admin: MODULE_KEYS,
  Pharmacist: ["dashboard", "pos", "stakeholders", "sales", "inventory", "procurement"],
  Cashier: ["dashboard", "pos", "stakeholders", "sales"],
  Storekeeper: ["dashboard", "inventory", "procurement"],
  Accountant: ["dashboard", "stakeholders", "sales"],
};

export function defaultModulesForRole(role: string): ModuleKey[] {
  if (role === "SuperAdmin") return [...MODULE_KEYS];
  return [...(DEFAULTS[role as ManageableRole] ?? [])];
}

// Landing page for each module, used when the dashboard itself is switched off.
export const MODULE_HOME: Record<ModuleKey, string> = {
  dashboard: "/",
  pos: "/pos",
  stakeholders: "/stakeholders/customers",
  sales: "/sales/receipts",
  inventory: "/store/stock",
  procurement: "/products/purchase-orders",
  hr: "/hr/staff",
  administration: "/admin/users",
};

export function moduleForPath(pathname: string): ModuleKey | null {
  if (pathname === "/") return "dashboard";
  if (pathname.startsWith("/pos") || pathname.startsWith("/products/self-service")) return "pos";
  if (pathname.startsWith("/stakeholders")) return "stakeholders";
  if (pathname.startsWith("/sales") || pathname.startsWith("/products/expenses")) return "sales";
  if (pathname.startsWith("/store") || pathname.startsWith("/products/catalog")) return "inventory";
  if (pathname.startsWith("/products/purchase-orders")) return "procurement";
  if (pathname.startsWith("/hr")) return "hr";
  if (pathname.startsWith("/admin") || pathname.startsWith("/finance")) return "administration";
  return null;
}
