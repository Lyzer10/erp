import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { EChart } from "@/components/charts/EChart";
import {
  ArrowUpRight, ArrowDownRight, Wallet, Receipt, TrendingUp, HandCoins,
  ShoppingCart, AlertTriangle, FileWarning, CheckCircle2, Landmark, Banknote,
  PackageX, PackageCheck, Clock4, Users, FileCheck2, FileText, Calendar, Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/")({
  head: () => ({ meta: [{ title: "Dashboard — Lumen ERP" }, { name: "description", content: "Business performance overview." }] }),
  component: Dashboard,
});

// --- Formatting ---
const tzs = (n: number) =>
  "TZS " + new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

// --- Mock data sets per filter ---
type Period = "Today" | "Yesterday" | "This Week" | "This Month" | "This Year" | "Last Year";
const PERIODS: Period[] = ["Today", "Yesterday", "This Week", "This Month", "This Year", "Last Year"];

type Kpis = {
  revenue: number; revenueDelta: number;
  expenditures: number; expendituresDelta: number;
  grossProfit: number; grossProfitDelta: number;
  collection: number; collectionInvoices: number;
  purchases: number; purchaseOrders: number;
};

const kpiSets: Record<Period, Kpis> = {
  "Today":     { revenue: 284350, revenueDelta: 12.4, expenditures: 48200, expendituresDelta: 3.1, grossProfit: 236150, grossProfitDelta: 18.2, collection: 190000, collectionInvoices: 42, purchases: 32000, purchaseOrders: 8 },
  "Yesterday": { revenue: 251200, revenueDelta: 4.8,  expenditures: 51400, expendituresDelta: 6.2, grossProfit: 199800, grossProfitDelta: 9.1,  collection: 174000, collectionInvoices: 37, purchases: 41000, purchaseOrders: 11 },
  "This Week": { revenue: 1480500,revenueDelta: 7.6,  expenditures: 312400,expendituresDelta: 2.4, grossProfit: 1168100,grossProfitDelta: 10.3,collection: 1102000,collectionInvoices: 218,purchases: 184000,purchaseOrders: 46 },
  "This Month":{ revenue: 6240800,revenueDelta: 14.2, expenditures: 1280400,expendituresDelta: 5.1,grossProfit: 4960400,grossProfitDelta: 16.7,collection: 4820000,collectionInvoices: 812,purchases: 740000,purchaseOrders: 132 },
  "This Year": { revenue: 72340500,revenueDelta: 22.8,expenditures: 15820400,expendituresDelta: 8.4,grossProfit: 56520100,grossProfitDelta: 28.1,collection: 58200000,collectionInvoices: 9420,purchases: 8920000,purchaseOrders: 1480 },
  "Last Year": { revenue: 58920400,revenueDelta: -3.4,expenditures: 14210800,expendituresDelta: -1.2,grossProfit: 44709600,grossProfitDelta: -4.8,collection: 47100000,collectionInvoices: 8120,purchases: 7610000,purchaseOrders: 1320 },
};

function Dashboard() {
  const [period, setPeriod] = useState<Period>("Today");
  const k = kpiSets[period];

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Good morning, Aisha</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here's what's happening across your business today.</p>
        </div>
        <div className="inline-flex flex-wrap items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition",
                period === p ? "bg-blue-600 text-white shadow" : "text-slate-600 hover:bg-slate-100",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Today's Revenue" value={tzs(k.revenue)} delta={k.revenueDelta} icon={Wallet} positiveIsGood />
        <KpiCard label="Today's Expenditures" value={tzs(k.expenditures)} delta={k.expendituresDelta} icon={Receipt} positiveIsGood={false} />
        <KpiCard label="Gross Profit" value={tzs(k.grossProfit)} delta={k.grossProfitDelta} icon={TrendingUp} positiveIsGood />
        <KpiCard label="Today's Collection" value={tzs(k.collection)} subtitle={`${k.collectionInvoices} invoices`} icon={HandCoins} />
        <KpiCard label="Today's Purchases" value={tzs(k.purchases)} subtitle={`${k.purchaseOrders} orders`} icon={ShoppingCart} />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Card className="lg:col-span-8">
          <CardHeader title="Sales Trend" subtitle="Revenue across the last 6 months" />
          <EChart
            height={300}
            option={{
              tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
              grid: { left: 50, right: 16, top: 24, bottom: 40 },
              xAxis: {
                type: "category",
                data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                axisLine: { lineStyle: { color: "#cbd5e1" } },
                axisTick: { show: false },
              },
              yAxis: {
                type: "value",
                splitLine: { lineStyle: { color: "#eef2f7" } },
                axisLabel: { formatter: (v: number) => (v / 1_000_000).toFixed(1) + "M" },
              },
              series: [
                {
                  name: "Revenue",
                  type: "bar",
                  data: [
                    { value: 4_200_000, itemStyle: { color: "#93c5fd" } },
                    { value: 4_850_000, itemStyle: { color: "#93c5fd" } },
                    { value: 5_120_000, itemStyle: { color: "#93c5fd" } },
                    { value: 4_900_000, itemStyle: { color: "#93c5fd" } },
                    { value: 5_870_000, itemStyle: { color: "#93c5fd" } },
                    { value: 6_240_000, itemStyle: { color: "#1d4ed8" } },
                  ],
                  barWidth: 28,
                  itemStyle: { borderRadius: [8, 8, 0, 0] },
                },
              ],
            }}
          />
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <Legend color="#93c5fd" label="Previous months" />
            <Legend color="#1d4ed8" label="Current month" />
          </div>
        </Card>

        <div className="space-y-5 lg:col-span-4">
          <Card>
            <CardHeader title="Debtors & Creditors" />
            <div className="divide-y divide-slate-100">
              <Row to="/stakeholders/customers" icon={Users} label="Debtors (12)" right={<span className="text-sm font-semibold text-foreground">{tzs(4_200_000)}</span>} />
              <Row to="/stakeholders/suppliers" icon={Users} label="Creditors (5)" right={<span className="text-sm font-semibold text-foreground">{tzs(1_800_000)}</span>} />
              <Row to="/sales/invoices" icon={Clock4} label="Due Invoices" right={<Badge tone="amber">7</Badge>} />
              <Row to="/sales/invoices" icon={AlertTriangle} label="Overdue Invoices" right={<Badge tone="red">3</Badge>} />
            </div>
          </Card>

          <Card>
            <CardHeader title="Approvals Needed" />
            <div className="divide-y divide-slate-100">
              <Row to="/finance/payment-vouchers" icon={Coins} label="Payments" right={<Badge tone="amber">4</Badge>} />
              <Row to="/finance/payment-vouchers" icon={Banknote} label="Issue Cash/Cheque" right={<Badge tone="red">2</Badge>} />
              <Row to="/products/purchase-orders" icon={FileText} label="Purchase Orders" right={<Badge tone="blue">3</Badge>} />
              <Row to="/hr/payroll" icon={FileCheck2} label="Payroll" right={<Badge tone="green">1</Badge>} />
              <Row to="/hr/leave" icon={Calendar} label="Leave Requests" right={<Badge tone="amber">5</Badge>} />
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Col 1: Bank & Cash + Stock Alerts */}
        <Card>
          <CardHeader title="Bank & Cash" />
          <div className="divide-y divide-slate-100">
            <Row to="/finance/bank-cash" icon={Coins} label="Cash Account" right={<span className="text-sm font-semibold">{tzs(320_000)}</span>} />
            <Row
              to="/finance/bank-cash"
              icon={Landmark}
              label="NMB Mbezi Luis"
              sublabel="Acct • 4012 9981 23"
              right={<span className="text-sm font-semibold">{tzs(1_200_000)}</span>}
            />
          </div>

          <div className="my-4 h-px bg-slate-100" />

          <CardHeader title="Stock Alerts" />
          <div className="divide-y divide-slate-100">
            <Row to="/store/stock" icon={PackageX} label="Low Stock (< 5 qty)" right={<Badge tone="amber">12</Badge>} />
            <Row to="/store/stock" icon={PackageCheck} label="Stock To Be Received" right={<Badge tone="blue">4</Badge>} />
            <Row to="/store/stock" icon={FileWarning} label="Near Expiry" right={<Badge tone="red">2</Badge>} />
          </div>
        </Card>

        {/* Col 2: Top 5 products today */}
        <Card>
          <CardHeader title="Top 5 Products Today" />
          <div className="mt-2 space-y-4">
            {[
              { name: "Product A", value: 48000 },
              { name: "Product B", value: 36000 },
              { name: "Product C", value: 24000 },
              { name: "Product D", value: 18000 },
              { name: "Product E", value: 12000 },
            ].map((p, i, arr) => {
              const max = arr[0].value;
              const pct = Math.round((p.value / max) * 100);
              return (
                <div key={p.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{p.name}</span>
                    <span className="font-semibold text-foreground">{tzs(p.value)}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Col 3: Recent Invoices + HR Snapshot */}
        <Card>
          <CardHeader title="Recent Invoices" />
          <div className="divide-y divide-slate-100">
            {[
              { name: "Acme Trading Ltd", status: "Paid" },
              { name: "Skyline Holdings", status: "Pending" },
              { name: "Bluepeak Industries", status: "Overdue" },
              { name: "Greenfield Co.", status: "Partial" },
              { name: "Harbor Logistics", status: "Draft" },
            ].map((inv) => (
              <Link
                key={inv.name}
                to="/sales/invoices"
                className="flex cursor-pointer items-center justify-between px-1 py-2.5 transition hover:bg-slate-50"
              >
                <span className="truncate text-sm text-foreground">{inv.name}</span>
                <InvoiceStatusPill status={inv.status} />
              </Link>
            ))}
          </div>

          <div className="my-4 h-px bg-slate-100" />

          <CardHeader title="HR Snapshot" />
          <div className="divide-y divide-slate-100">
            <Row to="/hr/leave" icon={Calendar} label="Leave For Approval" right={<Badge tone="amber">3</Badge>} />
            <Row to="/products/expenses" icon={CheckCircle2} label="Imprest To Be Returned" right={<Badge tone="red">2</Badge>} />
          </div>
        </Card>
      </div>
    </div>
  );
}

// --- Sub components ---

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-lg border border-slate-200/80 bg-white shadow-sm", "px-4 py-3.5", className)}>
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-2">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}

type Tone = "red" | "amber" | "blue" | "green" | "slate";
const toneMap: Record<Tone, string> = {
  red: "bg-rose-100 text-rose-700",
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-emerald-100 text-emerald-700",
  slate: "bg-slate-100 text-slate-700",
};

function Badge({ tone = "slate", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold", toneMap[tone])}>
      {children}
    </span>
  );
}

const invoicePillTone: Record<string, Tone> = {
  Paid: "green",
  Pending: "amber",
  Overdue: "red",
  Partial: "amber",
  Draft: "slate",
};

function InvoiceStatusPill({ status }: { status: string }) {
  const tone = invoicePillTone[status] ?? "slate";
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", toneMap[tone])}>
      {status}
    </span>
  );
}

function Row({
  to, icon: Icon, label, sublabel, right,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sublabel?: string;
  right: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex cursor-pointer items-center justify-between gap-3 px-1 py-2.5 transition hover:bg-slate-50"
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <Icon className="h-4 w-4 shrink-0 text-slate-500" />
        <span className="min-w-0">
          <span className="block truncate text-sm text-foreground">{label}</span>
          {sublabel && <span className="block truncate text-[11px] text-muted-foreground">{sublabel}</span>}
        </span>
      </span>
      <span className="shrink-0">{right}</span>
    </Link>
  );
}

// Trend KPI card
function KpiCard({
  label, value, delta, subtitle, icon: Icon, positiveIsGood = true,
}: {
  label: string;
  value: string;
  delta?: number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  positiveIsGood?: boolean;
}) {
  const up = (delta ?? 0) >= 0;
  const good = positiveIsGood ? up : !up;
  return (
    <div className="rounded-lg border border-slate-200/80 bg-white px-4 py-3.5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
      <p className="mt-2 text-xl font-bold tracking-tight text-foreground">{value}</p>
      <div className="mt-2 text-xs">
        {delta !== undefined ? (
          <span className={cn("inline-flex items-center gap-0.5 font-medium", good ? "text-emerald-600" : "text-rose-600")}>
            {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {up ? "+" : ""}{delta}%
            <span className="ml-1 font-normal text-muted-foreground">vs last period</span>
          </span>
        ) : (
          <span className="text-muted-foreground">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
