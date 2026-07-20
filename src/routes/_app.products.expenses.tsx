import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { expenses as initialExpenses, currency } from "@/lib/mock";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslate } from "@/lib/i18n";
import { getExpensesFn } from "@/lib/api/domain";

type Expense = {
  id: string;
  category: string;
  vendor: string;
  date: string;
  amount: number;
  status: string;
  description?: string;
};

type Category = {
  code: string;
  name: string;
  count: number;
  total: number;
};

export const Route = createFileRoute("/_app/products/expenses")({
  head: () => ({ meta: [{ title: "Expenses — DeveleERP" }] }),
  loader: () => getExpensesFn(),
  component: ExpensesPage,
});

const CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  Rent: { en: "Rent", sw: "Kodi" },
  Utilities: { en: "Utilities", sw: "Huduma" },
  Salaries: { en: "Salaries", sw: "Mishahara" },
  Marketing: { en: "Marketing", sw: "Masoko" },
  Travel: { en: "Travel", sw: "Safari" },
  "Office Supplies": { en: "Office Supplies", sw: "Vifaa vya Ofisi" },
  Office: { en: "Office", sw: "Ofisi" },
  Maintenance: { en: "Maintenance", sw: "Ukarabati" },
  Other: { en: "Other", sw: "Nyingine" },
};

function ExpensesPage() {
  const initialExpensesData = Route.useLoaderData();
  const { lang, t } = useTranslate();
  const expensesData = (initialExpensesData as any)?.data || initialExpensesData;
  const [expenseList, setExpenseList] = useState<Expense[]>(
    ((expensesData as Expense[]) || initialExpenses).map(e => ({
      id: e.id,
      category: e.category,
      vendor: e.vendor,
      date: e.date,
      amount: e.amount,
      status: e.status,
    }))
  );

  const [categoriesList, setCategoriesList] = useState<Category[]>([
    { code: "EC-10", name: "Rent", count: 4, total: 4500 },
    { code: "EC-11", name: "Utilities", count: 3, total: 1800 },
    { code: "EC-12", name: "Salaries", count: 6, total: 14200 },
    { code: "EC-13", name: "Marketing", count: 2, total: 2400 },
    { code: "EC-14", name: "Travel", count: 5, total: 1150 },
    { code: "EC-15", name: "Office Supplies", count: 3, total: 850 },
  ]);

  const [expenseOpen, setExpenseOpen] = useState(false);

  const handleCreateExpense = (newExpense: Omit<Expense, "id" | "date" | "status">) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const nextId = `EXP-${6000 + expenseList.length + 1}`;

    const addedExpense: Expense = {
      id: nextId,
      date: dateStr,
      status: "Pending",
      ...newExpense,
    };

    setExpenseList(prev => [addedExpense, ...prev]);

    // Reactively update expense categories spend and count
    setCategoriesList(prev =>
      prev.map(c =>
        c.name.toLowerCase() === newExpense.category.toLowerCase()
          ? { ...c, count: c.count + 1, total: c.total + newExpense.amount }
          : c
      )
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("expenses")}
        description={lang === "en" ? "Categorize and register company expenses." : "Panga katika makundi na kusajili matumizi ya kampuni."}
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button
              onClick={() => setExpenseOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition animate-fade-in"
            >
              <Plus className="h-4 w-4" /> {t("registerExpense")}
            </button>
          </div>
        }
      />
      <TabbedPage tabs={[
        {
          key: "categories",
          label: lang === "en" ? "Categories" : "Makundi ya Matumizi",
          render: () => (
            <DataTable
              data={categoriesList}
              columns={[
                { key: "code", header: t("code") },
                { key: "name", header: t("category"), render: (r) => CATEGORY_TRANSLATIONS[r.name]?.[lang] || r.name },
                { key: "count", header: t("entries"), align: "right" },
                { key: "total", header: t("totalSpend"), align: "right", render: (r) => `TZS ${currency(r.total).replace("$", "")}` },
              ]}
            />
          )
        },
        {
          key: "register",
          label: lang === "en" ? "Registered Expenses" : "Matumizi Yaliyosajiliwa",
          render: () => (
            <DataTable
              data={expenseList}
              columns={[
                { key: "id", header: "ID" },
                { key: "category", header: t("category"), render: (r) => CATEGORY_TRANSLATIONS[r.category]?.[lang] || r.category },
                { key: "vendor", header: lang === "en" ? "Vendor" : "Muuzaji / Mlipwaji" },
                { key: "date", header: t("date") },
                { key: "amount", header: lang === "en" ? "Amount" : "Kiasi", align: "right", render: (r) => `TZS ${currency(r.amount).replace("$", "")}` },
                { key: "status", header: t("status"), render: (r) => <StatusPill status={r.status} /> },
              ]}
            />
          )
        },
      ]} />

      <CreateExpenseDialog
        open={expenseOpen}
        onOpenChange={setExpenseOpen}
        onSubmit={handleCreateExpense}
        categories={categoriesList}
      />
    </div>
  );
}

// --- Create Expense Dialog ---

interface CreateExpenseDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (data: Omit<Expense, "id" | "date" | "status">) => void;
  readonly categories: Category[];
}

function CreateExpenseDialog({ open, onOpenChange, onSubmit, categories }: CreateExpenseDialogProps) {
  const { lang, t } = useTranslate();
  const [category, setCategory] = useState(categories[0]?.name || "Office Supplies");
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor || !amount) return;
    onSubmit({ category, vendor, amount, description });
    setCategory(categories[0]?.name || "Office Supplies");
    setVendor("");
    setAmount(0);
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
        <DialogHeader className="border-b border-slate-100 pb-3 mb-4">
          <DialogTitle className="text-base font-bold text-slate-900">{t("registerExpense")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {lang === "en" ? "Expense Category" : "Kundi la Matumizi"}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            >
              {categories.map(c => (
                <option key={c.code} value={c.name}>{CATEGORY_TRANSLATIONS[c.name]?.[lang] || c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {lang === "en" ? "Vendor / Payee Name" : "Jina la Muuzaji / Mlipaji"}
            </label>
            <input
              required
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder={lang === "en" ? "e.g. NMB Bank, Tanesco, Acme Corp" : "mf. Benki ya NMB, Tanesco, Acme Corp"}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {lang === "en" ? "Amount (TZS)" : "Kiasi (TZS)"}
            </label>
            <input
              required
              type="number"
              min={0.01}
              step="0.01"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {lang === "en" ? "Notes / Description" : "Maelezo / Vidokezo"}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={lang === "en" ? "Provide detailed notes..." : "Weka maelezo ya kina..."}
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-600 transition"
            >
              {t("registerExpense")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
