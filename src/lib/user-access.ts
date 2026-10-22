export const STAFF_ROLES = ["Pharmacist", "Cashier", "Storekeeper", "Accountant"] as const;
export const ASSIGNABLE_ROLES = ["Admin", ...STAFF_ROLES] as const;

export function canManageRole(actorRole: string, targetRole: string) {
  if (actorRole === "SuperAdmin") return targetRole !== "SuperAdmin";
  return actorRole === "Admin" && (STAFF_ROLES as readonly string[]).includes(targetRole);
}

export function canAssignRole(actorRole: string, role: string) {
  if (actorRole === "SuperAdmin") return (ASSIGNABLE_ROLES as readonly string[]).includes(role);
  return actorRole === "Admin" && (STAFF_ROLES as readonly string[]).includes(role);
}
