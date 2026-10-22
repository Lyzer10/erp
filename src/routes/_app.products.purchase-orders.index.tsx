import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { Plus } from "lucide-react";
import { useTranslate } from "@/lib/i18n";
import { useState } from "react";

import { getPurchaseOrdersFn } from "@/lib/api/domain";
import { receivePurchaseOrderFn } from "@/lib/api/purchases";

type PurchaseOrder = {
  id: number;
  code: string;
  supplier: string;
  date: string;
  items: number;
  total: number;
  status: string;
};

const currency = (value: number) => `TZS ${new Intl.NumberFormat("en-TZ").format(value)}`;

export const Route = createFileRoute("/_app/products/purchase-orders/")({
  head: () => ({ meta: [{ title: "Purchase Orders — DeveleERP" }] }),
  loader: () => getPurchaseOrdersFn(),
  component: PurchaseOrdersPage,
});

function PurchaseOrdersPage() {
  const initialPOData = Route.useLoaderData();
  const router = useRouter();
  const { t, lang } = useTranslate();
  const [poData, setPoData] = useState<PurchaseOrder[]>(initialPOData.data as PurchaseOrder[]);
  const [error, setError] = useState<string | null>(null);

  async function receive(order: PurchaseOrder) {
    setError(null);
    try {
      await receivePurchaseOrderFn({ data: { purchaseOrderId: order.id } });
      setPoData((current) =>
        current.map((item) => (item.id === order.id ? { ...item, status: "Received" } : item)),
      );
      await router.invalidate();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Purchase receipt failed.");
    }
  }

  const cols = [
    { key: "code", header: lang === "en" ? "LPO #" : "LPO #" },
    { key: "supplier", header: lang === "en" ? "Supplier" : "Muuzaji" },
    { key: "date", header: lang === "en" ? "Date" : "Tarehe" },
    { key: "items", header: lang === "en" ? "Items" : "Vitu", align: "right" as const },
    {
      key: "total",
      header: lang === "en" ? "Total" : "Jumla",
      align: "right" as const,
      render: (r: PurchaseOrder) => currency(r.total),
    },
    {
      key: "status",
      header: lang === "en" ? "Status" : "Hali",
      render: (r: PurchaseOrder) => <StatusPill status={r.status} />,
    },
    {
      key: "action",
      header: "",
      render: (r: PurchaseOrder) =>
        r.status === "Received" ? null : (
          <button
            onClick={() => receive(r)}
            className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800"
          >
            {lang === "en" ? "Receive stock" : "Pokea stoo"}
          </button>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700"
        >
          {error}
        </p>
      )}
      <PageHeader
        title={lang === "en" ? "Purchase Orders (LPO)" : "Maagizo ya Manunuzi (LPO)"}
        description={
          lang === "en"
            ? "Create, approve, and reject local purchase orders."
            : "LPO ni agizo la manunuzi unalotengeneza kwa ajili ya msambazaji."
        }
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <Link
              to="/products/purchase-orders/new"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition"
            >
              <Plus className="h-4 w-4" />
              {lang === "en" ? "Create LPO" : "Tengeneza LPO"}
            </Link>
          </div>
        }
      />
      <p className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
        {lang === "en"
          ? "An LPO is saved inside DeveleERP as your internal purchase record. It is not automatically sent to the supplier; share it separately by email, WhatsApp, or a printed copy."
          : "LPO huhifadhiwa ndani ya DeveleERP kama kumbukumbu yako ya manunuzi. Haitumwi moja kwa moja kwa msambazaji; mtumie mwenyewe kwa barua pepe, WhatsApp, au nakala iliyochapishwa."}
      </p>
      <TabbedPage
        tabs={[
          {
            key: "all",
            label: lang === "en" ? "All" : "Zote",
            render: () => <DataTable data={poData} columns={cols} />,
          },
          {
            key: "approved",
            label: lang === "en" ? "Approved" : "Imeidhinishwa",
            render: () => (
              <DataTable data={poData.filter((p) => p.status === "Approved")} columns={cols} />
            ),
          },
          {
            key: "pending",
            label: lang === "en" ? "Pending" : "Inasubiri",
            render: () => (
              <DataTable data={poData.filter((p) => p.status === "Pending")} columns={cols} />
            ),
          },
          {
            key: "rejected",
            label: lang === "en" ? "Rejected" : "Imekataliwa",
            render: () => (
              <DataTable data={poData.filter((p) => p.status === "Rejected")} columns={cols} />
            ),
          },
        ]}
      />
    </div>
  );
}
