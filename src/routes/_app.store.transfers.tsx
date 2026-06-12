import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { currency } from "@/lib/mock";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslate } from "@/lib/i18n";

type Transfer = {
  id: string;
  from: string;
  to: string;
  items: number;
  value: number;
  date: string;
  status: string;
  description?: string;
};

export const Route = createFileRoute("/_app/store/transfers")({
  head: () => ({ meta: [{ title: "Store Transfers — DeveleERP" }] }),
  component: StoreTransfersPage,
});

function StoreTransfersPage() {
  const { lang, t } = useTranslate();
  const [ibtList, setIbtList] = useState<Transfer[]>(
    Array.from({ length: 5 }, (_, i) => ({
      id: `IBT-${1000 + i}`,
      from: ["Main Store", "Westlands", "Mombasa Store"][i % 3],
      to: ["Westlands", "Mombasa Store", "Main Store"][i % 3],
      items: 4 + i,
      value: 600 + i * 350,
      date: `2026-06-0${i + 1}`,
      status: ["Completed", "Approved", "Pending"][i % 3],
    }))
  );

  const [istList, setIstList] = useState<Transfer[]>(
    Array.from({ length: 4 }, (_, i) => ({
      id: `IST-${2000 + i}`,
      from: ["Main Store", "Sub-Store A", "Mombasa Store"][i % 3],
      to: ["Sub-Store A", "Mombasa Store", "Main Store"][i % 3],
      items: 3 + i,
      value: 450 + i * 280,
      date: `2026-06-0${i + 2}`,
      status: ["Completed", "Approved", "Pending"][i % 3],
    }))
  );

  const [rcvList, setRcvList] = useState<Transfer[]>(
    Array.from({ length: 5 }, (_, i) => ({
      id: `RCV-${3000 + i}`,
      from: "Supplier",
      to: ["Main Store", "Westlands", "Mombasa Store"][i % 3],
      items: 8 + i,
      value: 1200 + i * 500,
      date: `2026-06-0${i + 1}`,
      status: "Completed",
    }))
  );

  const [issList, setIssList] = useState<Transfer[]>(
    Array.from({ length: 3 }, (_, i) => ({
      id: `ISS-${4000 + i}`,
      from: ["Main Store", "Westlands", "Mombasa Store"][i % 3],
      to: "Scrapped / Disposed",
      items: 2 + i,
      value: 150 + i * 110,
      date: `2026-06-0${i + 3}`,
      status: "Approved",
    }))
  );

  const [transferOpen, setTransferOpen] = useState(false);

  const handleCreateTransfer = (newTransfer: Omit<Transfer, "id" | "date" | "status"> & { type: string }) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);

    const baseTransfer = {
      from: newTransfer.from,
      to: newTransfer.to,
      items: newTransfer.items,
      value: newTransfer.value,
      date: dateStr,
      status: "Pending",
      description: newTransfer.description,
    };

    if (newTransfer.type === "Inter Branch" || newTransfer.type === "Inter Branch / Transfer IBT") {
      const nextId = `IBT-${1000 + ibtList.length + 1}`;
      setIbtList(prev => [{ id: nextId, ...baseTransfer }, ...prev]);
    } else if (newTransfer.type === "Inter Store") {
      const nextId = `IST-${2000 + istList.length + 1}`;
      setIstList(prev => [{ id: nextId, ...baseTransfer }, ...prev]);
    } else if (newTransfer.type === "Received Purchases") {
      const nextId = `RCV-${3000 + rcvList.length + 1}`;
      setRcvList(prev => [{ id: nextId, ...baseTransfer, status: "Completed" }, ...prev]);
    } else {
      const nextId = `ISS-${4000 + issList.length + 1}`;
      setIssList(prev => [{ id: nextId, ...baseTransfer, status: "Approved" }, ...prev]);
    }
  };

  const cols = [
    { key: "id", header: "Ref" },
    { key: "from", header: t("from") },
    { key: "to", header: t("to") },
    { key: "items", header: t("itemsQuantity"), align: "right" as const },
    { key: "value", header: t("totalValue"), align: "right" as const, render: (r: any) => `TZS ${currency(r.value).replace("$", "")}` },
    { key: "date", header: t("date") },
    { key: "status", header: t("status"), render: (r: any) => <StatusPill status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("transfers")}
        description={lang === "en" ? "Manage stock transfers, branch requisitions, and receipt of goods." : "Dhibiti uhamisho wa bidhaa, maombi ya matawi, na upokeaji wa bidhaa."}
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button
              onClick={() => setTransferOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition animate-fade-in"
            >
              <Plus className="h-4 w-4" /> {t("newTransfer")}
            </button>
          </div>
        }
      />
      <TabbedPage tabs={[
        { key: "ib", label: lang === "en" ? "Inter Branch" : "Uhamisho wa Matawi (IBT)", render: () => <DataTable data={ibtList} columns={cols} /> },
        { key: "is", label: lang === "en" ? "Inter Store" : "Uhamisho wa Stoo (IST)", render: () => <DataTable data={istList} columns={cols} /> },
        { key: "received", label: lang === "en" ? "Received Purchases" : "Manunuzi Yaliyopokelewa", render: () => <DataTable data={rcvList} columns={cols} /> },
        { key: "issued", label: lang === "en" ? "Issued" : "Zilizotolewa", render: () => <DataTable data={issList} columns={cols} /> },
      ]} />

      <CreateTransferDialog
        open={transferOpen}
        onOpenChange={setTransferOpen}
        onSubmit={handleCreateTransfer}
      />
    </div>
  );
}

// --- Create Transfer Dialog ---

interface CreateTransferDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (data: { type: string; from: string; to: string; items: number; value: number; description?: string }) => void;
}

function CreateTransferDialog({ open, onOpenChange, onSubmit }: CreateTransferDialogProps) {
  const { lang, t } = useTranslate();
  const [type, setType] = useState("Inter Branch");
  const [from, setFrom] = useState("Main Store");
  const [to, setTo] = useState("Westlands");
  const [items, setItems] = useState(1);
  const [value, setValue] = useState(0);
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;
    onSubmit({ type, from, to, items, value, description });
    setType("Inter Branch");
    setFrom("Main Store");
    setTo("Westlands");
    setItems(1);
    setValue(0);
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
        <DialogHeader className="border-b border-slate-100 pb-3 mb-4">
          <DialogTitle className="text-base font-bold text-slate-900">{t("newStockTransfer")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("transferType")}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="Inter Branch">{lang === "en" ? "Inter Branch" : "Uhamisho wa Matawi (IBT)"}</option>
              <option value="Inter Store">{lang === "en" ? "Inter Store" : "Uhamisho wa Stoo (IST)"}</option>
              <option value="Received Purchases">{lang === "en" ? "Received Purchases" : "Manunuzi Yaliyopokelewa"}</option>
              <option value="Issued">{lang === "en" ? "Issued" : "Zilizotolewa"}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("source")}</label>
              <input
                required
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="e.g. Main Store"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("destination")}</label>
              <input
                required
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="e.g. Westlands Branch"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("itemsQuantity")}</label>
              <input
                required
                type="number"
                min={1}
                value={items}
                onChange={(e) => setItems(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("totalValue")}</label>
              <input
                required
                type="number"
                min={0}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("description")}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={lang === "en" ? "Enter transfer details..." : "Weka maelezo ya uhamisho..."}
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-600 transition"
            >
              {t("submit")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
