import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { payrollRuns, currency } from "@/lib/mock";
import { Play } from "lucide-react";

export const Route = createFileRoute("/_app/hr/payroll")({
  head: () => ({ meta: [{ title: "Payroll — Lumen ERP" }] }),
  component: () => {
    const cols = [
      { key: "id", header: "Run #" }, { key: "period", header: "Period" },
      { key: "employees", header: "Employees", align: "right" as const },
      { key: "gross", header: "Gross", align: "right" as const, render: (r: typeof payrollRuns[0]) => currency(r.gross) },
      { key: "net", header: "Net", align: "right" as const, render: (r: typeof payrollRuns[0]) => currency(r.net) },
      { key: "status", header: "Status", render: (r: typeof payrollRuns[0]) => <StatusPill status={r.status} /> },
    ];
    return (
      <div className="space-y-6">
        <PageHeader title="Payroll Management" description="Prepare, approve, and complete payroll cycles."
          actions={<button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md"><Play className="h-4 w-4" />Run Payroll</button>} />
        <TabbedPage tabs={[
          { key: "prepare", label: "Prepare", render: () => <DataTable data={payrollRuns.filter(p=>p.status==="Prepared")} columns={cols} /> },
          { key: "approved", label: "Approved", render: () => <DataTable data={payrollRuns.filter(p=>p.status==="Approved")} columns={cols} /> },
          { key: "completed", label: "Completed", render: () => <DataTable data={payrollRuns.filter(p=>p.status==="Completed")} columns={cols} /> },
          { key: "rejected", label: "Rejected", render: () => <DataTable data={payrollRuns.filter(p=>p.status==="Rejected")} columns={cols} /> },
        ]} />
      </div>
    );
  },
});
