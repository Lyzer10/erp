import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { GlassCard } from "@/components/erp/GlassCard";
import { EChart } from "@/components/charts/EChart";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

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
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [receiveTransfers, setReceiveTransfers] = useState<ReceiveTransfer[]>([]);
  const [createOpen, setCreateOpen] = useState(false);

  const requestCols = [
    { key: "id", header: "Request #" },
    { key: "requestedBy", header: "Requested By" },
    { key: "date", header: "Date" },
    { key: "time", header: "Time" },
    { key: "requestingBranch", header: "Requesting Branch" },
    { key: "requestedBranch", header: "Requested Branch" },
    { key: "status", header: "Status", render: (r: any) => <StatusPill status={r.status} /> },
    { key: "action", header: "Action", render: (r: any) => (
      <button
        onClick={() => handleDeleteRequest(r.id)}
        className="text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-md transition text-xs font-semibold"
      >
        Delete
      </button>
    )}
  ];

  const receiveCols = [
    { key: "id", header: "Request #" },
    { key: "requestedBy", header: "Requested By" },
    { key: "date", header: "Date" },
    { key: "time", header: "Time" },
    { key: "fromStore", header: "From Store" },
    { key: "toStore", header: "To Store" },
    { key: "requestType", header: "Request Type" },
    { key: "status", header: "Status", render: (r: any) => <StatusPill status={r.status} /> },
    { key: "action", header: "Action", render: (r: any) => (
      <button className="text-blue-500 hover:bg-blue-50 px-2 py-1 rounded transition text-xs font-semibold border border-blue-200">
        Receive
      </button>
    )}
  ];

  const handleDeleteRequest = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
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

    // Also populate receive stock transfer dynamically for demo tracing
    const recTransfer: ReceiveTransfer = {
      id: request.id,
      requestedBy: request.requestedBy,
      date: request.date,
      time: request.time,
      fromStore: request.requestedBranch,
      toStore: request.requestingBranch,
      requestType: "Inter-Branch",
      status: "Pending"
    };
    setReceiveTransfers(prev => [recTransfer, ...prev]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inter-Branch Transfer"
        description="Raise stock requests, track transfers, and report movements."
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition"
            >
              <Plus className="h-4 w-4" /> Stock Request
            </button>
          </div>
        }
      />

      <TabbedPage tabs={[
        {
          key: "request",
          label: "Stock Request",
          render: () => (
            <DataTable
              data={requests}
              columns={requestCols}
            />
          )
        },
        {
          key: "list",
          label: "Stock Requested List",
          render: () => {
            const [fromVal, setFromVal] = useState("");
            const [toVal, setToVal] = useState("");
            return (
              <GlassCard className="space-y-4">
                <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">From:</label>
                    <input
                      type="date"
                      value={fromVal}
                      onChange={(e) => setFromVal(e.target.value)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">To:</label>
                    <input
                      type="date"
                      value={toVal}
                      onChange={(e) => setToVal(e.target.value)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                <DataTable
                  data={requests}
                  columns={requestCols}
                />
              </GlassCard>
            );
          }
        },
        {
          key: "report",
          label: "Inter Branch Stock Report",
          render: () => {
            const [fromVal, setFromVal] = useState("");
            const [toVal, setToVal] = useState("");
            return (
              <GlassCard className="space-y-4">
                <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">From:</label>
                    <input
                      type="date"
                      value={fromVal}
                      onChange={(e) => setFromVal(e.target.value)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">To:</label>
                    <input
                      type="date"
                      value={toVal}
                      onChange={(e) => setToVal(e.target.value)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <EChart height={300} option={{
                    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
                    legend: { data: ["Outgoing", "Incoming"] },
                    xAxis: { type: "category", data: ["Main", "Westlands", "Mombasa Rd", "Kisumu"] },
                    yAxis: { type: "value" },
                    series: [
                      { name: "Outgoing", type: "bar", data: [12, 8, 14, 6], itemStyle: { borderRadius: [6,6,0,0], color: "#1f9c88" }, barWidth: 22 },
                      { name: "Incoming", type: "bar", data: [9, 11, 7, 10], itemStyle: { borderRadius: [6,6,0,0], color: "#a6e3dd" }, barWidth: 22 },
                    ],
                  }} />
                </div>
              </GlassCard>
            );
          }
        },
        {
          key: "receive",
          label: "Receive Stock Transfer",
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
          <DialogTitle>Stock Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Product Name</label>
            <input
              required
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product Name"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Brand Code</label>
              <input
                type="text"
                value={brandCode}
                onChange={(e) => setBrandCode(e.target.value)}
                placeholder="Brand Code"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Quantity</label>
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
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Select Date</label>
              <input
                type="date"
                value={selectDate}
                onChange={(e) => setSelectDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              >
                <option>Main Branch</option>
                <option>Westlands</option>
                <option>Mombasa Rd</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comment"
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
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition"
            >
              Submit Request
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
