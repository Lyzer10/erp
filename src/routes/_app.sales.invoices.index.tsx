import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/erp/DataTable";
import { PageHeader } from "@/components/erp/PageHeader";
import { StatusPill } from "@/components/erp/StatusPill";
import { getSalesFn } from "@/lib/api/operations";
import { useTranslate } from "@/lib/i18n";

type Sale = {
  id: number;
  receiptNumber: string;
  customer?: string | null;
  total: number;
  status: string;
  createdAt: Date | string;
};

export const Route = createFileRoute("/_app/sales/invoices/")({
  head: () => ({ meta: [{ title: "Sales — DeveleERP" }] }),
  loader: () => getSalesFn(),
  component: SalesPage,
});

const money = (value: number) => `TZS ${new Intl.NumberFormat("en-TZ").format(value)}`;

function SalesPage() {
  const { lang } = useTranslate();
  const sales = Route.useLoaderData() as Sale[];
  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === "en" ? "Sales" : "Mauzo"}
        description={
          lang === "en"
            ? "Completed and voided sales. New retail transactions are posted through POS."
            : "Mauzo yaliyokamilika na yaliyofutwa."
        }
        actions={
          <Link
            to="/pos"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4" /> Open POS
          </Link>
        }
      />
      <DataTable
        data={sales}
        columns={[
          { key: "receiptNumber", header: "Reference" },
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
            key: "total",
            header: "Total",
            align: "right",
            render: (row: Sale) => money(row.total),
          },
          {
            key: "status",
            header: "Status",
            render: (row: Sale) => <StatusPill status={row.status} />,
          },
        ]}
      />
    </div>
  );
}
