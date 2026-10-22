import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/erp/DataTable";
import { PageHeader } from "@/components/erp/PageHeader";
import { StatusPill } from "@/components/erp/StatusPill";
import { getExpensesFn } from "@/lib/api/domain";
import { createExpenseFn } from "@/lib/api/operations";
import { useTranslate } from "@/lib/i18n";

type Expense = {
  id: number;
  code: string;
  category: string;
  vendor: string;
  date: string;
  amount: number;
  status: string;
};

export const Route = createFileRoute("/_app/products/expenses")({
  head: () => ({ meta: [{ title: "Expenses — DeveleERP" }] }),
  loader: () => getExpensesFn(),
  component: ExpensesPage,
});

const categories = [
  "Rent",
  "Utilities",
  "Salaries",
  "Transport",
  "Maintenance",
  "Office Supplies",
  "Other",
];
const money = (value: number) => `TZS ${new Intl.NumberFormat("en-TZ").format(value)}`;

function ExpensesPage() {
  const { lang } = useTranslate();
  const loaded = Route.useLoaderData();
  const [expenses, setExpenses] = useState<Expense[]>(loaded.data as Expense[]);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summary = useMemo(
    () =>
      Array.from(new Set(expenses.map((expense) => expense.category))).map((name) => {
        const rows = expenses.filter((expense) => expense.category === name);
        return {
          name,
          entries: rows.length,
          total: rows.reduce((sum, row) => sum + row.amount, 0),
        };
      }),
    [expenses],
  );

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const result = await createExpenseFn({ data: { category, vendor, amount, date } });
      setExpenses((current) => [result as Expense, ...current]);
      setOpen(false);
      setVendor("");
      setAmount(0);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Expense could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === "en" ? "Expenses" : "Matumizi"}
        description={
          lang === "en"
            ? "Approved operating expenses used by the live dashboard and reports."
            : "Matumizi yaliyothibitishwa yanayotumika kwenye ripoti."
        }
        actions={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4" /> Register expense
          </button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {summary.map((item) => (
          <div key={item.name} className="glass-card p-4">
            <p className="text-xs uppercase text-muted-foreground">
              {item.name} · {item.entries}
            </p>
            <p className="mt-1 text-lg font-black">{money(item.total)}</p>
          </div>
        ))}
      </div>
      <DataTable
        data={expenses}
        columns={[
          { key: "code", header: "Reference" },
          { key: "date", header: "Date" },
          { key: "category", header: "Category" },
          { key: "vendor", header: "Payee" },
          {
            key: "amount",
            header: "Amount",
            align: "right",
            render: (row: Expense) => money(row.amount),
          },
          {
            key: "status",
            header: "Status",
            render: (row: Expense) => <StatusPill status={row.status} />,
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
            className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6"
          >
            <h2 className="text-lg font-bold">Register expense</h2>
            {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
            <label className="block text-sm font-semibold">
              Category
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="input-field mt-1"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Payee
              <input
                required
                value={vendor}
                onChange={(event) => setVendor(event.target.value)}
                className="input-field mt-1"
              />
            </label>
            <label className="block text-sm font-semibold">
              Amount (TZS)
              <input
                required
                min={1}
                type="number"
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
                className="input-field mt-1"
              />
            </label>
            <label className="block text-sm font-semibold">
              Date
              <input
                required
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="input-field mt-1"
              />
            </label>
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
