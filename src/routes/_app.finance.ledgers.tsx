import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { transactions, currency } from "@/lib/mock";
import { useTranslate } from "@/lib/i18n";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_app/finance/ledgers")({
  head: () => ({ meta: [{ title: "Ledgers — DeveleERP" }] }),
  component: LedgersPage,
});

function LedgersPage() {
  const { t, lang } = useTranslate();
  const [localTransactions, setLocalTransactions] = useState(transactions);

  // Modal form states
  const [journalOpen, setJournalOpen] = useState(false);
  const [drAccount, setDrAccount] = useState("Sales");
  const [crAccount, setCrAccount] = useState("Cash Account");
  const [txDate, setTxDate] = useState("2026-06-12");
  const [txDesc, setTxDesc] = useState("");
  const [txAmount, setTxAmount] = useState(0);

  const mockLedgers = [
    { name: lang === "en" ? "Sales" : "Mauzo", type: lang === "en" ? "Income/Expense" : "Mapato/Matumizi" },
    { name: lang === "en" ? "Purchases" : "Manunuzi", type: lang === "en" ? "Income/Expense" : "Mapato/Matumizi" },
    { name: lang === "en" ? "Salaries" : "Mishahara", type: lang === "en" ? "Expense" : "Matumizi" },
    { name: lang === "en" ? "Rent" : "Kodi ya Pango", type: lang === "en" ? "Expense" : "Matumizi" },
    { name: lang === "en" ? "Utilities" : "Huduma za Jamii", type: lang === "en" ? "Expense" : "Matumizi" },
  ].map((l, i) => ({
    code: `L-${100 + i}`,
    name: l.name,
    type: l.type,
    active: true
  }));

  const handleRecordJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount || !txDesc) return;

    const ref = `JV-${1000 + Math.floor(Math.random() * 9000)}`;

    const debitRow = {
      id: String(localTransactions.length + 1),
      date: txDate,
      account: drAccount,
      description: `${txDesc} (DR)`,
      debit: txAmount,
      credit: 0
    };

    const creditRow = {
      id: String(localTransactions.length + 2),
      date: txDate,
      account: crAccount,
      description: `${txDesc} (CR)`,
      debit: 0,
      credit: txAmount
    };

    setLocalTransactions(prev => [debitRow, creditRow, ...prev]);
    setJournalOpen(false);

    // Reset Form
    setTxDesc("");
    setTxAmount(0);
    setTxDate("2026-06-12");
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t("ledgers")} 
        description={lang === "en" ? "Journal entries, general ledger, and ledger registration." : "Kumbukumbu za jarida, kitabu kikuu cha mahesabu, na usajili wa daftari."}
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button
              onClick={() => setJournalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              {lang === "en" ? "Record Journal" : "Weka Ingizo la Jarida"}
            </button>
          </div>
        } 
      />
      <TabbedPage tabs={[
        { key: "record", label: lang === "en" ? "Record DR/CR" : "Sajili DR/CR", render: () => (
          <DataTable data={localTransactions.slice(0, 12)} columns={[
            { key: "date", header: lang === "en" ? "Date" : "Tarehe" }, 
            { key: "id", header: lang === "en" ? "Ref" : "Kumbukumbu" },
            { key: "account", header: lang === "en" ? "Account" : "Akaunti" }, 
            { key: "description", header: lang === "en" ? "Description" : "Maelezo" },
            { key: "debit", header: lang === "en" ? "Debit" : "Deni", align: "right", render: (r: any) => r.debit ? currency(r.debit) : "—" },
            { key: "credit", header: lang === "en" ? "Credit" : "Mkopo", align: "right", render: (r: any) => r.credit ? currency(r.credit) : "—" },
          ]} />
        )},
        { key: "journal", label: lang === "en" ? "Journal Entries" : "Kumbukumbu za Jarida", render: () => (
          <DataTable data={localTransactions.slice(0, 15)} columns={[
            { key: "id", header: lang === "en" ? "Journal #" : "Jarida #" }, 
            { key: "date", header: lang === "en" ? "Date" : "Tarehe" },
            { key: "account", header: lang === "en" ? "Account" : "Akaunti" }, 
            { key: "description", header: lang === "en" ? "Memo" : "Kumbukumbu" },
            { key: "debit", header: "DR", align: "right", render: (r: any) => r.debit ? currency(r.debit) : "—" },
            { key: "credit", header: "CR", align: "right", render: (r: any) => r.credit ? currency(r.credit) : "—" },
          ]} />
        )},
        { key: "general", label: lang === "en" ? "General Ledger" : "Daftari Kuu (Ledger)", render: () => (
          <DataTable data={localTransactions} columns={[
            { key: "date", header: lang === "en" ? "Date" : "Tarehe" }, 
            { key: "account", header: lang === "en" ? "Account" : "Akaunti" }, 
            { key: "description", header: lang === "en" ? "Description" : "Maelezo" },
            { key: "debit", header: "DR", align: "right", render: (r: any) => r.debit ? currency(r.debit) : "—" },
            { key: "credit", header: "CR", align: "right", render: (r: any) => r.credit ? currency(r.credit) : "—" },
          ]} />
        )},
        { key: "register", label: lang === "en" ? "Register Ledger" : "Sajili Daftari", render: () => (
          <DataTable data={mockLedgers}
            columns={[
              { key: "code", header: lang === "en" ? "Code" : "Msimbo" }, 
              { key: "name", header: lang === "en" ? "Ledger" : "Daftari" }, 
              { key: "type", header: lang === "en" ? "Type" : "Aina" },
              { key: "active", header: lang === "en" ? "Status" : "Hali", render: (r: any) => r.active ? (lang === "en" ? "Active" : "Hai") : (lang === "en" ? "Inactive" : "Siyo Hai") }
            ]} 
          />
        )},
      ]} />

      {/* Record Journal Entry Dialog */}
      <Dialog open={journalOpen} onOpenChange={setJournalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {lang === "en" ? "Record Double-Entry Journal Transaction" : "Weka Ingizo la Jarida la Pande Mbili"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRecordJournal} className="space-y-4 text-sm mt-2">
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {lang === "en" ? "Debit (DR) Account" : "Akaunti ya Deni (DR)"}
                </label>
                <select
                  value={drAccount}
                  onChange={(e) => setDrAccount(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Sales">{lang === "en" ? "Sales (Income)" : "Mauzo (Mapato)"}</option>
                  <option value="Purchases">{lang === "en" ? "Purchases (Expense)" : "Manunuzi (Matumizi)"}</option>
                  <option value="Salaries">{lang === "en" ? "Salaries (Expense)" : "Mishahara (Matumizi)"}</option>
                  <option value="Rent">{lang === "en" ? "Rent (Expense)" : "Kodi ya Pango (Matumizi)"}</option>
                  <option value="Utilities">{lang === "en" ? "Utilities (Expense)" : "Huduma (Matumizi)"}</option>
                  <option value="Cash Account">{lang === "en" ? "Main Till (Cash)" : "Sajili ya Fedha (Taslimu)"}</option>
                  <option value="NMB Depima Technology">{lang === "en" ? "Bank Account (NMB)" : "Akaunti ya Benki (NMB)"}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {lang === "en" ? "Credit (CR) Account" : "Akaunti ya Mkopo (CR)"}
                </label>
                <select
                  value={crAccount}
                  onChange={(e) => setCrAccount(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Cash Account">{lang === "en" ? "Main Till (Cash)" : "Sajili ya Fedha (Taslimu)"}</option>
                  <option value="NMB Depima Technology">{lang === "en" ? "Bank Account (NMB)" : "Akaunti ya Benki (NMB)"}</option>
                  <option value="Sales">{lang === "en" ? "Sales (Income)" : "Mauzo (Mapato)"}</option>
                  <option value="Purchases">{lang === "en" ? "Purchases (Expense)" : "Manunuzi (Matumizi)"}</option>
                  <option value="Salaries">{lang === "en" ? "Salaries (Expense)" : "Mishahara (Matumizi)"}</option>
                  <option value="Rent">{lang === "en" ? "Rent (Expense)" : "Kodi ya Pango (Matumizi)"}</option>
                  <option value="Utilities">{lang === "en" ? "Utilities (Expense)" : "Huduma (Matumizi)"}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {lang === "en" ? "Transaction Date" : "Tarehe ya Gonga"}
                </label>
                <input
                  type="date"
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {lang === "en" ? "Amount (TZS)" : "Kiasi (TZS)"}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={txAmount}
                  onChange={(e) => setTxAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {lang === "en" ? "Memo / Description" : "Maelezo ya Kumbukumbu"}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Monthly internet service payment"
                value={txDesc}
                onChange={(e) => setTxDesc(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setJournalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                {lang === "en" ? "Cancel" : "Ghairi"}
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 cursor-pointer"
              >
                {lang === "en" ? "Record Transaction" : "Weka Kumbukumbu"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
