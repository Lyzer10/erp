import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { transactions, currency } from "@/lib/mock";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/_app/finance/ledgers")({
  head: () => ({ meta: [{ title: "Ledgers — DeveleERP" }] }),
  component: LedgersPage,
});

function LedgersPage() {
  const { t, lang } = useTranslate();

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

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t("ledgers")} 
        description={lang === "en" ? "Journal entries, general ledger, and ledger registration." : "Kumbukumbu za jarida, kitabu kikuu cha mahesabu, na usajili wa daftari."}
        actions={<ExportMenu />} 
      />
      <TabbedPage tabs={[
        { key: "record", label: lang === "en" ? "Record DR/CR" : "Sajili DR/CR", render: () => (
          <DataTable data={transactions.slice(0, 12)} columns={[
            { key: "date", header: lang === "en" ? "Date" : "Tarehe" }, 
            { key: "id", header: lang === "en" ? "Ref" : "Kumbukumbu" },
            { key: "account", header: lang === "en" ? "Account" : "Akaunti" }, 
            { key: "description", header: lang === "en" ? "Description" : "Maelezo" },
            { key: "debit", header: lang === "en" ? "Debit" : "Deni", align: "right", render: (r) => r.debit ? currency(r.debit) : "—" },
            { key: "credit", header: lang === "en" ? "Credit" : "Mkopo", align: "right", render: (r) => r.credit ? currency(r.credit) : "—" },
          ]} />
        )},
        { key: "journal", label: lang === "en" ? "Journal Entries" : "Kumbukumbu za Jarida", render: () => (
          <DataTable data={transactions.slice(0, 15)} columns={[
            { key: "id", header: lang === "en" ? "Journal #" : "Jarida #" }, 
            { key: "date", header: lang === "en" ? "Date" : "Tarehe" },
            { key: "account", header: lang === "en" ? "Account" : "Akaunti" }, 
            { key: "description", header: lang === "en" ? "Memo" : "Kumbukumbu" },
            { key: "debit", header: "DR", align: "right", render: (r) => r.debit ? currency(r.debit) : "—" },
            { key: "credit", header: "CR", align: "right", render: (r) => r.credit ? currency(r.credit) : "—" },
          ]} />
        )},
        { key: "general", label: lang === "en" ? "General Ledger" : "Daftari Kuu (Ledger)", render: () => (
          <DataTable data={transactions} columns={[
            { key: "date", header: lang === "en" ? "Date" : "Tarehe" }, 
            { key: "account", header: lang === "en" ? "Account" : "Akaunti" }, 
            { key: "description", header: lang === "en" ? "Description" : "Maelezo" },
            { key: "debit", header: "DR", align: "right", render: (r) => r.debit ? currency(r.debit) : "—" },
            { key: "credit", header: "CR", align: "right", render: (r) => r.credit ? currency(r.credit) : "—" },
          ]} />
        )},
        { key: "register", label: lang === "en" ? "Register Ledger" : "Sajili Daftari", render: () => (
          <DataTable data={mockLedgers}
            columns={[
              { key: "code", header: lang === "en" ? "Code" : "Msimbo" }, 
              { key: "name", header: lang === "en" ? "Ledger" : "Daftari" }, 
              { key: "type", header: lang === "en" ? "Type" : "Aina" },
              { key: "active", header: lang === "en" ? "Status" : "Hali", render: (r) => r.active ? (lang === "en" ? "Active" : "Hai") : (lang === "en" ? "Inactive" : "Siyo Hai") }
            ]} 
          />
        )},
      ]} />
    </div>
  );
}
