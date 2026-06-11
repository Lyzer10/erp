import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { transactions, currency } from "@/lib/mock";

export const Route = createFileRoute("/_app/finance/ledgers")({
  head: () => ({ meta: [{ title: "Ledgers — Lumen ERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Ledgers" description="Journal entries, general ledger, and ledger registration." />
      <TabbedPage tabs={[
        { key: "record", label: "Record DR/CR", render: () => (
          <DataTable data={transactions.slice(0, 12)} columns={[
            { key: "date", header: "Date" }, { key: "id", header: "Ref" },
            { key: "account", header: "Account" }, { key: "description", header: "Description" },
            { key: "debit", header: "Debit", align: "right", render: (r) => r.debit ? currency(r.debit) : "—" },
            { key: "credit", header: "Credit", align: "right", render: (r) => r.credit ? currency(r.credit) : "—" },
          ]} />
        )},
        { key: "journal", label: "Journal Entries", render: () => (
          <DataTable data={transactions.slice(0, 15)} columns={[
            { key: "id", header: "Journal #" }, { key: "date", header: "Date" },
            { key: "account", header: "Account" }, { key: "description", header: "Memo" },
            { key: "debit", header: "DR", align: "right", render: (r) => r.debit ? currency(r.debit) : "—" },
            { key: "credit", header: "CR", align: "right", render: (r) => r.credit ? currency(r.credit) : "—" },
          ]} />
        )},
        { key: "general", label: "General Ledger", render: () => (
          <DataTable data={transactions} columns={[
            { key: "date", header: "Date" }, { key: "account", header: "Account" }, { key: "description", header: "Description" },
            { key: "debit", header: "DR", align: "right", render: (r) => r.debit ? currency(r.debit) : "—" },
            { key: "credit", header: "CR", align: "right", render: (r) => r.credit ? currency(r.credit) : "—" },
          ]} />
        )},
        { key: "register", label: "Register Ledger", render: () => (
          <DataTable data={["Sales","Purchases","Salaries","Rent","Utilities"].map((l, i) => ({ code: `L-${100+i}`, name: l, type: i<2?"Income/Expense":"Expense", active: true }))}
            columns={[{ key: "code", header: "Code" }, { key: "name", header: "Ledger" }, { key: "type", header: "Type" },
              { key: "active", header: "Status", render: (r) => r.active ? "Active" : "Inactive" }]} />
        )},
      ]} />
    </div>
  ),
});
