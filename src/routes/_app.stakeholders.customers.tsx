import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/erp/DataTable";
import { PageHeader } from "@/components/erp/PageHeader";
import { StatusPill } from "@/components/erp/StatusPill";
import { createCustomerFn, getCustomersFn } from "@/lib/api/domain";
import { setPartyStatusFn } from "@/lib/api/operations";
import { useTranslate } from "@/lib/i18n";

type Customer = {
  id: number;
  code: string;
  name: string;
  contact?: string | null;
  phone?: string | null;
  email?: string | null;
  balance: number;
  status: string;
};

export const Route = createFileRoute("/_app/stakeholders/customers")({
  head: () => ({ meta: [{ title: "Customers — DeveleERP" }] }),
  loader: () => getCustomersFn(),
  component: CustomersPage,
});

export function ImportCard({ title }: { title: string; templateName?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Bulk import is disabled until row validation and duplicate detection are complete. Add
        records individually to protect production data.
      </p>
    </div>
  );
}

const money = (value: number) => `TZS ${new Intl.NumberFormat("en-TZ").format(value)}`;

function CustomersPage() {
  const { lang } = useTranslate();
  const loaded = Route.useLoaderData();
  const [customers, setCustomers] = useState<Customer[]>(loaded.data as Customer[]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const result = await getCustomersFn();
    setCustomers(result.data as Customer[]);
  }

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createCustomerFn({
        data: {
          name,
          contact: contact || undefined,
          phone: phone || undefined,
          email: email || undefined,
        },
      });
      await refresh();
      setOpen(false);
      setName("");
      setContact("");
      setPhone("");
      setEmail("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Customer could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(customer: Customer) {
    const status = customer.status === "Active" ? "Inactive" : "Active";
    await setPartyStatusFn({ data: { party: "customer", id: customer.id, status } });
    setCustomers((current) =>
      current.map((item) => (item.id === customer.id ? { ...item, status } : item)),
    );
  }

  return (
    <div className="space-y-6">
      {loaded.isTestUser && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800">
          Demo mode: changes are temporary and isolated from production.
        </p>
      )}
      <PageHeader
        title={lang === "en" ? "Customers" : "Wateja"}
        description={
          lang === "en"
            ? "Customer directory and credit balances."
            : "Orodha ya wateja na salio la mikopo."
        }
        actions={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4" /> New customer
          </button>
        }
      />
      <DataTable
        data={customers}
        columns={[
          { key: "code", header: "Code" },
          { key: "name", header: "Customer" },
          { key: "contact", header: "Contact" },
          { key: "phone", header: "Phone" },
          { key: "email", header: "Email" },
          {
            key: "balance",
            header: "Balance",
            align: "right",
            render: (row: Customer) => money(row.balance),
          },
          {
            key: "status",
            header: "Status",
            render: (row: Customer) => <StatusPill status={row.status} />,
          },
          {
            key: "action",
            header: "",
            render: (row: Customer) => (
              <button
                onClick={() => toggle(row)}
                className="rounded-lg border px-3 py-1 text-xs font-bold"
              >
                {row.status === "Active" ? "Deactivate" : "Activate"}
              </button>
            ),
          },
        ]}
      />
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"
          onMouseDown={() => setOpen(false)}
        >
          <form
            onSubmit={create}
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 className="text-lg font-bold">New customer</h2>
            {error && (
              <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
                {error}
              </p>
            )}
            <Input label="Customer name" value={name} setValue={setName} required />
            <Input label="Contact person" value={contact} setValue={setContact} />
            <Input label="Phone" value={phone} setValue={setPhone} />
            <Input label="Email" value={email} setValue={setEmail} type="email" />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={saving}
                className="rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-semibold text-white"
              >
                {saving ? "Saving..." : "Save"}
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
  required,
  type = "text",
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="input-field mt-1"
      />
    </label>
  );
}
