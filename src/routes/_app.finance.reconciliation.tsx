import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { GlassCard } from "@/components/erp/GlassCard";
import { currency } from "@/lib/mock";

export const Route = createFileRoute("/_app/finance/reconciliation")({
  head: () => ({ meta: [{ title: "Bank Reconciliation — Lumen ERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Bank Reconciliation" description="Match bank statements with ledger transactions." />
      <TabbedPage tabs={[
        { key: "prepare", label: "Prepare Reconciliation", render: () => (
          <GlassCard>
            <div className="grid gap-4 sm:grid-cols-3">
              <div><label className="text-xs font-medium text-muted-foreground">Bank Account</label>
                <select className="mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm"><option>KCB - 1234567890</option><option>Equity - 0998877665</option></select></div>
              <div><label className="text-xs font-medium text-muted-foreground">Statement Date</label><input type="date" className="mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm" /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Closing Balance</label><input type="number" className="mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm" placeholder="0.00" /></div>
            </div>
            <DataTable searchable={false} pageSize={20} data={Array.from({length:8},(_,i)=>({ date:`2026-06-${String(i+1).padStart(2,"0")}`, ref:`TXN-${100+i}`, desc:["Deposit","Withdrawal","Cheque","Transfer"][i%4], amount: 500+i*220, matched:i%2===0 }))}
              columns={[{ key:"date", header:"Date" }, { key:"ref", header:"Reference" }, { key:"desc", header:"Description" },
                { key:"amount", header:"Amount", align:"right", render:(r)=>currency(r.amount) },
                { key:"matched", header:"Match", render:(r)=>r.matched ? <span className="inline-flex items-center gap-1 text-emerald-600"><Check className="h-3.5 w-3.5" /> Matched</span> : <button className="text-blue-600 hover:underline">Match</button> }]} />
          </GlassCard>
        )},
        { key: "list", label: "Reconciliation List", render: () => (
          <DataTable data={Array.from({length:8},(_,i)=>({ id:`REC-${800+i}`, account:["KCB","Equity"][i%2], period:`May 2026`, prepared:"Aisha Otieno", diff: i*40, status:["Completed","Pending","Approved"][i%3] }))}
            columns={[{ key:"id", header:"Recon #" }, { key:"account", header:"Account" }, { key:"period", header:"Period" }, { key:"prepared", header:"Prepared By" },
              { key:"diff", header:"Difference", align:"right", render:(r)=>currency(r.diff) },
              { key:"status", header:"Status", render:(r)=><StatusPill status={r.status} /> }]} />
        )},
      ]} />
    </div>
  ),
});
