import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { StatusPill } from "@/components/erp/StatusPill";
import { Plus, Eye, Pencil, Trash2, FileSpreadsheet, FileText, Search, Inbox } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ImportCard } from "./_app.stakeholders.customers";

const tzs = (n: number) => "TZS " + new Intl.NumberFormat("en-US").format(n);

type Supplier = {
  id: number; name: string; phone: string; tin: string; vrn: string;
  email: string; region: string; address: string; branch: string;
  balance: number; status: "Active" | "Inactive";
};

const suppliersMock: Supplier[] = [
  { id: 1, name: "Supplier A Co.",       phone: "+255 712 100 001", tin: "200-300-401", vrn: "40-223456-S", email: "a@supplier.com", region: "Dar es Salaam", address: "Kariakoo",     branch: "Head Office", balance: 3_500_000, status: "Active" },
  { id: 2, name: "Supplier B Holdings",  phone: "+255 754 100 002", tin: "200-300-402", vrn: "40-223457-S", email: "b@supplier.com", region: "Arusha",        address: "Sakina",       branch: "Branch A",    balance: 1_240_000, status: "Active" },
  { id: 3, name: "Supplier C Industries",phone: "+255 765 100 003", tin: "200-300-403", vrn: "—",           email: "c@supplier.com", region: "Mwanza",        address: "Ilemela",      branch: "Branch B",    balance:   780_000, status: "Inactive" },
  { id: 4, name: "Supplier D Co.",       phone: "+255 713 100 004", tin: "200-300-404", vrn: "40-223458-S", email: "d@supplier.com", region: "Dodoma",        address: "Area C",       branch: "Head Office", balance:   210_000, status: "Active" },
  { id: 5, name: "Supplier E Logistics", phone: "+255 744 100 005", tin: "200-300-405", vrn: "—",           email: "e@supplier.com", region: "Mbeya",         address: "Industrial",   branch: "Branch C",    balance:         0, status: "Active" },
];

export const Route = createFileRoute("/_app/stakeholders/suppliers")({
  head: () => ({ meta: [{ title: "Suppliers — Lumen ERP" }] }),
  component: SuppliersPage,
});

function SuppliersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Vendors, payables, and supplier directory."
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
            <Plus className="h-4 w-4" /> New Supplier
          </button>
        }
      />
      <TabbedPage tabs={[
        { key: "list",   label: "Suppliers List",   render: () => <SuppliersList /> },
        { key: "import", label: "Import Suppliers", render: () => <ImportCard title="Import Suppliers" templateName="SUPPLIERS TEMPLATE" /> },
      ]} />
    </div>
  );
}

function SuppliersList() {
  const [q, setQ] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Supplier | null>(null);

  const filtered = useMemo(() => {
    const lc = q.toLowerCase();
    if (!lc) return suppliersMock;
    return suppliersMock.filter((s) => Object.values(s).some((v) => String(v).toLowerCase().includes(lc)));
  }, [q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const rows = filtered.slice(start, start + perPage);

  return (
    <div className="glass-card overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/40 p-4">
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700">
            <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700">
            <FileText className="h-3.5 w-3.5" /> PDF
          </button>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Show
            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">
              {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            entries
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search..."
              className="w-56 rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              {["#","Supplier Name","Phone Number","TIN Number","VRN","Email","Region","Address","Branch","Balance","Status","Action"].map((h) => (
                <th key={h} className={`whitespace-nowrap px-3 py-3 font-medium ${h === "Balance" ? "text-right" : h === "Action" || h === "Status" ? "text-center" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={12} className="px-3 py-12 text-center text-muted-foreground">
                <Inbox className="mx-auto mb-2 h-8 w-8 opacity-40" /> No data available
              </td></tr>
            ) : rows.map((s, i) => (
              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                <td className="px-3 py-3 text-slate-500">{start + i + 1}</td>
                <td className="whitespace-nowrap px-3 py-3 font-medium text-foreground">{s.name}</td>
                <td className="whitespace-nowrap px-3 py-3">{s.phone}</td>
                <td className="whitespace-nowrap px-3 py-3">{s.tin}</td>
                <td className="whitespace-nowrap px-3 py-3">{s.vrn}</td>
                <td className="whitespace-nowrap px-3 py-3">{s.email}</td>
                <td className="whitespace-nowrap px-3 py-3">{s.region}</td>
                <td className="whitespace-nowrap px-3 py-3">{s.address}</td>
                <td className="whitespace-nowrap px-3 py-3">{s.branch}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right font-semibold">{tzs(s.balance)}</td>
                <td className="px-3 py-3 text-center"><StatusPill status={s.status} /></td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button title="View" className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50"><Eye className="h-3.5 w-3.5" /></button>
                    <button title="Edit" className="rounded-md p-1.5 text-amber-600 hover:bg-amber-50"><Pencil className="h-3.5 w-3.5" /></button>
                    <button title="Delete" onClick={() => setToDelete(s)} className="rounded-md p-1.5 text-rose-600 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-white/40 px-4 py-3 text-xs">
        <span className="text-muted-foreground">
          Showing {filtered.length === 0 ? 0 : start + 1} to {Math.min(start + perPage, filtered.length)} of {filtered.length} entries
        </span>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="rounded-md border border-slate-200 bg-white px-3 py-1 font-medium disabled:opacity-40">Previous</button>
          <span className="rounded-md bg-blue-600 px-3 py-1 font-semibold text-white">{page}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            className="rounded-md border border-slate-200 bg-white px-3 py-1 font-medium disabled:opacity-40">Next</button>
        </div>
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete supplier?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="font-semibold">{toDelete?.name}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setToDelete(null)} className="bg-rose-600 hover:bg-rose-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
