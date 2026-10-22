import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/erp/DataTable";
import { PageHeader } from "@/components/erp/PageHeader";
import { getDashboardFn, getSalesFn } from "@/lib/api/operations";
import { useTranslate } from "@/lib/i18n";

type Sale = {
  id: number;
  receiptNumber: string;
  customer?: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: string;
  createdAt: Date | string;
};

export const Route = createFileRoute("/_app/sales/reports")({
  head: () => ({ meta: [{ title: "Sales Reports — DeveleERP" }] }),
  loader: async () => ({ dashboard: await getDashboardFn(), sales: await getSalesFn() }),
  component: SalesReportsPage,
});

const money = (value: number) => `TZS ${new Intl.NumberFormat("en-TZ").format(value)}`;

function SalesReportsPage() {
  const { lang } = useTranslate();
  const { dashboard, sales } = Route.useLoaderData() as {
    dashboard: Awaited<ReturnType<typeof getDashboardFn>>;
    sales: Sale[];
  };
  const completed = sales.filter((sale) => sale.status === "Completed");
  const allRevenue = completed.reduce((sum, sale) => sum + sale.total, 0);
  const allTax = completed.reduce((sum, sale) => sum + sale.tax, 0);
  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === "en" ? "Sales Reports" : "Ripoti za Mauzo"}
        description={
          lang === "en"
            ? "Figures calculated from completed sales only; voided receipts are excluded."
            : "Takwimu kutoka mauzo yaliyokamilika pekee."
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="All-time completed revenue" value={money(allRevenue)} />
        <Metric label="Tax recorded" value={money(allTax)} />
        <Metric label="Today's transactions" value={String(dashboard.salesCount)} />
      </div>
      <DataTable
        data={sales}
        columns={[
          { key: "receiptNumber", header: "Receipt" },
          {
            key: "createdAt",
            header: "Date",
            render: (row: Sale) => new Date(row.createdAt).toLocaleString(),
          },
          {
            key: "customer",
            header: "Customer",
            render: (row: Sale) => row.customer || "Walk-in Customer",
          },
          {
            key: "subtotal",
            header: "Subtotal",
            align: "right",
            render: (row: Sale) => money(row.subtotal),
          },
          {
            key: "discount",
            header: "Discount",
            align: "right",
            render: (row: Sale) => money(row.discount),
          },
          { key: "tax", header: "Tax", align: "right", render: (row: Sale) => money(row.tax) },
          {
            key: "total",
            header: "Total",
            align: "right",
            render: (row: Sale) => money(row.total),
          },
          { key: "status", header: "Status" },
        ]}
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card p-5">
      <p className="text-xs font-bold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
    </div>
  );
}
