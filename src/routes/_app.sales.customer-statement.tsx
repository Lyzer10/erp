import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DataTable } from "@/components/erp/DataTable";
import { PageHeader } from "@/components/erp/PageHeader";
import { getCustomersFn } from "@/lib/api/domain";
import { getSalesFn } from "@/lib/api/operations";

type Customer = { id: number; name: string; balance: number };
type Sale = {
  id: number;
  receiptNumber: string;
  customer?: string | null;
  total: number;
  status: string;
  createdAt: Date | string;
};

export const Route = createFileRoute("/_app/sales/customer-statement")({
  head: () => ({ meta: [{ title: "Customer Statement — DeveleERP" }] }),
  loader: async () => ({
    customers: (await getCustomersFn()).data as Customer[],
    sales: await getSalesFn(),
  }),
  component: CustomerStatementPage,
});

const money = (value: number) => `TZS ${new Intl.NumberFormat("en-TZ").format(value)}`;

function CustomerStatementPage() {
  const { customers, sales } = Route.useLoaderData() as { customers: Customer[]; sales: Sale[] };
  const [customerId, setCustomerId] = useState<number | "">(customers[0]?.id || "");
  const customer = customers.find((item) => item.id === customerId);
  const rows = sales.filter((sale) => sale.customer === customer?.name);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Statement"
        description="Completed and voided sales associated with a registered customer."
      />
      <div className="glass-card flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-semibold">
          Customer
          <select
            value={customerId}
            onChange={(event) => setCustomerId(Number(event.target.value) || "")}
            className="input-field mt-1"
          >
            <option value="">Choose customer</option>
            {customers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <div>
          <p className="text-xs uppercase text-muted-foreground">Outstanding credit</p>
          <p className="text-xl font-black">{money(customer?.balance || 0)}</p>
        </div>
      </div>
      <DataTable
        data={rows}
        columns={[
          { key: "receiptNumber", header: "Receipt" },
          {
            key: "createdAt",
            header: "Date",
            render: (row: Sale) => new Date(row.createdAt).toLocaleString(),
          },
          {
            key: "total",
            header: "Amount",
            align: "right",
            render: (row: Sale) => money(row.total),
          },
          { key: "status", header: "Status" },
        ]}
      />
    </div>
  );
}
