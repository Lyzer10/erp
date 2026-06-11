import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { GlassCard } from "@/components/erp/GlassCard";
import { Plus, KeyRound } from "lucide-react";

export const Route = createFileRoute("/_app/admin/users")({
  head: () => ({ meta: [{ title: "Users — Lumen ERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Users & Access" description="Manage users, departments, and password resets."
        actions={<button className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md"><Plus className="h-4 w-4" />Add User</button>} />
      <TabbedPage tabs={[
        { key: "users", label: "Users List", render: () => (
          <DataTable data={Array.from({length:12},(_,i)=>({ id:`U-${1000+i}`, name:["Aisha Otieno","John Mwangi","Maria Banda","David Kumar"][i%4], email:`user${i}@lumen.co`, role:["Admin","Manager","Cashier","Accountant"][i%4], department:["IT","Sales","Finance","HR"][i%4], status:["Active","Active","Inactive"][i%3] }))}
            columns={[{ key:"id", header:"ID" }, { key:"name", header:"Name" }, { key:"email", header:"Email" },
              { key:"role", header:"Role" }, { key:"department", header:"Department" },
              { key:"status", header:"Status", render:(r)=><StatusPill status={r.status} /> }]} />
        )},
        { key: "departments", label: "Departments", render: () => (
          <DataTable data={["Sales","Finance","HR","Operations","IT","Warehouse"].map((d, i) => ({ code:`DPT-${10+i}`, name:d, head:["Aisha","John","Maria","David","Peter","Grace"][i], members:4+i*2 }))}
            columns={[{ key:"code", header:"Code" }, { key:"name", header:"Department" }, { key:"head", header:"Head" }, { key:"members", header:"Members", align:"right" }]} />
        )},
        { key: "reset", label: "Reset Password", render: () => (
          <GlassCard className="max-w-md">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-blue-500/20 to-emerald-500/10">
              <KeyRound className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-3 text-lg font-semibold">Reset User Password</h3>
            <p className="mt-1 text-sm text-muted-foreground">Select a user and send them a temporary password.</p>
            <div className="mt-4 space-y-3">
              <select className="w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm"><option>Select user...</option><option>John Mwangi</option><option>Maria Banda</option></select>
              <button className="w-full rounded-lg bg-linear-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md">Send Reset Link</button>
            </div>
          </GlassCard>
        )},
      ]} />
    </div>
  ),
});
