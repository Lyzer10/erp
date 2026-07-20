import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { StatusPill } from "@/components/erp/StatusPill";
import { useTranslate } from "@/lib/i18n";
import { Plus, Eye, Pencil, Trash2, FileSpreadsheet, FileText, Search, Inbox, ChevronDown } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImportCard } from "./_app.stakeholders.customers";

const tzs = (n: number) => "TZS " + new Intl.NumberFormat("en-US").format(n);

type Supplier = {
  id: number; name: string; phone: string; tin: string; vrn: string;
  email: string; region: string; address: string; branch: string;
  balance: number; status: "Active" | "Inactive";
};

const suppliersMock: Supplier[] = [
  { id: 1, name: "Supplier A Co.",        phone: "+255 712 100 001", tin: "200-300-401", vrn: "40-223456-S", email: "a@supplier.com", region: "Dar es Salaam", address: "Kariakoo",   branch: "Head Office", balance: 3_500_000, status: "Active" },
  { id: 2, name: "Supplier B Holdings",   phone: "+255 754 100 002", tin: "200-300-402", vrn: "40-223457-S", email: "b@supplier.com", region: "Arusha",        address: "Sakina",     branch: "Branch A",    balance: 1_240_000, status: "Active" },
  { id: 3, name: "Supplier C Industries", phone: "+255 765 100 003", tin: "200-300-403", vrn: "—",           email: "c@supplier.com", region: "Mwanza",        address: "Ilemela",    branch: "Branch B",    balance:   780_000, status: "Inactive" },
  { id: 4, name: "Supplier D Co.",        phone: "+255 713 100 004", tin: "200-300-404", vrn: "40-223458-S", email: "d@supplier.com", region: "Dodoma",        address: "Area C",     branch: "Head Office", balance:   210_000, status: "Active" },
  { id: 5, name: "Supplier E Logistics",  phone: "+255 744 100 005", tin: "200-300-405", vrn: "—",           email: "e@supplier.com", region: "Mbeya",         address: "Industrial", branch: "Branch C",    balance:         0, status: "Active" },
];

import { getSuppliersFn, createSupplierFn } from "@/lib/api/domain";

export const Route = createFileRoute("/_app/stakeholders/suppliers")({
  head: () => ({ meta: [{ title: "Suppliers — DeveleERP" }] }),
  loader: () => getSuppliersFn(),
  component: SuppliersPage,
});

function SuppliersPage() {
  const initialSuppliersData = Route.useLoaderData();
  const { t, lang } = useTranslate();
  const suppliersData = (initialSuppliersData as any)?.data || initialSuppliersData;
  const [suppliers, setSuppliers] = useState<Supplier[]>(suppliersData || suppliersMock);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("suppliers")}
        description={lang === "en" ? "Vendors, payables, and supplier directory." : "Wauzaji, madeni, na orodha ya wauzaji."}
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1f9c88] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#177d6d] transition cursor-pointer"
            >
              <Plus className="h-4 w-4" /> {lang === "en" ? "New Supplier" : "Muuzaji Mpya"}
            </button>
          </div>
        }
      />
      <TabbedPage tabs={[
        { key: "list",   label: lang === "en" ? "Suppliers List" : "Orodha ya Wauzaji",   render: () => <SuppliersList suppliers={suppliers} setSuppliers={setSuppliers} /> },
        { key: "import", label: lang === "en" ? "Import Suppliers" : "Ingiza Wauzaji", render: () => <ImportCard title={lang === "en" ? "Import Suppliers" : "Ingiza Wauzaji"} templateName={lang === "en" ? "SUPPLIERS TEMPLATE" : "KIELELEZO CHA WAUZAJI"} /> },
      ]} />

      <CreateSupplierDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={(newSupplier) => {
          setSuppliers(prev => [
            {
              id: prev.length > 0 ? Math.max(...prev.map(s => s.id)) + 1 : 1,
              ...newSupplier,
              balance: 0,
              status: "Active",
              branch: "Head Office"
            },
            ...prev
          ]);
        }}
      />
    </div>
  );
}

function ExportMenu() {
  const { lang } = useTranslate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
          {lang === "en" ? "Export" : "Hamisha"} <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Excel
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <FileText className="h-4 w-4 text-rose-600" /> PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface SuppliersListProps {
  readonly suppliers: Supplier[];
  readonly setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
}

function SuppliersList({ suppliers, setSuppliers }: SuppliersListProps) {
  const { lang } = useTranslate();
  const [q, setQ] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Supplier | null>(null);
  const [viewing, setViewing] = useState<Supplier | null>(null);

  const filtered = useMemo(() => {
    const lc = q.toLowerCase();
    if (!lc) return suppliers;
    return suppliers.filter((s) => Object.values(s).some((v) => String(v).toLowerCase().includes(lc)));
  }, [suppliers, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const rows = filtered.slice(start, start + perPage);

  const headers = lang === "en" 
    ? ["#", "Supplier Name", "Phone", "Email", "Region", "Balance", "Status", "Action"]
    : ["#", "Jina la Muuzaji", "Simu", "Barua Pepe", "Mkoa", "Salio", "Hali", "Kitendo"];

  return (
    <div className="glass-card overflow-hidden p-0">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-b border-white/40 p-4">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          {lang === "en" ? "Show" : "Onyesha"}
          <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">
            {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          {lang === "en" ? "entries" : "kumbukumbu"}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder={lang === "en" ? "Search..." : "Tafuta..."}
            className="w-56 rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              {headers.map((h, index) => {
                const isBalance = lang === "en" ? h === "Balance" : h === "Salio";
                const isActionOrStatus = lang === "en" 
                  ? (h === "Action" || h === "Status") 
                  : (h === "Kitendo" || h === "Hali");
                return (
                  <th key={index} className={`whitespace-nowrap px-3 py-3 font-medium ${isBalance ? "text-right" : isActionOrStatus ? "text-center" : "text-left"}`}>{h}</th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={8} className="px-3 py-12 text-center text-muted-foreground">
                <Inbox className="mx-auto mb-2 h-8 w-8 opacity-40" /> {lang === "en" ? "No data available" : "Hakuna data inayopatikana"}
              </td></tr>
            ) : rows.map((s, i) => (
              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                <td className="px-3 py-3 text-slate-500">{start + i + 1}</td>
                <td className="whitespace-nowrap px-3 py-3 font-medium text-foreground">{s.name}</td>
                <td className="whitespace-nowrap px-3 py-3">{s.phone}</td>
                <td className="whitespace-nowrap px-3 py-3">{s.email}</td>
                <td className="whitespace-nowrap px-3 py-3">{s.region}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right font-semibold">{tzs(s.balance)}</td>
                <td className="px-3 py-3 text-center"><StatusPill status={s.status} /></td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button title={lang === "en" ? "View" : "Angalia"} onClick={() => setViewing(s)} className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50"><Eye className="h-3.5 w-3.5" /></button>
                    <button title={lang === "en" ? "Edit" : "Hariri"} className="rounded-md p-1.5 text-amber-600 hover:bg-amber-50"><Pencil className="h-3.5 w-3.5" /></button>
                    <button title={lang === "en" ? "Delete" : "Futa"} onClick={() => setToDelete(s)} className="rounded-md p-1.5 text-rose-600 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-white/40 px-4 py-3 text-xs">
        <span className="text-muted-foreground">
          {lang === "en" 
            ? `Showing ${filtered.length === 0 ? 0 : start + 1} to ${Math.min(start + perPage, filtered.length)} of ${filtered.length} entries`
            : `Inaonyesha ${filtered.length === 0 ? 0 : start + 1} hadi ${Math.min(start + perPage, filtered.length)} kati ya kumbukumbu ${filtered.length}`
          }
        </span>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="rounded-md border border-slate-200 bg-white px-3 py-1 font-medium disabled:opacity-40">{lang === "en" ? "Previous" : "Nyuma"}</button>
          <span className="rounded-md bg-blue-500 px-3 py-1 font-semibold text-white">{page}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            className="rounded-md border border-slate-200 bg-white px-3 py-1 font-medium disabled:opacity-40">{lang === "en" ? "Next" : "Mbele"}</button>
        </div>
      </div>

      {/* View dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{lang === "en" ? "Supplier Details" : "Maelezo ya Muuzaji"}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{lang === "en" ? "Status" : "Hali"}</span>
                <StatusPill status={viewing.status} />
              </div>
              <DetailRow label={lang === "en" ? "Name" : "Jina"}    value={viewing.name} />
              <DetailRow label={lang === "en" ? "Phone" : "Simu"}   value={viewing.phone} />
              <DetailRow label={lang === "en" ? "Email" : "Barua Pepe"}   value={viewing.email} />
              <DetailRow label={lang === "en" ? "Region" : "Mkoa"}  value={viewing.region} />
              <DetailRow label={lang === "en" ? "Balance" : "Salio"} value={tzs(viewing.balance)} />
              <div className="my-2 h-px bg-slate-100" />
              <DetailRow label={lang === "en" ? "TIN Number" : "Namba ya TIN"} value={viewing.tin} />
              <DetailRow label="VRN"        value={viewing.vrn} />
              <DetailRow label={lang === "en" ? "Address" : "Anwani"}    value={viewing.address} />
              <DetailRow label={lang === "en" ? "Branch" : "Tawi"}     value={viewing.branch} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{lang === "en" ? "Delete supplier?" : "Futa muuzaji?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {lang === "en" 
                ? `This will permanently remove ${toDelete?.name}. This action cannot be undone.`
                : `Hii itaondoa kabisa ${toDelete?.name}. Kitendo hiki hakiwezi kubatilishwa.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{lang === "en" ? "Cancel" : "Ghairi"}</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (toDelete) {
                setSuppliers(prev => prev.filter(s => s.id !== toDelete.id));
              }
              setToDelete(null);
            }} className="bg-rose-600 hover:bg-rose-700">{lang === "en" ? "Delete" : "Futa"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="w-28 shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

interface CreateSupplierDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (data: {
    name: string;
    phone: string;
    email: string;
    region: string;
    tin: string;
    vrn: string;
    address: string;
  }) => void;
}

function CreateSupplierDialog({ open, onOpenChange, onSubmit }: CreateSupplierDialogProps) {
  const { lang } = useTranslate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [tin, setTin] = useState("");
  const [vrn, setVrn] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onSubmit({ name, phone, email, region, tin, vrn, address });
    setName("");
    setPhone("");
    setEmail("");
    setRegion("");
    setTin("");
    setVrn("");
    setAddress("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
        <DialogHeader className="border-b border-slate-100 pb-3 mb-4">
          <DialogTitle className="text-base font-bold text-slate-900">{lang === "en" ? "New Supplier" : "Muuzaji Mpya"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Supplier Name" : "Jina la Muuzaji"} *</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Supplier A Co."
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Phone Number" : "Namba ya Simu"}</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+255 712 100 001"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Email" : "Barua Pepe"}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="a@supplier.com"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Region" : "Mkoa"}</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Dar es Salaam"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Address" : "Anwani"}</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Kariakoo"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "TIN Number" : "Namba ya TIN"}</label>
              <input
                type="text"
                value={tin}
                onChange={(e) => setTin(e.target.value)}
                placeholder="200-300-401"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">VRN</label>
              <input
                type="text"
                value={vrn}
                onChange={(e) => setVrn(e.target.value)}
                placeholder="40-223456-S"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              {lang === "en" ? "Cancel" : "Ghairi"}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#1f9c88] hover:bg-[#177d6d] px-4 py-2.5 text-xs font-bold text-white shadow-md transition cursor-pointer"
            >
              {lang === "en" ? "Save Supplier" : "Hifadhi Muuzaji"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
