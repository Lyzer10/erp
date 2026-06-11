import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { ExportMenu } from "@/components/erp/ExportMenu";

export const Route = createFileRoute("/_app/store/stores")({
  head: () => ({ meta: [{ title: "Stores — DeveleERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Stores & Conversions" description="Physical store locations and conversion formulas."
        actions={<ExportMenu />} />
      <TabbedPage tabs={[
        { key: "stores", label: "Stores", render: () => (
          <DataTable data={[
            { code:"ST-01", name:"Main Warehouse", location:"Industrial Area", manager:"John Mwangi", items:1240 },
            { code:"ST-02", name:"Westlands Store", location:"Westlands", manager:"Maria Banda", items:580 },
            { code:"ST-03", name:"Mombasa Outlet", location:"Mombasa", manager:"David Kumar", items:412 },
            { code:"ST-04", name:"Kisumu Depot", location:"Kisumu", manager:"Grace Mensah", items:298 },
          ]} columns={[{ key:"code", header:"Code" }, { key:"name", header:"Store" }, { key:"location", header:"Location" }, { key:"manager", header:"Manager" }, { key:"items", header:"Items", align:"right" }]} />
        )},
        { key: "conversions", label: "Conversion Formulas", render: () => (
          <DataTable data={[
            { code:"CF-01", from:"Sugar 50kg Bag", to:"Sugar 2kg Pack", ratio:"1 : 25" },
            { code:"CF-02", from:"Cooking Oil 20L", to:"Cooking Oil 5L", ratio:"1 : 4" },
            { code:"CF-03", from:"Coffee 25kg", to:"Coffee 1kg", ratio:"1 : 25" },
            { code:"CF-04", from:"Detergent 100L", to:"Detergent 1L", ratio:"1 : 100" },
          ]} columns={[{ key:"code", header:"Code" }, { key:"from", header:"From" }, { key:"to", header:"To" }, { key:"ratio", header:"Ratio" }]} />
        )},
      ]} />
    </div>
  ),
});
