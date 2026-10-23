import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/erp/DataTable";
import { PageHeader } from "@/components/erp/PageHeader";
import { StatusPill } from "@/components/erp/StatusPill";
import {
  createUserFn,
  getPermissionMatrixFn,
  getAuditLogsFn,
  getUsersFn,
  removeUserFn,
  resetUserPasswordFn,
  savePermissionChangesFn,
  setUserStatusFn,
  updateUserFn,
} from "@/lib/api/admin";
import { useTranslate } from "@/lib/i18n";
import type { ModuleKey } from "@/lib/modules";

type UserRow = {
  id: number;
  username: string;
  email: string;
  role: string;
  department?: string | null;
  status: string;
  createdAt: Date | string;
};
type AuditRow = {
  id: number;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  createdAt: Date | string;
};
type PermissionRole = "Admin" | "Pharmacist" | "Cashier" | "Storekeeper" | "Accountant";
type PermissionMatrix = {
  modules: readonly ModuleKey[];
  roles: { role: PermissionRole; permissions: Record<ModuleKey, boolean> }[];
  users: (UserRow & { effectiveModules: ModuleKey[]; overrides: Partial<Record<ModuleKey, boolean>> })[];
};
type PendingPermission =
  | { scope: "role"; role: PermissionRole; module: ModuleKey; enabled: boolean }
  | { scope: "user"; userId: number; module: ModuleKey; enabled: boolean | null };

export const Route = createFileRoute("/_app/admin/users")({
  head: () => ({ meta: [{ title: "Users & Audit — DeveleERP" }] }),
  loader: async () => ({
    users: await getUsersFn(),
    logs: await getAuditLogsFn(),
    permissions: await getPermissionMatrixFn().catch(() => null),
  }),
  component: UsersPage,
});

function UsersPage() {
  const initial = Route.useLoaderData() as { users: UserRow[]; logs: AuditRow[]; permissions: PermissionMatrix | null };
  const { user: currentUser } = Route.useRouteContext();
  const { lang } = useTranslate();
  const [users, setUsers] = useState(initial.users);
  const [logs, setLogs] = useState(initial.logs);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [permissions, setPermissions] = useState(initial.permissions);
  const [permissionRole, setPermissionRole] = useState<PermissionRole>("Admin");
  const [permissionUserId, setPermissionUserId] = useState<number | null>(initial.permissions?.users[0]?.id ?? null);
  const [pendingPermissions, setPendingPermissions] = useState<PendingPermission[]>([]);
  const [savingPermissions, setSavingPermissions] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<
    "Admin" | "Pharmacist" | "Cashier" | "Storekeeper" | "Accountant"
  >("Cashier");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function refreshLogs() {
    setLogs((await getAuditLogsFn()) as AuditRow[]);
  }
  async function create(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      const created = await createUserFn({
        data: { username, email, password, role, department: department || undefined },
      });
      setUsers((current) => [...current, created as UserRow]);
      await refreshLogs();
      setOpen(false);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "User could not be created.");
    }
  }
  function closeForm() {
    setOpen(false);
    setEditing(null);
    setUsername("");
    setEmail("");
    setPassword("");
    setDepartment("");
    setRole("Cashier");
  }
  function openEdit(user: UserRow) {
    setEditing(user);
    setUsername(user.username);
    setEmail(user.email);
    setRole(user.role as typeof role);
    setDepartment(user.department || "");
    setPassword("");
    setOpen(true);
  }
  async function save(event: React.FormEvent) {
    if (!editing) return create(event);
    event.preventDefault();
    setError(null);
    try {
      const updated = await updateUserFn({ data: { userId: editing.id, username, email, role, department: department || undefined } });
      setUsers((current) => current.map((item) => item.id === editing.id ? updated as UserRow : item));
      await refreshLogs();
      closeForm();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "User could not be updated.");
    }
  }
  async function remove(user: UserRow) {
    const message = lang === "en"
      ? "Remove " + user.username + "'s login account? Their sales and audit history will be kept."
      : "Uondoe akaunti ya " + user.username + "? Historia ya mauzo na ukaguzi itahifadhiwa.";
    if (!window.confirm(message)) return;
    try {
      await removeUserFn({ data: { userId: user.id } });
      setUsers((current) => current.filter((item) => item.id !== user.id));
      await refreshLogs();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "User could not be removed.");
    }
  }
  async function refreshPermissions() {
    setPermissions(await getPermissionMatrixFn() as unknown as PermissionMatrix);
  }
  async function changeRolePermission(module: ModuleKey, enabled: boolean) {
    setPermissions((current) => current ? { ...current, roles: current.roles.map((item) => item.role === permissionRole ? { ...item, permissions: { ...item.permissions, [module]: enabled } } : item) } : current);
    setPendingPermissions((current) => [...current.filter((change) => !(change.scope === "role" && change.role === permissionRole && change.module === module)), { scope: "role", role: permissionRole, module, enabled }]);
  }
  async function changeUserPermission(module: ModuleKey, value: string) {
    if (!permissionUserId) return;
    const enabled = value === "default" ? null : value === "allow";
    setPermissions((current) => current ? { ...current, users: current.users.map((item) => item.id === permissionUserId ? { ...item, overrides: { ...item.overrides, [module]: enabled === null ? undefined : enabled } } : item) } : current);
    setPendingPermissions((current) => [...current.filter((change) => !(change.scope === "user" && change.userId === permissionUserId && change.module === module)), { scope: "user", userId: permissionUserId, module, enabled }]);
  }
  async function savePermissions() {
    if (!pendingPermissions.length) return;
    setSavingPermissions(true); setError(null);
    try {
      await savePermissionChangesFn({ data: { changes: pendingPermissions } });
      setPendingPermissions([]);
      await Promise.all([refreshPermissions(), refreshLogs()]);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Permissions could not be saved."); }
    finally { setSavingPermissions(false); }
  }
  async function toggle(user: UserRow) {
    const status = user.status === "Active" ? "Inactive" : "Active";
    try {
      await setUserStatusFn({ data: { userId: user.id, status } });
      setUsers((current) =>
        current.map((item) => (item.id === user.id ? { ...item, status } : item)),
      );
      await refreshLogs();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Status update failed.");
    }
  }
  async function reset(user: UserRow) {
    const next = window.prompt(
      `Enter a new password of at least 12 characters for ${user.username}:`,
    );
    if (!next) return;
    try {
      await resetUserPasswordFn({ data: { userId: user.id, password: next } });
      await refreshLogs();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Password reset failed.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === "en" ? "Users, access & audit" : "Watumiaji, ruhusa na ukaguzi"}
        description={lang === "en" ? "Manage pharmacy accounts without exposing the protected SuperAdmin account." : "Simamia akaunti za duka bila kuonyesha akaunti ya SuperAdmin iliyolindwa."}
        actions={
          <button
            onClick={() => { closeForm(); setOpen(true); }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4" /> {lang === "en" ? "New user" : "Mtumiaji mpya"}
          </button>
        }
      />
      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      <section className="space-y-3">
        <h2 className="font-bold">{lang === "en" ? "User accounts" : "Akaunti za watumiaji"}</h2>
        <DataTable
          data={users}
          columns={[
            { key: "username", header: lang === "en" ? "Username" : "Jina la kuingia" },
            { key: "email", header: lang === "en" ? "Email" : "Barua pepe" },
            { key: "role", header: lang === "en" ? "Role" : "Jukumu" },
            { key: "department", header: lang === "en" ? "Department" : "Idara" },
            {
              key: "status",
              header: lang === "en" ? "Status" : "Hali",
              render: (row: UserRow) => <StatusPill status={row.status} />,
            },
            {
              key: "actions",
              header: "",
              render: (row: UserRow) => row.id === Number(currentUser.id) ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <ShieldCheck className="h-4 w-4" /> {lang === "en" ? "Protected" : "Imelindwa"}
                </span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => openEdit(row)} className="rounded-lg border px-2 py-1 text-xs font-bold">
                    <Pencil className="mr-1 inline h-3 w-3" />{lang === "en" ? "Edit" : "Hariri"}
                  </button>
                  <button
                    onClick={() => reset(row)}
                    className="rounded-lg border px-2 py-1 text-xs font-bold"
                  >
                    <KeyRound className="mr-1 inline h-3 w-3" />{lang === "en" ? "Password" : "Nywila"}
                  </button>
                  <button
                    onClick={() => toggle(row)}
                    className="rounded-lg border px-2 py-1 text-xs font-bold"
                  >
                    {row.status === "Active" ? (lang === "en" ? "Deactivate" : "Zima") : (lang === "en" ? "Activate" : "Washa")}
                  </button>
                  <button onClick={() => remove(row)} className="rounded-lg border border-rose-200 px-2 py-1 text-xs font-bold text-rose-700">
                    <Trash2 className="mr-1 inline h-3 w-3" />{lang === "en" ? "Remove" : "Ondoa"}
                  </button>
                </div>
              ),
            },
          ]}
        />
      </section>
      {permissions && (
        <PermissionPanel
          matrix={permissions}
          role={permissionRole}
          setRole={setPermissionRole}
          userId={permissionUserId}
          setUserId={setPermissionUserId}
          onRoleChange={changeRolePermission}
          onUserChange={changeUserPermission}
          onSave={savePermissions}
          pendingCount={pendingPermissions.length}
          saving={savingPermissions}
          lang={lang}
        />
      )}
      <section className="space-y-3">
        <h2 className="font-bold">{lang === "en" ? "Audit log" : "Kumbukumbu ya ukaguzi"}</h2>
        <DataTable
          data={logs}
          pageSize={20}
          columns={[
            {
              key: "createdAt",
              header: "Date",
              render: (row: AuditRow) => new Date(row.createdAt).toLocaleString(),
            },
            { key: "action", header: "Action" },
            { key: "entityType", header: "Entity" },
            { key: "entityId", header: "ID" },
            { key: "summary", header: "Details" },
          ]}
        />
      </section>
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"
          onMouseDown={() => setOpen(false)}
        >
          <form
            onSubmit={save}
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6"
          >
            <h2 className="text-lg font-bold">{editing ? (lang === "en" ? "Edit user" : "Hariri mtumiaji") : (lang === "en" ? "New user" : "Mtumiaji mpya")}</h2>
            {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
            <Input label={lang === "en" ? "Username" : "Jina la kuingia"} value={username} setValue={setUsername} />
            <Input label={lang === "en" ? "Email" : "Barua pepe"} value={email} setValue={setEmail} type="email" />
            {!editing && <Input
              label="Initial password (12+ characters)"
              value={password}
              setValue={setPassword}
              type="password"
            />}
            <label className="block text-sm font-semibold">
              Role
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as typeof role)}
                className="input-field mt-1"
              >
                {(currentUser.role === "SuperAdmin" ? ["Admin", "Pharmacist", "Cashier", "Storekeeper", "Accountant"] : ["Pharmacist", "Cashier", "Storekeeper", "Accountant"]).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <Input label="Department" value={department} setValue={setDepartment} />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border px-4 py-2 text-sm font-semibold"
              >
                {lang === "en" ? "Cancel" : "Ghairi"}
              </button>
              <button className="rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-semibold text-white">
                {editing ? (lang === "en" ? "Save changes" : "Hifadhi mabadiliko") : (lang === "en" ? "Create user" : "Unda mtumiaji")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  setValue,
  type = "text",
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        required
        type={type}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="input-field mt-1"
      />
    </label>
  );
}

const MODULE_LABELS: Record<ModuleKey, { en: string; sw: string }> = {
  dashboard: { en: "Dashboard", sw: "Dashibodi" },
  pos: { en: "Point of Sale", sw: "Mfumo wa mauzo" },
  stakeholders: { en: "Stakeholders", sw: "Washirika" },
  sales: { en: "Sales", sw: "Mauzo" },
  inventory: { en: "Inventory", sw: "Stoo" },
  procurement: { en: "Procurement", sw: "Manunuzi" },
  hr: { en: "Human Resource", sw: "Rasilimali watu" },
  administration: { en: "Administration", sw: "Usimamizi" },
};

function PermissionPanel({
  matrix,
  role,
  setRole,
  userId,
  setUserId,
  onRoleChange,
  onUserChange,
  onSave,
  pendingCount,
  saving,
  lang,
}: {
  matrix: PermissionMatrix;
  role: PermissionRole;
  setRole: (role: PermissionRole) => void;
  userId: number | null;
  setUserId: (id: number | null) => void;
  onRoleChange: (module: ModuleKey, enabled: boolean) => Promise<void>;
  onUserChange: (module: ModuleKey, value: string) => Promise<void>;
  onSave: () => Promise<void>;
  pendingCount: number;
  saving: boolean;
  lang: "en" | "sw";
}) {
  const selectedRole = matrix.roles.find((item) => item.role === role)!;
  const selectedUser = matrix.users.find((item) => item.id === userId);
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <div>
        <h2 className="font-bold">{lang === "en" ? "Module permissions" : "Ruhusa za sehemu za mfumo"}</h2>
        <p className="mt-1 text-sm text-slate-600">
          {lang === "en"
            ? "Set the normal access for a role, then add an exception for one user only when needed."
            : "Weka ruhusa za kawaida kwa jukumu, kisha badilisha kwa mtumiaji mmoja tu inapohitajika."}
        </p>
      </div>
      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
        <p className="text-sm text-slate-600">
          {pendingCount
            ? (lang === "en" ? `${pendingCount} unsaved change(s)` : `Mabadiliko ${pendingCount} hayajahifadhiwa`)
            : (lang === "en" ? "All permission changes are saved." : "Mabadiliko yote yamehifadhiwa.")}
        </p>
        <button type="button" disabled={!pendingCount || saving} onClick={() => void onSave()} className="rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">
          {saving ? (lang === "en" ? "Saving..." : "Inahifadhi...") : (lang === "en" ? "Save changes" : "Hifadhi mabadiliko")}
        </button>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">
            {lang === "en" ? "Role defaults" : "Ruhusa za jukumu"}
            <select value={role} onChange={(event) => setRole(event.target.value as PermissionRole)} className="input-field mt-1">
              {matrix.roles.map((item) => <option key={item.role} value={item.role}>{item.role}</option>)}
            </select>
          </label>
          <div className="mt-3 divide-y rounded-xl border border-slate-200">
            {matrix.modules.map((module) => (
              <label key={module} className="flex items-center justify-between gap-4 px-4 py-3 text-sm font-medium">
                {MODULE_LABELS[module][lang]}
                <input
                  type="checkbox"
                  checked={selectedRole.permissions[module]}
                  onChange={(event) => void onRoleChange(module, event.target.checked)}
                  className="h-4 w-4 accent-[#1f9c88]"
                />
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold">
            {lang === "en" ? "Exception for one user" : "Badiliko kwa mtumiaji mmoja"}
            <select value={userId ?? ""} onChange={(event) => setUserId(event.target.value ? Number(event.target.value) : null)} className="input-field mt-1">
              <option value="">{lang === "en" ? "Choose user" : "Chagua mtumiaji"}</option>
              {matrix.users.map((item) => <option key={item.id} value={item.id}>{item.username} · {item.role}</option>)}
            </select>
          </label>
          {selectedUser ? (
            <div className="mt-3 divide-y rounded-xl border border-slate-200">
              {matrix.modules.map((module) => {
                const override = selectedUser.overrides[module];
                return (
                  <label key={module} className="flex items-center justify-between gap-4 px-4 py-3 text-sm font-medium">
                    {MODULE_LABELS[module][lang]}
                    <select
                      value={override === undefined ? "default" : override ? "allow" : "block"}
                      onChange={(event) => void onUserChange(module, event.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold"
                    >
                      <option value="default">{lang === "en" ? "Role default" : "Fuata jukumu"}</option>
                      <option value="allow">{lang === "en" ? "Allow" : "Ruhusu"}</option>
                      <option value="block">{lang === "en" ? "Block" : "Zuia"}</option>
                    </select>
                  </label>
                );
              })}
            </div>
          ) : (
            <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              {lang === "en" ? "Choose a user to add an individual exception." : "Chagua mtumiaji ili kuweka ruhusa tofauti."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
