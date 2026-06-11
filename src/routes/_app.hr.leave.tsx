import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { ExportMenu } from "@/components/erp/ExportMenu";

export const Route = createFileRoute("/_app/hr/leave")({
  head: () => ({ meta: [{ title: "Leave — DeveleERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Leave Management" description="Leave requests, types, and on-behalf submissions."
        actions={<ExportMenu />} />
      <TabbedPage tabs={[
        { key: "requests", label: "Leave Requests", render: () => (
          <DataTable data={Array.from({length:12},(_,i)=>({ id:`LV-${500+i}`, employee:["John","Maria","David","Aisha","Peter"][i%5], type:["Annual","Sick","Compassionate","Maternity"][i%4], from:`2026-06-${String(i+1).padStart(2,"0")}`, days:2+i%5, status:["Pending","Approved","Rejected"][i%3] }))}
            columns={[{ key:"id", header:"Request #" }, { key:"employee", header:"Employee" }, { key:"type", header:"Type" },
              { key:"from", header:"From" }, { key:"days", header:"Days", align:"right" },
              { key:"status", header:"Status", render:(r)=><StatusPill status={r.status} /> }]} />
        )},
        { key: "types", label: "Leave Types", render: () => (
          <DataTable data={[
            { code:"AL", name:"Annual Leave", days:21 }, { code:"SL", name:"Sick Leave", days:14 },
            { code:"ML", name:"Maternity Leave", days:90 }, { code:"PL", name:"Paternity Leave", days:14 },
            { code:"CL", name:"Compassionate Leave", days:7 },
          ]} columns={[{ key:"code", header:"Code" }, { key:"name", header:"Type" }, { key:"days", header:"Days/Year", align:"right" }]} />
        )},
        { key: "behalf", label: "On Behalf Requests", render: () => (
          <DataTable data={Array.from({length:6},(_,i)=>({ id:`OBL-${600+i}`, requester:"Aisha Otieno", employee:["John","Maria","David"][i%3], type:"Sick", days:1+i, status:["Approved","Pending"][i%2] }))}
            columns={[{ key:"id", header:"Request #" }, { key:"requester", header:"Filed By" }, { key:"employee", header:"For" },
              { key:"type", header:"Type" }, { key:"days", header:"Days", align:"right" },
              { key:"status", header:"Status", render:(r)=><StatusPill status={r.status} /> }]} />
        )},
      ]} />
    </div>
  ),
});
