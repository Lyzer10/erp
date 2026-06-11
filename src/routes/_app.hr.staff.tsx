import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { GlassCard } from "@/components/erp/GlassCard";
import { staff, currency } from "@/lib/mock";
import { Plus, Upload } from "lucide-react";

export const Route = createFileRoute("/_app/hr/staff")({
  head: () => ({ meta: [{ title: "Staff — Lumen ERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Staff" description="Employee directory, attendance, and bulk uploads."
        actions={<button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md"><Plus className="h-4 w-4" />Add Staff</button>} />
      <TabbedPage tabs={[
        { key: "list", label: "Staff List", render: () => (
          <DataTable data={staff} columns={[
            { key: "id", header: "ID" }, { key: "name", header: "Name" },
            { key: "department", header: "Department" }, { key: "role", header: "Role" },
            { key: "salary", header: "Salary", align: "right", render: (r) => currency(r.salary) },
            { key: "joined", header: "Joined" },
            { key: "status", header: "Status", render: (r) => <StatusPill status={r.status} /> },
          ]} />
        )},
        { key: "attendance", label: "Attendance", render: () => (
          <DataTable data={staff.slice(0, 12).map((s) => ({ id: s.id, name: s.name, checkin: "08:12", checkout: "17:05", hours: 8.9, status: "Present" }))}
            columns={[{ key: "id", header: "ID" }, { key: "name", header: "Employee" },
              { key: "checkin", header: "Check-in" }, { key: "checkout", header: "Check-out" },
              { key: "hours", header: "Hours", align: "right" }, { key: "status", header: "Status" }]} />
        )},
        { key: "upload", label: "Upload Staff", render: () => (
          <GlassCard>
            <div className="rounded-2xl border-2 border-dashed border-white/60 bg-white/30 p-12 text-center">
              <Upload className="mx-auto h-10 w-10 text-blue-500" />
              <h3 className="mt-3 text-base font-semibold">Bulk upload staff records</h3>
              <p className="mt-1 text-sm text-muted-foreground">Drag a CSV or Excel file here, or click to browse.</p>
            </div>
          </GlassCard>
        )},
      ]} />
    </div>
  ),
});
