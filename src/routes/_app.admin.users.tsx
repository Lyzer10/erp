import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/erp/DataTable";
import { PageHeader } from "@/components/erp/PageHeader";
import { StatusPill } from "@/components/erp/StatusPill";
import {
  createUserFn,
  getAuditLogsFn,
  getUsersFn,
  resetUserPasswordFn,
  setUserStatusFn,
} from "@/lib/api/admin";

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

export const Route = createFileRoute("/_app/admin/users")({
  head: () => ({ meta: [{ title: "Users & Audit — DeveleERP" }] }),
  loader: async () => ({ users: await getUsersFn(), logs: await getAuditLogsFn() }),
  component: UsersPage,
});

function UsersPage() {
  const initial = Route.useLoaderData() as { users: UserRow[]; logs: AuditRow[] };
  const [users, setUsers] = useState(initial.users);
  const [logs, setLogs] = useState(initial.logs);
  const [open, setOpen] = useState(false);
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
        title="Users & Audit"
        description="Production accounts, roles, account status and recent administrative activity."
        actions={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4" /> New user
          </button>
        }
      />
      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      <section className="space-y-3">
        <h2 className="font-bold">User accounts</h2>
        <DataTable
          data={users}
          columns={[
            { key: "username", header: "Username" },
            { key: "email", header: "Email" },
            { key: "role", header: "Role" },
            { key: "department", header: "Department" },
            {
              key: "status",
              header: "Status",
              render: (row: UserRow) => <StatusPill status={row.status} />,
            },
            {
              key: "actions",
              header: "",
              render: (row: UserRow) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => reset(row)}
                    className="rounded-lg border px-2 py-1 text-xs font-bold"
                  >
                    Reset password
                  </button>
                  <button
                    onClick={() => toggle(row)}
                    className="rounded-lg border px-2 py-1 text-xs font-bold"
                  >
                    {row.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                </div>
              ),
            },
          ]}
        />
      </section>
      <section className="space-y-3">
        <h2 className="font-bold">Audit log</h2>
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
            onSubmit={create}
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6"
          >
            <h2 className="text-lg font-bold">New user</h2>
            {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
            <Input label="Username" value={username} setValue={setUsername} />
            <Input label="Email" value={email} setValue={setEmail} type="email" />
            <Input
              label="Initial password (12+ characters)"
              value={password}
              setValue={setPassword}
              type="password"
            />
            <label className="block text-sm font-semibold">
              Role
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as typeof role)}
                className="input-field mt-1"
              >
                {["Admin", "Pharmacist", "Cashier", "Storekeeper", "Accountant"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <Input label="Department" value={department} setValue={setDepartment} />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button className="rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-semibold text-white">
                Create user
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
