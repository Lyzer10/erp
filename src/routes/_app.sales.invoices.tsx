import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { KpiCard } from "@/components/erp/KpiCard";
import { invoices, currency } from "@/lib/mock";
import { Plus, FileText, Receipt, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/sales/invoices")({
  head: () => ({ meta: [{ title: "Invoices — Lumen ERP" }] }),
  component: () => {
    const cols = [
      { key: "id", header: "Invoice #" },
      { key: "customer", header: "Customer" },
      { key: "date", header: "Date" },
      { key: "due", header: "Due" },
      { key: "amount", header: "Amount", align: "right" as const, render: (r: typeof invoices[0]) => <span className="font-semibold">{currency(r.amount)}</span> },
      { key: "status", header: "Status", render: (r: typeof invoices[0]) => <StatusPill status={r.status} /> },
    ];
    const byType = (t: string) => invoices.filter((i) => i.type === t);
    return (
      <div className="space-y-6">
        <PageHeader title="Invoices" description="Create and manage invoices, proformas, credit notes, and cash sales."
          actions={<>
            <button className="inline-flex items-center gap-2 rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm font-medium backdrop-blur hover:bg-white/80"><FileText className="h-4 w-4" />Merge Invoices</button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md"><Plus className="h-4 w-4" />Create Invoice</button>
          </>} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Total Issued" value={currency(invoices.reduce((s, i) => s + i.amount, 0))} icon={Receipt} tint="blue" />
          <KpiCard label="Paid" value={String(invoices.filter(i => i.status === "Paid").length)} icon={CheckCircle2} tint="emerald" />
          <KpiCard label="Pending" value={String(invoices.filter(i => i.status === "Pending").length)} icon={Clock} tint="amber" />
          <KpiCard label="Overdue" value={String(invoices.filter(i => i.status === "Overdue").length)} icon={Clock} tint="violet" />
        </div>
        <TabbedPage tabs={[
          { key: "all", label: "All Invoices", render: () => <DataTable data={byType("Invoice")} columns={cols} /> },
          { key: "proforma", label: "Proforma", render: () => <DataTable data={byType("Proforma")} columns={cols} /> },
          { key: "credit", label: "Credit Notes", render: () => <DataTable data={byType("Credit Note")} columns={cols} /> },
          { key: "cash", label: "Cash Sales", render: () => <DataTable data={byType("Cash Sale")} columns={cols} /> },
        ]} />
      </div>
    );
  },
});
