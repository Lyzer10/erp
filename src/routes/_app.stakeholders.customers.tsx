import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { StatusPill } from "@/components/erp/StatusPill";
import { useTranslate } from "@/lib/i18n";
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
  const { t, lang } = useTranslate();
  const [customers, setCustomers] = useState<Customer[]>(customersMock);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("customers")}
        description={lang === "en" ? "Manage customers, advances, and imports." : "Simamia wateja, amana zao, na kuingiza faili."}
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1f9c88] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#177d6d] transition cursor-pointer"
            >
              <Plus className="h-4 w-4" /> {lang === "en" ? "New Customer" : "Mteja Mpya"}
            </button>
          </div>
        }
      />
      <TabbedPage tabs={[
        { key: "list",    label: lang === "en" ? "Customers List" : "Orodha ya Wateja",    render: () => <CustomersList customers={customers} setCustomers={setCustomers} /> },
        { key: "advance", label: lang === "en" ? "Customer Advances" : "Amana za Wateja", render: () => <AdvancesTable /> },
        { key: "import",  label: lang === "en" ? "Import Customers" : "Ingiza Wateja",  render: () => <ImportCard title={lang === "en" ? "Import Customers" : "Ingiza Wateja"} templateName={lang === "en" ? "CUSTOMERS TEMPLATE" : "KIELELEZO CHA WATEJA"} /> },
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
  const { lang } = useTranslate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer">
          {lang === "en" ? "Export" : "Hamisha"} <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 bg-white border border-slate-100 shadow-lg rounded-xl">
        <DropdownMenuItem className="gap-2 cursor-pointer text-xs font-semibold py-2">
          <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Excel
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer text-xs font-semibold py-2">
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
  const { lang } = useTranslate();
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

  const headers = lang === "en" 
    ? ["#", "Customer Name", "Phone", "Email", "Region", "Balance", "Status", "Action"]
    : ["#", "Jina la Mteja", "Simu", "Barua Pepe", "Mkoa", "Salio", "Hali", "Kitendo"];

  return (
    <div className="glass-card overflow-hidden p-0">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-b border-slate-100 p-4 bg-slate-50/50">
        <label className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
          {lang === "en" ? "Show" : "Onyesha"}
          <select
            value={perPage}
            onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs focus:border-[#1f9c88] focus:outline-none"
          >
            {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          {lang === "en" ? "entries" : "kumbukumbu"}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder={lang === "en" ? "Search..." : "Tafuta..."}
            className="w-56 rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-2 text-xs focus:outline-none focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15"
          />
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
                  <th key={index} className={`whitespace-nowrap px-3 py-3 font-semibold ${isBalance ? "text-right" : isActionOrStatus ? "text-center" : "text-left"}`}>{h}</th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-12 text-center text-muted-foreground">
                  <Inbox className="mx-auto mb-2 h-8 w-8 opacity-40" />
                  {lang === "en" ? "No data available" : "Hakuna data inayopatikana"}
                </td>
              </tr>
            ) : rows.map((c, i) => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition">
                <td className="px-3 py-3 text-slate-500">{start + i + 1}</td>
                <td className="whitespace-nowrap px-3 py-3 font-semibold text-foreground">{c.name}</td>
                <td className="whitespace-nowrap px-3 py-3">{c.phone}</td>
                <td className="whitespace-nowrap px-3 py-3">{c.email}</td>
                <td className="whitespace-nowrap px-3 py-3">{c.region}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-slate-900">{tzs(c.balance)}</td>
                <td className="px-3 py-3 text-center"><StatusPill status={c.status} /></td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <IconBtn title={lang === "en" ? "View" : "Angalia"} onClick={() => setViewing(c)} tone="blue"><Eye className="h-3.5 w-3.5" /></IconBtn>
                    <IconBtn title={lang === "en" ? "Edit" : "Hariri"} onClick={() => {}} tone="amber"><Pencil className="h-3.5 w-3.5" /></IconBtn>
                    <IconBtn title={lang === "en" ? "Delete" : "Futa"} onClick={() => setToDelete(c)} tone="rose"><Trash2 className="h-3.5 w-3.5" /></IconBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-150 px-4 py-3 text-xs bg-slate-50/20">
        <span className="text-muted-foreground font-medium">
          {lang === "en" 
            ? `Showing ${filtered.length === 0 ? 0 : start + 1} to ${Math.min(start + perPage, filtered.length)} of ${filtered.length} entries`
            : `Inaonyesha ${filtered.length === 0 ? 0 : start + 1} hadi ${Math.min(start + perPage, filtered.length)} kati ya kumbukumbu ${filtered.length}`
          }
        </span>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="rounded-md border border-slate-200 bg-white px-3 py-1 font-semibold disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer">{lang === "en" ? "Previous" : "Nyuma"}</button>
          <span className="rounded-md bg-blue-100 text-blue-900 px-3 py-1 font-semibold">{page}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            className="rounded-md border border-slate-200 bg-white px-3 py-1 font-semibold disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer">{lang === "en" ? "Next" : "Mbele"}</button>
        </div>
      </div>

      {/* View dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
          <DialogHeader className="border-b border-slate-100 pb-3 mb-4">
            <DialogTitle className="text-base font-bold text-slate-900">{lang === "en" ? "Customer Details" : "Maelezo ya Mteja"}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 border border-slate-100">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{lang === "en" ? "Status" : "Hali"}</span>
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

      {/* Delete confirm */}
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-slate-900">{lang === "en" ? "Delete customer?" : "Futa mteja?"}</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 text-sm">
              {lang === "en" 
                ? `This will permanently remove ${toDelete?.name} from your records. This action cannot be undone.`
                : `Hii itaondoa kabisa ${toDelete?.name} kutoka kwenye kumbukumbu zako. Kitendo hiki hakiwezi kubatilishwa.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-2 border-t border-slate-100 mt-4">
            <AlertDialogCancel className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold px-4 py-2">{lang === "en" ? "Cancel" : "Ghairi"}</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (toDelete) {
                setCustomers(prev => prev.filter(c => c.id !== toDelete.id));
              }
              setToDelete(null);
            }} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold px-4 py-2">{lang === "en" ? "Delete" : "Futa"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-2 last:border-0 last:pb-0">
      <span className="w-28 shrink-0 text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      <span className="text-right text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function AdvancesTable() {
  const { lang } = useTranslate();
  const headers = lang === "en"
    ? ["#", "Customer Name", "Created By", "Currency", "Balance", "Action"]
    : ["#", "Jina la Mteja", "Imeundwa na", "Sarafu", "Salio", "Kitendo"];

  return (
    <div className="glass-card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600 border-b border-slate-100">
            <tr>
              {headers.map((h, idx) => {
                const isBalance = lang === "en" ? h === "Balance" : h === "Salio";
                const isAction = lang === "en" ? h === "Action" : h === "Kitendo";
                return (
                  <th key={idx} className={`px-3 py-3 font-semibold ${isBalance ? "text-right" : isAction ? "text-center" : "text-left"}`}>{h}</th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
            {advancesMock.map((a, i) => (
              <tr key={a.id} className="hover:bg-slate-50/50 transition">
                <td className="px-3 py-3 text-slate-500">{i + 1}</td>
                <td className="px-3 py-3 font-bold">{a.name}</td>
                <td className="px-3 py-3">{a.createdBy}</td>
                <td className="px-3 py-3">{a.currency}</td>
                <td className="px-3 py-3 text-right font-semibold">
                  {a.currency === "TZS" ? tzs(a.balance) : new Intl.NumberFormat("en-US", { style: "currency", currency: a.currency }).format(a.balance)}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <IconBtn title={lang === "en" ? "View" : "Angalia"} onClick={() => {}} tone="blue"><Eye className="h-3.5 w-3.5" /></IconBtn>
                    <IconBtn title={lang === "en" ? "Delete" : "Futa"} onClick={() => {}} tone="rose"><Trash2 className="h-3.5 w-3.5" /></IconBtn>
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
  const { lang } = useTranslate();
  const [fileName, setFileName] = useState<string>("");
  return (
    <div className="mx-auto max-w-2xl">
      <div className="glass-card space-y-5 p-8 border border-slate-200">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Upload className="h-5 w-5 text-[#1f9c88]" />
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Select File:" : "Chagua Faili:"}</label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-4 hover:bg-slate-50 transition">
            <span className="rounded-md bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700">{lang === "en" ? "Choose File" : "Chagua Faili"}</span>
            <span className="text-sm text-slate-500 font-medium">{fileName || (lang === "en" ? "No file chosen" : "Hakuna faili lililochaguliwa")}</span>
            <input type="file" className="hidden" accept=".csv,.xlsx" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} />
          </label>
        </div>
        <a href="#download-template" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1f9c88] hover:text-[#177d6d] hover:underline">
          <Download className="h-3.5 w-3.5" /> {lang === "en" ? "Download Template:" : "Pakua Kiolezo:"} {templateName}
        </a>
        <div className="pt-2">
          <button className="rounded-lg bg-[#1f9c88] hover:bg-[#177d6d] px-5 py-2 text-sm font-semibold text-white shadow-sm transition cursor-pointer">
            {lang === "en" ? "Submit" : "Wasilisha"}
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
    <button onClick={onClick} title={title} className={`rounded-md p-1.5 transition ${tones[tone]} cursor-pointer`}>{children}</button>
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
    companyName?: string;
    mobile?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    creditLimit?: number;
    paymentTerms?: string;
    pricingGroup?: string;
    notes?: string;
  }) => void;
}

function CreateCustomerDialog({ open, onOpenChange, onSubmit }: CreateCustomerDialogProps) {
  const { lang } = useTranslate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [tin, setTin] = useState("");
  const [vrn, setVrn] = useState("");
  const [address, setAddress] = useState("");
  
  // Advanced fields
  const [companyName, setCompanyName] = useState("");
  const [mobile, setMobile] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Tanzania");
  const [creditLimit, setCreditLimit] = useState<number>(0);
  const [paymentTerms, setPaymentTerms] = useState("Immediate");
  const [pricingGroup, setPricingGroup] = useState("Retail");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onSubmit({
      name,
      phone,
      email,
      region,
      tin,
      vrn,
      address: address || street || city || region,
      companyName,
      mobile,
      street,
      city,
      state,
      postalCode,
      country,
      creditLimit,
      paymentTerms,
      pricingGroup,
      notes
    });
    // Reset states
    setName("");
    setPhone("");
    setEmail("");
    setRegion("");
    setTin("");
    setVrn("");
    setAddress("");
    setCompanyName("");
    setMobile("");
    setStreet("");
    setCity("");
    setState("");
    setPostalCode("");
    setCountry("Tanzania");
    setCreditLimit(0);
    setPaymentTerms("Immediate");
    setPricingGroup("Retail");
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-white rounded-2xl p-6 shadow-xl border border-slate-100 max-h-[85vh] overflow-y-auto pr-3">
        <DialogHeader className="border-b border-slate-100 pb-3 mb-4">
          <DialogTitle className="text-base font-bold text-slate-900">
            {lang === "en" ? "New Customer" : "Mteja Mpya"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#1f9c88]">
              {lang === "en" ? "1. Basic Details" : "1. Taarifa za Msingi"}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Full Name" : "Jina Kamili"} *</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Trading Ltd"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Company Name" : "Jina la Kampuni"}</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Group"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Phone Number" : "Namba ya Simu"}</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+255 712 000 001"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Mobile Number" : "Simu ya Mkononi"}</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+255 654 000 001"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Email Address" : "Barua Pepe"}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="acme@email.com"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Billing Address Details */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#1f9c88]">
              {lang === "en" ? "2. Billing Address" : "2. Anwani ya Malipo"}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Street Address" : "Anwani ya Mtaa"}</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. Kariakoo St, Plot 4"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "City" : "Mji"}</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Dar es Salaam"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Region / State" : "Mkoa / Jimbo"}</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Ilala"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Postal Code" : "Msimbo"}</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 11000"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Country" : "Nchi"}</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Financial settings & limits */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#1f9c88]">
              {lang === "en" ? "3. Financial & Credit Details" : "3. Maelezo ya Kifedha na Mikopo"}
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Credit Limit (TZS)" : "Ukomo wa Mikopo (TZS)"}</label>
                <input
                  type="number"
                  min={0}
                  value={creditLimit || ""}
                  onChange={(e) => setCreditLimit(Number(e.target.value))}
                  placeholder="e.g. 500000"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Payment Terms" : "Muda wa Malipo"}</label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                >
                  <option value="Immediate">Immediate (Lipa Hapo Hapo)</option>
                  <option value="Net 15">Net 15 Days</option>
                  <option value="Net 30">Net 30 Days</option>
                  <option value="Net 60">Net 60 Days</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Pricing Group" : "Kundi la Bei"}</label>
                <select
                  value={pricingGroup}
                  onChange={(e) => setPricingGroup(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                >
                  <option value="Retail">Retail (Rejareja)</option>
                  <option value="Wholesale">Wholesale (Jumla)</option>
                  <option value="Distributor">Distributor (Msambazaji)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Tax Registry & Notes */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#1f9c88]">
              {lang === "en" ? "4. Tax & Additional Notes" : "4. Kodi na Maelezo ya Ziada"}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "TIN Number" : "Namba ya TIN"}</label>
                <input
                  type="text"
                  value={tin}
                  onChange={(e) => setTin(e.target.value)}
                  placeholder="100-200-300"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">VRN</label>
                <input
                  type="text"
                  value={vrn}
                  onChange={(e) => setVrn(e.target.value)}
                  placeholder="40-123456-E"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === "en" ? "Notes / Additional Comments" : "Maelezo au Ufafanuzi Ziada"}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter client credit histories, branch-specific details or comments..."
                rows={2}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15 transition-all resize-none"
              />
            </div>
          </div>

          {/* Form Controls */}
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
              {lang === "en" ? "Save Customer" : "Hifadhi Mteja"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
