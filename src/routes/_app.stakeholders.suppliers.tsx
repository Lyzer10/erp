import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/erp/DataTable";
import { PageHeader } from "@/components/erp/PageHeader";
import { StatusPill } from "@/components/erp/StatusPill";
import { createSupplierFn, getSuppliersFn, updateSupplierFn } from "@/lib/api/domain";
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
  const { lang, t } = useTranslate();
  const loaded = Route.useLoaderData();
  const [suppliers, setSuppliers] = useState<Supplier[]>(loaded.data as Supplier[]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
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

  function openNew() {
    setEditingId(null);
    setName("");
    setContact("");
    setPhone("");
    setEmail("");
    setError(null);
    setOpen(true);
  }

  function openEdit(supplier: Supplier) {
    setEditingId(supplier.id);
    setName(supplier.name);
    setContact(supplier.contact || "");
    setPhone(supplier.phone || "");
    setEmail(supplier.email || "");
    setError(null);
    setOpen(true);
  }

  function closeForm() {
    setOpen(false);
    setEditingId(null);
    setError(null);
  }

  async function saveSupplier(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const data = {
        name,
        contact: contact || undefined,
        phone: phone || undefined,
        email: email || undefined,
      };
      if (editingId) await updateSupplierFn({ data: { id: editingId, ...data } });
      else await createSupplierFn({ data });
      await refresh();
      closeForm();
      setName("");
      setContact("");
      setPhone("");
      setEmail("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("supplierCouldNotBeSaved"));
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
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4" /> {t("newSupplier")}
          </button>
        }
      />
      <DataTable
        data={suppliers}
        columns={[
          { key: "code", header: t("code") },
          { key: "name", header: t("supplier") },
          { key: "contact", header: t("contactPerson") },
          { key: "phone", header: t("phone") },
          { key: "email", header: t("email") },
          {
            key: "payable",
            header: t("payable"),
            align: "right",
            render: (row: Supplier) => money(row.payable),
          },
          {
            key: "status",
            header: t("status"),
            render: (row: Supplier) => <StatusPill status={row.status} />,
          },
          {
            key: "action",
            header: "",
            render: (row: Supplier) => (
              <div className="flex gap-1">
                {loaded.canEdit && (
                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#087b69] hover:bg-emerald-50"
                  >
                    <Pencil className="h-3.5 w-3.5" /> {t("edit")}
                  </button>
                )}
                <button
                  onClick={() => toggle(row)}
                  className="rounded-lg border px-3 py-1 text-xs font-bold"
                >
                  {row.status === "Active" ? t("deactivate") : t("activate")}
                </button>
              </div>
            ),
          },
        ]}
      />
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"
          onMouseDown={closeForm}
        >
          <form
            onSubmit={saveSupplier}
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 className="text-lg font-bold">
              {editingId ? t("editSupplier") : t("newSupplier")}
            </h2>
            {error && (
              <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
                {error}
              </p>
            )}
            <Input label={t("supplierName")} value={name} setValue={setName} required />
            <Input label={t("contactPerson")} value={contact} setValue={setContact} />
            <Input label={t("phone")} value={phone} setValue={setPhone} />
            <Input label={t("email")} value={email} setValue={setEmail} type="email" />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border px-4 py-2 text-sm font-semibold"
              >
                {t("cancel")}
              </button>
              <button
                disabled={saving}
                className="rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-semibold text-white"
              >
                {saving ? t("saving") : editingId ? t("saveChanges") : t("save")}
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
