import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Store = {
  code: string;
  name: string;
  location: string;
  manager: string;
  items: number;
};

type Conversion = {
  code: string;
  from: string;
  to: string;
  ratio: string;
};

export const Route = createFileRoute("/_app/store/stores")({
  head: () => ({ meta: [{ title: "Stores — DeveleERP" }] }),
  component: StoresPage,
});

function StoresPage() {
  const [stores, setStores] = useState<Store[]>([
    { code: "ST-01", name: "Main Warehouse", location: "Industrial Area", manager: "John Mwangi", items: 1240 },
    { code: "ST-02", name: "Westlands Store", location: "Westlands", manager: "Maria Banda", items: 580 },
    { code: "ST-03", name: "Mombasa Outlet", location: "Mombasa", manager: "David Kumar", items: 412 },
    { code: "ST-04", name: "Kisumu Depot", location: "Kisumu", manager: "Grace Mensah", items: 298 },
  ]);

  const [conversions, setConversions] = useState<Conversion[]>([
    { code: "CF-01", from: "Sugar 50kg Bag", to: "Sugar 2kg Pack", ratio: "1 : 25" },
    { code: "CF-02", from: "Cooking Oil 20L", to: "Cooking Oil 5L", ratio: "1 : 4" },
    { code: "CF-03", from: "Coffee 25kg", to: "Coffee 1kg", ratio: "1 : 25" },
    { code: "CF-04", from: "Detergent 100L", to: "Detergent 1L", ratio: "1 : 100" },
  ]);

  const [storeOpen, setStoreOpen] = useState(false);
  const [conversionOpen, setConversionOpen] = useState(false);

  const handleCreateStore = (newStore: Omit<Store, "code">) => {
    const nextCode = `ST-${String(stores.length + 1).padStart(2, "0")}`;
    setStores(prev => [...prev, { code: nextCode, ...newStore }]);
  };

  const handleCreateConversion = (newConversion: Omit<Conversion, "code">) => {
    const nextCode = `CF-${String(conversions.length + 1).padStart(2, "0")}`;
    setConversions(prev => [...prev, { code: nextCode, ...newConversion }]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stores & Conversions"
        description="Physical store locations and conversion formulas."
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button
              onClick={() => setConversionOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              <Plus className="h-4 w-4 text-slate-500" /> Add Formula
            </button>
            <button
              onClick={() => setStoreOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition"
            >
              <Plus className="h-4 w-4" /> Add Store
            </button>
          </div>
        }
      />
      <TabbedPage tabs={[
        {
          key: "stores",
          label: "Stores",
          render: () => (
            <DataTable
              data={stores}
              columns={[
                { key: "code", header: "Code" },
                { key: "name", header: "Store" },
                { key: "location", header: "Location" },
                { key: "manager", header: "Manager" },
                { key: "items", header: "Items", align: "right" }
              ]}
            />
          )
        },
        {
          key: "conversions",
          label: "Conversion Formulas",
          render: () => (
            <DataTable
              data={conversions}
              columns={[
                { key: "code", header: "Code" },
                { key: "from", header: "From" },
                { key: "to", header: "To" },
                { key: "ratio", header: "Ratio" }
              ]}
            />
          )
        },
      ]} />

      <CreateStoreDialog
        open={storeOpen}
        onOpenChange={setStoreOpen}
        onSubmit={handleCreateStore}
      />

      <CreateConversionDialog
        open={conversionOpen}
        onOpenChange={setConversionOpen}
        onSubmit={handleCreateConversion}
      />
    </div>
  );
}

// --- Create Store Dialog ---

interface CreateStoreDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (data: Omit<Store, "code">) => void;
}

function CreateStoreDialog({ open, onOpenChange, onSubmit }: CreateStoreDialogProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [manager, setManager] = useState("");
  const [items, setItems] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !manager) return;
    onSubmit({ name, location, manager, items });
    setName("");
    setLocation("");
    setManager("");
    setItems(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Store Location</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Store Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arusha Warehouse"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Location</label>
            <input
              required
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Njiro Road"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Manager</label>
              <input
                required
                type="text"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                placeholder="e.g. Anita Hassan"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Initial Items Count</label>
              <input
                type="number"
                min={0}
                value={items}
                onChange={(e) => setItems(Number(e.target.value))}
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
              Create Store
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Create Conversion Dialog ---

interface CreateConversionDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (data: Omit<Conversion, "code">) => void;
}

function CreateConversionDialog({ open, onOpenChange, onSubmit }: CreateConversionDialogProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [ratio, setRatio] = useState("1 : 1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !ratio) return;
    onSubmit({ from, to, ratio });
    setFrom("");
    setTo("");
    setRatio("1 : 1");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Conversion Formula</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">From Unit/Item</label>
            <input
              required
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="e.g. Paint 20L Bucket"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">To Unit/Item</label>
            <input
              required
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="e.g. Paint 1L Tin"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ratio (From : To)</label>
            <input
              required
              type="text"
              value={ratio}
              onChange={(e) => setRatio(e.target.value)}
              placeholder="e.g. 1 : 20"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
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
              Create Formula
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
