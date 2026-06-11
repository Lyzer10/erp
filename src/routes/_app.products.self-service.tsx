import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { currency } from "@/lib/mock";

export const Route = createFileRoute("/_app/products/self-service")({
  head: () => ({ meta: [{ title: "Employee Self Service — DeveleERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Employee Self Service" description="Request payments, leave, and view payslips."
        actions={<ExportMenu />} />
      <TabbedPage tabs={[
        { key: "payments", label: "Request Payments", render: () => (
          <DataTable data={Array.from({length:8},(_,i) => ({ id: `PR-${200+i}`, requester: ["John","Maria","David","Aisha"][i%4], purpose: ["Travel","Equipment","Reimbursement","Training"][i%4], amount: 250 + i*120, status: ["Pending","Approved","Rejected"][i%3] }))}
            columns={[
              { key: "id", header: "Request #" }, { key: "requester", header: "Requester" },
              { key: "purpose", header: "Purpose" },
              { key: "amount", header: "Amount", align: "right", render: (r) => currency(r.amount) },
              { key: "status", header: "Status", render: (r) => <StatusPill status={r.status} /> },
            ]} />
        )},
        { key: "leave", label: "Request Leave", render: () => (
          <DataTable data={Array.from({length:8},(_,i) => ({ id: `LV-${300+i}`, employee: ["John","Maria","David","Aisha"][i%4], type: ["Annual","Sick","Compassionate"][i%3], days: 2+i, status: ["Pending","Approved","Rejected"][i%3] }))}
            columns={[
              { key: "id", header: "Leave #" }, { key: "employee", header: "Employee" },
              { key: "type", header: "Type" }, { key: "days", header: "Days", align: "right" },
              { key: "status", header: "Status", render: (r) => <StatusPill status={r.status} /> },
            ]} />
        )},
        { key: "slip", label: "Salary Slips", render: () => (
          <DataTable data={Array.from({length:8},(_,i) => ({ id: `SL-${400+i}`, period: "May 2026", employee: ["John","Maria","David","Aisha"][i%4], gross: 1800+i*120, net: 1500+i*100 }))}
            columns={[
              { key: "id", header: "Slip #" }, { key: "employee", header: "Employee" },
              { key: "period", header: "Period" },
              { key: "gross", header: "Gross", align: "right", render: (r) => currency(r.gross) },
              { key: "net", header: "Net", align: "right", render: (r) => currency(r.net) },
            ]} />
        )},
      ]} />
    </div>
  ),
});
