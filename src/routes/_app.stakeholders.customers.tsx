import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { StatusPill } from "@/components/erp/StatusPill";
import { Plus, Eye, Pencil, Trash2, FileSpreadsheet, FileText, Search, Inbox, Download, Upload, ChevronDown } from "lucide-react";
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

const tzs = (n: number) => "TZS " + new Intl.NumberFormat("en-US").format(n);

type Customer = {
  id: number; name: string; phone: string; tin: string; vrn: string;
  email: string; region: string; address: string; branch: string;
  balance: number; status: "Active" | "Inactive";
};

const customersMock: Customer[] = [
  { id: 1, name: "Acme Trading Ltd",    phone: "+255 712 000 001", tin: "100-200-300", vrn: "40-123456-E", email: "acme@email.com",   region: "Dar es Salaam", address: "Ilala",        branch: "Head Office", balance: 4_200_000, status: "Active" },
  { id: 2, name: "Skyline Holdings",    phone: "+255 754 000 002", tin: "100-200-301", vrn: "40-123457-E", email: "sky@email.com",    region: "Arusha",        address: "CBD",          branch: "Branch A",    balance: 1_800_000, status: "Active" },
  { id: 3, name: "Bluepeak Industries", phone: "+255 765 000 003", tin: "100-200-302", vrn: "—",           email: "blue@email.com",   region: "Mwanza",        address: "Nyamagana",    branch: "Branch B",    balance:   950_000, status: "Inactive" },
  { id: 4, name: "Greenfield Co.",      phone: "+255 713 000 004", tin: "100-200-303", vrn: "40-123458-E", email: "green@email.com",  region: "Dodoma",        address: "City Centre",  branch: "Head Office", balance:   320_000, status: "Active" },
  { id: 5, name: "Harbor Logistics",    phone: "+255 744 000 005", tin: "100-200-304", vrn: "—",           email: "harbor@email.com", region: "Tanga",         address: "Port Area",    branch: "Branch C",    balance:         0, status: "Active" },
];

const advancesMock = [
  { id: 1, name: "Acme Trading Ltd", createdBy: "Aisha O.", currency: "TZS", balance: 250_000 },
  { id: 2, name: "Skyline Holdings", createdBy: "John M.",  currency: "TZS", balance: 120_000 },
  { id: 3, name: "Greenfield Co.",   createdBy: "Aisha O.", currency: "USD", balance:   1_500 },
];

export const Route = createFileRoute("/_app/stakeholders/customers")({
  head: () => ({ meta: [{ title: "Customers — DeveleERP" }] }),
  component: CustomersPage,
});

function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(customersMock);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage customers, advances, and imports."
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition"
            >
              <Plus className="h-4 w-4" /> New Customer
            </button>
          </div>
        }
      />
      <TabbedPage tabs={[
        { key: "list",    label: "Customers List",    render: () => <CustomersList customers={customers} setCustomers={setCustomers} /> },
        { key: "advance", label: "Customer Advances", render: () => <AdvancesTable /> },
        { key: "import",  label: "Import Customers",  render: () => <ImportCard title="Import Customers" templateName="CUSTOMERS TEMPLATE" /> },
      ]} />

      <CreateCustomerDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={(newCustomer) => {
          setCustomers(prev => [
            {
              id: prev.length > 0 ? Math.max(...prev.map(c => c.id)) + 1 : 1,
              ...newCustomer,
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
          Export <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
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

interface CustomersListProps {
  readonly customers: Customer[];
  readonly setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

function CustomersList({ customers, setCustomers }: CustomersListProps) {
  const [q, setQ] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Customer | null>(null);
  const [viewing, setViewing] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    const lc = q.toLowerCase();
    if (!lc) return customers;
    return customers.filter((c) =>
      Object.values(c).some((v) => String(v).toLowerCase().includes(lc)),
    );
  }, [customers, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const rows = filtered.slice(start, start + perPage);

  return (
    <div className="glass-card overflow-hidden p-0">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-b border-white/40 p-4">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Show
          <select
            value={perPage}
            onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs"
          >
            {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          entries
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Search..."
            className="w-56 rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              {["#", "Customer Name", "Phone", "Email", "Region", "Balance", "Status", "Action"].map((h) => (
                <th key={h} className={`whitespace-nowrap px-3 py-3 font-medium ${h === "Balance" ? "text-right" : h === "Action" || h === "Status" ? "text-center" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-12 text-center text-muted-foreground">
                  <Inbox className="mx-auto mb-2 h-8 w-8 opacity-40" />
                  No data available
                </td>
              </tr>
            ) : rows.map((c, i) => (
              <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                <td className="px-3 py-3 text-slate-500">{start + i + 1}</td>
                <td className="whitespace-nowrap px-3 py-3 font-medium text-foreground">{c.name}</td>
                <td className="whitespace-nowrap px-3 py-3">{c.phone}</td>
                <td className="whitespace-nowrap px-3 py-3">{c.email}</td>
                <td className="whitespace-nowrap px-3 py-3">{c.region}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right font-semibold">{tzs(c.balance)}</td>
                <td className="px-3 py-3 text-center"><StatusPill status={c.status} /></td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <IconBtn title="View" onClick={() => setViewing(c)} tone="blue"><Eye className="h-3.5 w-3.5" /></IconBtn>
                    <IconBtn title="Edit" onClick={() => {}} tone="amber"><Pencil className="h-3.5 w-3.5" /></IconBtn>
                    <IconBtn title="Delete" onClick={() => setToDelete(c)} tone="rose"><Trash2 className="h-3.5 w-3.5" /></IconBtn>
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
          <span className="rounded-md bg-blue-500 px-3 py-1 font-semibold text-white">{page}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            className="rounded-md border border-slate-200 bg-white px-3 py-1 font-medium disabled:opacity-40">Next</button>
        </div>
      </div>

      {/* View dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Status</span>
                <StatusPill status={viewing.status} />
              </div>
              <DetailRow label="Name"    value={viewing.name} />
              <DetailRow label="Phone"   value={viewing.phone} />
              <DetailRow label="Email"   value={viewing.email} />
              <DetailRow label="Region"  value={viewing.region} />
              <DetailRow label="Balance" value={tzs(viewing.balance)} />
              <div className="my-2 h-px bg-slate-100" />
              <DetailRow label="TIN Number" value={viewing.tin} />
              <DetailRow label="VRN"        value={viewing.vrn} />
              <DetailRow label="Address"    value={viewing.address} />
              <DetailRow label="Branch"     value={viewing.branch} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete customer?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="font-semibold">{toDelete?.name}</span> from your records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (toDelete) {
                setCustomers(prev => prev.filter(c => c.id !== toDelete.id));
              }
              setToDelete(null);
            }} className="bg-rose-600 hover:bg-rose-700">Delete</AlertDialogAction>
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

function AdvancesTable() {
  return (
    <div className="glass-card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              {["#", "Customer Name", "Created By", "Currency", "Balance", "Action"].map((h) => (
                <th key={h} className={`px-3 py-3 font-medium ${h === "Balance" ? "text-right" : h === "Action" ? "text-center" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {advancesMock.map((a, i) => (
              <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                <td className="px-3 py-3 text-slate-500">{i + 1}</td>
                <td className="px-3 py-3 font-medium">{a.name}</td>
                <td className="px-3 py-3">{a.createdBy}</td>
                <td className="px-3 py-3">{a.currency}</td>
                <td className="px-3 py-3 text-right font-semibold">
                  {a.currency === "TZS" ? tzs(a.balance) : new Intl.NumberFormat("en-US", { style: "currency", currency: a.currency }).format(a.balance)}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <IconBtn title="View" onClick={() => {}} tone="blue"><Eye className="h-3.5 w-3.5" /></IconBtn>
                    <IconBtn title="Delete" onClick={() => {}} tone="rose"><Trash2 className="h-3.5 w-3.5" /></IconBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ImportCard({ title, templateName }: { title: string; templateName: string }) {
  const [fileName, setFileName] = useState<string>("");
  return (
    <div className="mx-auto max-w-2xl">
      <div className="glass-card space-y-5 p-8">
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-teal-600" />
          <h3 className="text-base font-semibold">{title}</h3>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Select File:</label>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white/60 p-4 hover:bg-white/80">
            <span className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">Choose File</span>
            <span className="text-sm text-muted-foreground">{fileName || "No file chosen"}</span>
            <input type="file" className="hidden" accept=".csv,.xlsx" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} />
          </label>
        </div>
        <a href="#download-template" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline">
          <Download className="h-3.5 w-3.5" /> Download: {templateName}
        </a>
        <div className="pt-2">
          <button className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

function IconBtn({
  children, title, onClick, tone,
}: { children: React.ReactNode; title: string; onClick: () => void; tone: "blue" | "amber" | "rose" }) {
  const tones = { blue: "text-blue-600 hover:bg-blue-50", amber: "text-amber-600 hover:bg-amber-50", rose: "text-rose-600 hover:bg-rose-50" };
  return (
    <button onClick={onClick} title={title} className={`rounded-md p-1.5 transition ${tones[tone]}`}>{children}</button>
  );
}

interface CreateCustomerDialogProps {
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

function CreateCustomerDialog({ open, onOpenChange, onSubmit }: CreateCustomerDialogProps) {
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Customer Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Trading Ltd"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+255 712 000 001"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="acme@email.com"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Region</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Dar es Salaam"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ilala"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">TIN Number</label>
              <input
                type="text"
                value={tin}
                onChange={(e) => setTin(e.target.value)}
                placeholder="100-200-300"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">VRN</label>
              <input
                type="text"
                value={vrn}
                onChange={(e) => setVrn(e.target.value)}
                placeholder="40-123456-E"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition"
            >
              Save Customer
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
