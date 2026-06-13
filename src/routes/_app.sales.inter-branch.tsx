import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { GlassCard } from "@/components/erp/GlassCard";
import { EChart } from "@/components/charts/EChart";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useTranslate } from "@/lib/i18n";

type StockRequest = {
  id: string;
  requestedBy: string;
  date: string;
  time: string;
  requestingBranch: string;
  requestedBranch: string;
  status: string;
  productName: string;
  brandCode: string;
  description: string;
  quantity: number;
  comment: string;
};

type ReceiveTransfer = {
  id: string;
  requestedBy: string;
  date: string;
  time: string;
  fromStore: string;
  toStore: string;
  requestType: string;
  status: string;
};

export const Route = createFileRoute("/_app/sales/inter-branch")({
  head: () => ({ meta: [{ title: "Inter-Branch — DeveleERP" }] }),
  component: InterBranchPage,
});

function InterBranchPage() {
  const { t, lang } = useTranslate();
  
  const [requests, setRequests] = useState<StockRequest[]>([
    {
      id: "REQ-1001",
      requestedBy: "Aisha Otieno",
      date: "2026-06-10",
      time: "09:30 AM",
      requestingBranch: lang === "en" ? "Head Office" : "Ofisi Kuu",
      requestedBranch: "Westlands",
      status: "Approved",
      productName: "Steel Rods 12mm",
      brandCode: "STEEL-R12",
      description: "Deformed steel reinforcement bars",
      quantity: 150,
      comment: "Urgent reinforcement stock for building project"
    },
    {
      id: "REQ-1002",
      requestedBy: "John Kamau",
      date: "2026-06-11",
      time: "02:15 PM",
      requestingBranch: "Mombasa Rd",
      requestedBranch: lang === "en" ? "Main Branch" : "Tawi Kuu",
      status: "Pending",
      productName: "Cement Bag 50kg",
      brandCode: "CEM-50G",
      description: "Portland Cement Class 42.5N",
      quantity: 80,
      comment: "Stock replenishment for weekend sales"
    },
    {
      id: "REQ-1003",
      requestedBy: "Aisha Otieno",
      date: "2026-06-12",
      time: "11:05 AM",
      requestingBranch: "Kisumu",
      requestedBranch: lang === "en" ? "Main Branch" : "Tawi Kuu",
      status: "Approved",
      productName: "Paints Gloss White 20L",
      brandCode: "PNT-GW20",
      description: "Premium interior/exterior gloss paint",
      quantity: 25,
      comment: "Special request for local customer order"
    }
  ]);
  const [receiveTransfers, setReceiveTransfers] = useState<ReceiveTransfer[]>([
    {
      id: "REQ-1001",
      requestedBy: "Aisha Otieno",
      date: "2026-06-10",
      time: "09:30 AM",
      fromStore: "Westlands",
      toStore: lang === "en" ? "Head Office" : "Ofisi Kuu",
      requestType: lang === "en" ? "Inter-Branch" : "Kati ya Matawi",
      status: "Approved"
    },
    {
      id: "REQ-1002",
      requestedBy: "John Kamau",
      date: "2026-06-11",
      time: "02:15 PM",
      fromStore: lang === "en" ? "Main Branch" : "Tawi Kuu",
      toStore: "Mombasa Rd",
      requestType: lang === "en" ? "Inter-Branch" : "Kati ya Matawi",
      status: "Pending"
    },
    {
      id: "REQ-1003",
      requestedBy: "Aisha Otieno",
      date: "2026-06-12",
      time: "11:05 AM",
      fromStore: lang === "en" ? "Main Branch" : "Tawi Kuu",
      toStore: "Kisumu",
      requestType: lang === "en" ? "Inter-Branch" : "Kati ya Matawi",
      status: "Approved"
    }
  ]);
  const [createOpen, setCreateOpen] = useState(false);

  // Lifted filters state (to respect React Rules of Hooks)
  const [listFromVal, setListFromVal] = useState("");
  const [listToVal, setListToVal] = useState("");
  const [reportFromVal, setReportFromVal] = useState("");
  const [reportToVal, setReportToVal] = useState("");

  const requestCols = [
    { key: "id", header: lang === "en" ? "Request #" : "Ombi #" },
    { key: "requestedBy", header: lang === "en" ? "Requested By" : "Imeombwa Na" },
    { key: "date", header: lang === "en" ? "Date" : "Tarehe" },
    { key: "time", header: lang === "en" ? "Time" : "Muda" },
    { key: "requestingBranch", header: lang === "en" ? "Requesting Branch" : "Tawi Linaloomba" },
    { key: "requestedBranch", header: lang === "en" ? "Requested Branch" : "Tawi Lililoombwa" },
    { key: "status", header: lang === "en" ? "Status" : "Hali", render: (r: any) => <StatusPill status={r.status} /> },
    { key: "action", header: lang === "en" ? "Action" : "Kitendo", render: (r: any) => (
      <button
        onClick={() => handleDeleteRequest(r.id)}
        className="text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-md transition text-xs font-semibold"
      >
        {lang === "en" ? "Delete" : "Futa"}
      </button>
    )}
  ];

  const receiveCols = [
    { key: "id", header: lang === "en" ? "Request #" : "Ombi #" },
    { key: "requestedBy", header: lang === "en" ? "Requested By" : "Imeombwa Na" },
    { key: "date", header: lang === "en" ? "Date" : "Tarehe" },
    { key: "time", header: lang === "en" ? "Time" : "Muda" },
    { key: "fromStore", header: lang === "en" ? "From Store" : "Kutoka Stoo" },
    { key: "toStore", header: lang === "en" ? "To Store" : "Kwenda Stoo" },
    { key: "requestType", header: lang === "en" ? "Request Type" : "Aina ya Ombi" },
    { key: "status", header: lang === "en" ? "Status" : "Hali", render: (r: any) => <StatusPill status={r.status} /> },
    { key: "action", header: lang === "en" ? "Action" : "Kitendo", render: (r: any) => (
      <button className="text-blue-500 hover:bg-blue-50 px-2 py-1 rounded transition text-xs font-semibold border border-blue-200">
        {lang === "en" ? "Receive" : "Pokea"}
      </button>
    )}
  ];

  const handleDeleteRequest = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    setReceiveTransfers(prev => prev.filter(r => r.id !== id));
  };

  const handleCreateRequest = (newRequest: Omit<StockRequest, "id" | "requestedBy" | "date" | "time" | "status">) => {
    const now = new Date();
    const request: StockRequest = {
      id: `REQ-${1000 + requests.length + 1}`,
      requestedBy: "Aisha Otieno",
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "Pending",
      ...newRequest,
    };
    setRequests(prev => [request, ...prev]);

    const recTransfer: ReceiveTransfer = {
      id: request.id,
      requestedBy: request.requestedBy,
      date: request.date,
      time: request.time,
      fromStore: request.requestedBranch,
      toStore: request.requestingBranch,
      requestType: lang === "en" ? "Inter-Branch" : "Kati ya Matawi",
      status: "Pending"
    };
    setReceiveTransfers(prev => [recTransfer, ...prev]);
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      if (listFromVal && r.date < listFromVal) return false;
      if (listToVal && r.date > listToVal) return false;
      return true;
    });
  }, [requests, listFromVal, listToVal]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === "en" ? "Inter-Branch Transfer" : "Uhamisho wa Kati ya Matawi"}
        description={lang === "en" ? "Raise stock requests, track transfers, and report movements." : "Wasilisha maombi ya bidhaa, fuatilia uhamisho, na uripoti mienendo ya stoo."}
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition"
            >
              <Plus className="h-4 w-4" /> 
              {lang === "en" ? "Stock Request" : "Ombi la Bidhaa"}
            </button>
          </div>
        }
      />

      <TabbedPage tabs={[
        {
          key: "request",
          label: lang === "en" ? "Stock Request" : "Ombi la Bidhaa",
          render: () => (
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-1 rounded bg-blue-500" />
                  <h2 className="text-sm font-semibold text-slate-800">
                    {lang === "en" ? "Stock Requests Overview" : "Muhtasari wa Maombi ya Bidhaa"}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200/60 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {lang === "en" ? "From:" : "Kutoka:"}
                    </span>
                    <input
                      type="date"
                      value={listFromVal}
                      onChange={(e) => setListFromVal(e.target.value)}
                      className="rounded-lg border border-blue-100 bg-blue-50/30 px-3 py-1 text-sm outline-none focus:bg-white focus:border-blue-500 transition-all text-blue-950 font-medium"
                    />
                  </div>
                  <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {lang === "en" ? "To:" : "Hadi:"}
                    </span>
                    <input
                      type="date"
                      value={listToVal}
                      onChange={(e) => setListToVal(e.target.value)}
                      className="rounded-lg border border-blue-100 bg-blue-50/30 px-3 py-1 text-sm outline-none focus:bg-white focus:border-blue-500 transition-all text-blue-950 font-medium"
                    />
                  </div>
                </div>
              </div>

              <DataTable
                data={filteredRequests}
                columns={requestCols}
              />
            </div>
          )
        },
        {
          key: "report",
          label: lang === "en" ? "Inter Branch Stock Report" : "Ripoti ya Stoo ya Matawi",
          render: () => (
            <GlassCard className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 border-b border-blue-100/40 pb-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-blue-800">
                    {lang === "en" ? "From:" : "Kutoka:"}
                  </label>
                  <input
                    type="date"
                    value={reportFromVal}
                    onChange={(e) => setReportFromVal(e.target.value)}
                    className="rounded-lg border border-blue-100 bg-blue-50/30 px-3 py-1.5 text-sm outline-none focus:bg-white focus:border-blue-500 transition-all text-blue-950"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-blue-800">
                    {lang === "en" ? "To:" : "Hadi:"}
                  </label>
                  <input
                    type="date"
                    value={reportToVal}
                    onChange={(e) => setReportToVal(e.target.value)}
                    className="rounded-lg border border-blue-100 bg-blue-50/30 px-3 py-1.5 text-sm outline-none focus:bg-white focus:border-blue-500 transition-all text-blue-950"
                  />
                </div>
              </div>
              <div className="mt-4">
                <EChart height={300} option={{
                  tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, confine: true },
                  legend: { 
                    data: [lang === "en" ? "Outgoing" : "Zinazotoka", lang === "en" ? "Incoming" : "Zinazoingia"], 
                    textStyle: { color: "#145047", fontWeight: "bold" } 
                  },
                  grid: {
                    show: true,
                    backgroundColor: "rgba(31, 156, 136, 0.02)",
                    borderColor: "rgba(31, 156, 136, 0.12)",
                    borderWidth: 1,
                    left: 40,
                    right: 20,
                    top: 40,
                    bottom: 30,
                    containLabel: true
                  },
                  xAxis: {
                    type: "category",
                    data: lang === "en" ? ["Main", "Westlands", "Mombasa Rd", "Kisumu"] : ["Kuu", "Westlands", "Mombasa Rd", "Kisumu"],
                    axisLine: { lineStyle: { color: "rgba(31, 156, 136, 0.3)" } },
                    axisLabel: { color: "#145047", fontWeight: "bold", fontSize: 11 },
                    axisTick: { show: false }
                  },
                  yAxis: {
                    type: "value",
                    splitLine: { lineStyle: { color: "rgba(31, 156, 136, 0.06)", type: "dashed" } },
                    axisLine: { show: false },
                    axisLabel: { color: "#145047", fontSize: 11 }
                  },
                  series: [
                    { name: lang === "en" ? "Outgoing" : "Zinazotoka", type: "bar", data: [12, 8, 14, 6], itemStyle: { borderRadius: [6,6,0,0], color: "#1f9c88" }, barWidth: 22 },
                    { name: lang === "en" ? "Incoming" : "Zinazoingia", type: "bar", data: [9, 11, 7, 10], itemStyle: { borderRadius: [6,6,0,0], color: "#a6e3dd" }, barWidth: 22 },
                  ],
                }} />
              </div>
            </GlassCard>
          )
        },
        {
          key: "receive",
          label: lang === "en" ? "Receive Stock Transfer" : "Pokea Uhamisho wa Bidhaa",
          render: () => (
            <DataTable
              data={receiveTransfers}
              columns={receiveCols}
            />
          )
        }
      ]} />

      <CreateRequestDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateRequest}
      />
    </div>
  );
}

interface CreateRequestDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (data: Omit<StockRequest, "id" | "requestedBy" | "date" | "time" | "status">) => void;
}

function CreateRequestDialog({ open, onOpenChange, onSubmit }: CreateRequestDialogProps) {
  const { lang } = useTranslate();
  const [productName, setProductName] = useState("");
  const [brandCode, setBrandCode] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectDate, setSelectDate] = useState("");
  const [branch, setBranch] = useState("Main Branch");
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !quantity) return;
    onSubmit({
      productName,
      brandCode,
      description,
      quantity,
      requestedBranch: branch,
      requestingBranch: "Head Office",
      comment
    });
    setProductName("");
    setBrandCode("");
    setDescription("");
    setQuantity(1);
    setSelectDate("");
    setBranch("Main Branch");
    setComment("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{lang === "en" ? "Stock Request" : "Ombi la Bidhaa"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Product Name" : "Jina la Bidhaa"}</label>
            <input
              required
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder={lang === "en" ? "Product Name" : "Jina la Bidhaa"}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Brand Code" : "Msimbo wa Chapa"}</label>
              <input
                type="text"
                value={brandCode}
                onChange={(e) => setBrandCode(e.target.value)}
                placeholder={lang === "en" ? "Brand Code" : "Msimbo wa Chapa"}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Quantity" : "Idadi"}</label>
              <input
                required
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Description" : "Maelezo"}</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={lang === "en" ? "Description" : "Maelezo"}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Select Date" : "Chagua Tarehe"}</label>
              <input
                type="date"
                value={selectDate}
                onChange={(e) => setSelectDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Branch" : "Tawi"}</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              >
                <option value="Main Branch">{lang === "en" ? "Main Branch" : "Tawi Kuu"}</option>
                <option value="Westlands">Westlands</option>
                <option value="Mombasa Rd">Mombasa Rd</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{lang === "en" ? "Comment" : "Maoni"}</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={lang === "en" ? "Comment" : "Maoni"}
              rows={2}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              {lang === "en" ? "Cancel" : "Ghairi"}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition"
            >
              {lang === "en" ? "Submit Request" : "Wasilisha Ombi"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
