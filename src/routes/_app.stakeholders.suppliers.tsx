import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/erp/DataTable";
import { PageHeader } from "@/components/erp/PageHeader";
import { StatusPill } from "@/components/erp/StatusPill";
import { createSupplierFn, getSuppliersFn } from "@/lib/api/domain";
import { setPartyStatusFn } from "@/lib/api/operations";
import { useTranslate } from "@/lib/i18n";

type Supplier = {
  id: number;
  code: string;
  name: string;
  contact?: string | null;
  phone?: string | null;
  email?: string | null;
  payable: number;
  status: string;
};

export const Route = createFileRoute("/_app/stakeholders/suppliers")({
  head: () => ({ meta: [{ title: "Suppliers — DeveleERP" }] }),
  loader: () => getSuppliersFn(),
  component: SuppliersPage,
});

const money = (value: number) => `TZS ${new Intl.NumberFormat("en-TZ").format(value)}`;

function SuppliersPage() {
  const { lang } = useTranslate();
  const loaded = Route.useLoaderData();
  const [suppliers, setSuppliers] = useState<Supplier[]>(loaded.data as Supplier[]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const result = await getSuppliersFn();
    setSuppliers(result.data as Supplier[]);
  }

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createSupplierFn({
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
      setError(cause instanceof Error ? cause.message : "Supplier could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(supplier: Supplier) {
    const status = supplier.status === "Active" ? "Inactive" : "Active";
    await setPartyStatusFn({ data: { party: "supplier", id: supplier.id, status } });
    setSuppliers((current) =>
      current.map((item) => (item.id === supplier.id ? { ...item, status } : item)),
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === "en" ? "Suppliers" : "Wauzaji"}
        description={
          lang === "en"
            ? "Supplier directory and outstanding purchase balances."
            : "Orodha ya wauzaji na madeni ya manunuzi."
        }
        actions={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4" /> New supplier
          </button>
        }
      />
      <DataTable
        data={suppliers}
        columns={[
          { key: "code", header: "Code" },
          { key: "name", header: "Supplier" },
          { key: "contact", header: "Contact" },
          { key: "phone", header: "Phone" },
          { key: "email", header: "Email" },
          {
            key: "payable",
            header: "Payable",
            align: "right",
            render: (row: Supplier) => money(row.payable),
          },
          {
            key: "status",
            header: "Status",
            render: (row: Supplier) => <StatusPill status={row.status} />,
          },
          {
            key: "action",
            header: "",
            render: (row: Supplier) => (
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
            <h2 className="text-lg font-bold">New supplier</h2>
            {error && (
              <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
                {error}
              </p>
            )}
            <Input label="Supplier name" value={name} setValue={setName} required />
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
