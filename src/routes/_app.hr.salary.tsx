import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { staff, currency } from "@/lib/mock";

export const Route = createFileRoute("/_app/hr/salary")({
  head: () => ({ meta: [{ title: "Salary — DeveleERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Salary" description="Salary ranges and individual payslips."
        actions={<ExportMenu />} />
      <TabbedPage tabs={[
        { key: "range", label: "Salary Ranges", render: () => (
          <DataTable data={[
            { grade:"A1", role:"Senior Manager", min:5500, max:8500 },
            { grade:"A2", role:"Manager", min:3800, max:5500 },
            { grade:"B1", role:"Senior Officer", min:2500, max:3800 },
            { grade:"B2", role:"Officer", min:1500, max:2500 },
            { grade:"C1", role:"Assistant", min:900, max:1500 },
          ]} columns={[{ key:"grade", header:"Grade" }, { key:"role", header:"Role Level" },
            { key:"min", header:"Min", align:"right", render:(r)=>currency(r.min) },
            { key:"max", header:"Max", align:"right", render:(r)=>currency(r.max) }]} />
        )},
        { key: "slips", label: "Salary Slips", render: () => (
          <DataTable data={staff.slice(0, 15).map((s) => ({ id:`SL-${900+parseInt(s.id.slice(-2))}`, employee:s.name, period:"May 2026", gross:s.salary, deductions:s.salary*0.18, net:s.salary*0.82 }))}
            columns={[{ key:"id", header:"Slip #" }, { key:"employee", header:"Employee" }, { key:"period", header:"Period" },
              { key:"gross", header:"Gross", align:"right", render:(r)=>currency(r.gross) },
              { key:"deductions", header:"Deductions", align:"right", render:(r)=>currency(r.deductions) },
              { key:"net", header:"Net", align:"right", render:(r)=>currency(r.net) }]} />
        )},
      ]} />
    </div>
  ),
});
