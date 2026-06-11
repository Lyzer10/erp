import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { products, currency } from "@/lib/mock";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_app/products/catalog")({
  head: () => ({ meta: [{ title: "Products & Services — DeveleERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Products & Services" description="Catalog, brands, and product codes."
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md"><Plus className="h-4 w-4" />Add Product</button>
          </div>
        } />
      <TabbedPage tabs={[
        { key: "products", label: "Products / Services", render: () => (
          <DataTable data={products} columns={[
            { key: "sku", header: "SKU" }, { key: "name", header: "Name" },
            { key: "category", header: "Category" }, { key: "brand", header: "Brand" },
            { key: "cost", header: "Cost", align: "right", render: (r) => currency(r.cost) },
            { key: "price", header: "Price", align: "right", render: (r) => currency(r.price) },
            { key: "stock", header: "Stock", align: "right",
              render: (r) => <span className={r.stock < r.reorder ? "font-medium text-rose-600" : ""}>{r.stock}</span> },
          ]} />
        )},
        { key: "brands", label: "Brands & Codes", render: () => (
          <DataTable data={["Brava","Northstar","Helios","Verde","Apex"].map((b, k) => ({ code: `BR-${100+k}`, name: b, products: 4 + k*2, active: true }))}
            columns={[
              { key: "code", header: "Code" }, { key: "name", header: "Brand" },
              { key: "products", header: "Products", align: "right" },
              { key: "active", header: "Status", render: (r) => r.active ? "Active" : "Inactive" },
            ]} />
        )},
      ]} />
    </div>
  ),
});
