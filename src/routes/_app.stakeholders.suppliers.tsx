import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { GlassCard } from "@/components/erp/GlassCard";
import { StatusPill } from "@/components/erp/StatusPill";
import { suppliers, currency } from "@/lib/mock";
import { Plus, Upload } from "lucide-react";

export const Route = createFileRoute("/_app/stakeholders/suppliers")({
  head: () => ({ meta: [{ title: "Suppliers — Lumen ERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Suppliers" description="Vendors, payables, and supplier directory."
        actions={<button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md"><Plus className="h-4 w-4" />New Supplier</button>} />
      <TabbedPage tabs={[
        { key: "list", label: "Suppliers List", render: () => (
          <DataTable data={suppliers} columns={[
            { key: "id", header: "ID" }, { key: "name", header: "Vendor" },
            { key: "contact", header: "Contact" }, { key: "phone", header: "Phone" },
            { key: "payable", header: "Payable", align: "right", render: (r) => currency(r.payable) },
            { key: "status", header: "Status", render: (r) => <StatusPill status={r.status as string} /> },
          ]} />
        )},
        { key: "import", label: "Import Suppliers", render: () => (
          <GlassCard>
            <div className="rounded-2xl border-2 border-dashed border-white/60 bg-white/30 p-12 text-center">
              <Upload className="mx-auto h-10 w-10 text-emerald-500" />
              <h3 className="mt-3 text-base font-semibold">Upload supplier CSV</h3>
              <p className="mt-1 text-sm text-muted-foreground">Drag & drop, or browse to upload.</p>
            </div>
          </GlassCard>
        )},
      ]} />
    </div>
  ),
});
