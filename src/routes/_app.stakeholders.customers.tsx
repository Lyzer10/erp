import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { GlassCard } from "@/components/erp/GlassCard";
import { StatusPill } from "@/components/erp/StatusPill";
import { customers, currency } from "@/lib/mock";
import { Plus, Upload, Download } from "lucide-react";

export const Route = createFileRoute("/_app/stakeholders/customers")({
  head: () => ({ meta: [{ title: "Customers — Lumen ERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Customers" description="Manage your customer relationships, advances, and imports."
        actions={<>
          <button className="inline-flex items-center gap-2 rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm font-medium backdrop-blur hover:bg-white/80"><Download className="h-4 w-4" />Export</button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md"><Plus className="h-4 w-4" />New Customer</button>
        </>}
      />
      <TabbedPage tabs={[
        { key: "list", label: "Customers List", render: () => (
          <DataTable data={customers} columns={[
            { key: "id", header: "ID" },
            { key: "name", header: "Company" },
            { key: "contact", header: "Contact" },
            { key: "email", header: "Email" },
            { key: "balance", header: "Balance", align: "right", render: (r) => <span className={r.balance < 0 ? "text-rose-600" : ""}>{currency(r.balance)}</span> },
            { key: "status", header: "Status", render: (r) => <StatusPill status={r.status as string} /> },
          ]} />
        )},
        { key: "advance", label: "Customer Advances", render: () => (
          <DataTable data={customers.filter((_, i) => i % 3 === 0).map((c) => ({ ...c, advance: Math.round(Math.random() * 8000) }))} columns={[
            { key: "id", header: "ID" }, { key: "name", header: "Customer" },
            { key: "advance", header: "Advance Paid", align: "right", render: (r) => currency(r.advance) },
            { key: "createdAt", header: "Date" },
          ]} />
        )},
        { key: "import", label: "Import Customers", render: () => (
          <GlassCard>
            <div className="rounded-2xl border-2 border-dashed border-white/60 bg-white/30 p-12 text-center">
              <Upload className="mx-auto h-10 w-10 text-blue-500" />
              <h3 className="mt-3 text-base font-semibold">Drop your CSV file here</h3>
              <p className="mt-1 text-sm text-muted-foreground">or click to browse. Use our template to ensure correct mapping.</p>
              <button className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white">Download Template</button>
            </div>
          </GlassCard>
        )},
      ]} />
    </div>
  ),
});
