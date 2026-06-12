import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { currency } from "@/lib/mock";
import { Plus } from "lucide-react";

const vouchers = Array.from({ length: 15 }, (_, i) => ({
  id: `PV-${7000 + i}`,
  payee: ["Acme Trading","KCB Bank","Office Supplies Co","Skyline Holdings","Cobalt Hardware"][i%5],
  date: new Date(Date.now() - i*86400000*2).toISOString().slice(0,10),
  account: ["Cash","Bank - KCB","Bank - Equity"][i%3],
  amount: Math.round(Math.random()*8000 + 200),
  status: ["Approved","Pending","Approved","Rejected"][i%4],
}));

export const Route = createFileRoute("/_app/finance/payment-vouchers")({
  head: () => ({ meta: [{ title: "Payment Vouchers — DeveleERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Payment Vouchers" description="Authorize and track outgoing payments."
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition"><Plus className="h-4 w-4" />New Voucher</button>
          </div>
        } />
      <DataTable data={vouchers} columns={[
        { key: "id", header: "Voucher #" }, { key: "payee", header: "Payee" },
        { key: "account", header: "Account" }, { key: "date", header: "Date" },
        { key: "amount", header: "Amount", align: "right", render: (r) => currency(r.amount) },
        { key: "status", header: "Status", render: (r) => <StatusPill status={r.status} /> },
      ]} />
    </div>
  ),
});
