import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { expenses, currency } from "@/lib/mock";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_app/products/expenses")({
  head: () => ({ meta: [{ title: "Expenses — Lumen ERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Expenses" description="Categorize and register company expenses."
        actions={<button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md"><Plus className="h-4 w-4" />Register Expense</button>} />
      <TabbedPage tabs={[
        { key: "categories", label: "Categories", render: () => (
          <DataTable data={["Rent","Utilities","Salaries","Marketing","Travel","Office Supplies"].map((c, k) => ({ code: `EC-${10+k}`, name: c, count: 3+k, total: 1200 + k*900 }))}
            columns={[
              { key: "code", header: "Code" }, { key: "name", header: "Category" },
              { key: "count", header: "Entries", align: "right" },
              { key: "total", header: "Total Spend", align: "right", render: (r) => currency(r.total) },
            ]} />
        )},
        { key: "register", label: "Registered Expenses", render: () => (
          <DataTable data={expenses} columns={[
            { key: "id", header: "ID" }, { key: "category", header: "Category" },
            { key: "vendor", header: "Vendor" }, { key: "date", header: "Date" },
            { key: "amount", header: "Amount", align: "right", render: (r) => currency(r.amount) },
            { key: "status", header: "Status", render: (r) => <StatusPill status={r.status} /> },
          ]} />
        )},
      ]} />
    </div>
  ),
});
