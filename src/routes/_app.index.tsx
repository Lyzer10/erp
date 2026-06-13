import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { EChart } from "@/components/charts/EChart";
import {
  ArrowUpRight, ArrowDownRight, Wallet, Receipt, TrendingUp, HandCoins,
  ShoppingCart, AlertTriangle, FileWarning, CheckCircle2, Landmark, Banknote,
  PackageX, PackageCheck, Clock4, Users, FileCheck2, FileText, Calendar, Coins,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/_app/")({
  head: () => ({ meta: [{ title: "Dashboard — Lumen ERP" }, { name: "description", content: "Business performance overview." }] }),
  component: Dashboard,
});

const tzs = (n: number) =>
  "TZS " + new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

type Period = "Today" | "Yesterday" | "This Week" | "This Month" | "This Year" | "Last Year";
const PERIODS: Period[] = ["Today", "Yesterday", "This Week", "This Month", "This Year", "Last Year"];

const PERIOD_NAMES: Record<Period, Record<string, string>> = {
  "Today":      { en: "Today", sw: "Leo" },
  "Yesterday":  { en: "Yesterday", sw: "Jana" },
  "This Week":  { en: "This Week", sw: "Wiki Hii" },
  "This Month": { en: "This Month", sw: "Mwezi Huu" },
  "This Year":  { en: "This Year", sw: "Mwaka Huu" },
  "Last Year":  { en: "Last Year", sw: "Mwaka Jana" },
};

type Kpis = {
  revenue: number; revenueDelta: number;
  expenditures: number; expendituresDelta: number;
  grossProfit: number; grossProfitDelta: number;
  collection: number; collectionInvoices: number;
  purchases: number; purchaseOrders: number;
};

const kpiSets: Record<Period, Kpis> = {
  "Today":      { revenue: 284350,   revenueDelta: 12.4,  expenditures: 48200,    expendituresDelta: 3.1,  grossProfit: 236150,   grossProfitDelta: 18.2, collection: 190000,   collectionInvoices: 42,   purchases: 32000,    purchaseOrders: 8    },
  "Yesterday":  { revenue: 251200,   revenueDelta: 4.8,   expenditures: 51400,    expendituresDelta: 6.2,  grossProfit: 199800,   grossProfitDelta: 9.1,  collection: 174000,   collectionInvoices: 37,   purchases: 41000,    purchaseOrders: 11   },
  "This Week":  { revenue: 1480500,  revenueDelta: 7.6,   expenditures: 312400,   expendituresDelta: 2.4,  grossProfit: 1168100,  grossProfitDelta: 10.3, collection: 1102000,  collectionInvoices: 218,  purchases: 184000,   purchaseOrders: 46   },
  "This Month": { revenue: 6240800,  revenueDelta: 14.2,  expenditures: 1280400,  expendituresDelta: 5.1,  grossProfit: 4960400,  grossProfitDelta: 16.7, collection: 4820000,  collectionInvoices: 812,  purchases: 740000,   purchaseOrders: 132  },
  "This Year":  { revenue: 72340500, revenueDelta: 22.8,  expenditures: 15820400, expendituresDelta: 8.4,  grossProfit: 56520100, grossProfitDelta: 28.1, collection: 58200000, collectionInvoices: 9420, purchases: 8920000,  purchaseOrders: 1480 },
  "Last Year":  { revenue: 58920400, revenueDelta: -3.4,  expenditures: 14210800, expendituresDelta: -1.2, grossProfit: 44709600, grossProfitDelta: -4.8, collection: 47100000, collectionInvoices: 8120, purchases: 7610000,  purchaseOrders: 1320 },
};

function Dashboard() {
  const { lang, t } = useTranslate();
  const [period, setPeriod] = useState<Period>("Today");
  const [selectedBranch, setSelectedBranch] = useState<string>("All");
  const [topTab, setTopTab] = useState<"products" | "customers">("products");

  const getFilteredValue = (val: number) => {
    if (selectedBranch === "Head Office") return val * 0.6;
    if (selectedBranch === "Westlands") return val * 0.25;
    if (selectedBranch === "Mombasa") return val * 0.15;
    return val;
  };

  const k = kpiSets[period];

  const filteredRevenue = getFilteredValue(k.revenue);
  const filteredExpenditures = getFilteredValue(k.expenditures);
  const filteredGrossProfit = getFilteredValue(k.grossProfit);
  const filteredCollection = getFilteredValue(k.collection);
  const filteredPurchases = getFilteredValue(k.purchases);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("welcome")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("welcomeSub")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Branch Switcher */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="rounded-full border border-slate-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-sm outline-none backdrop-blur focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">{lang === "en" ? "All Branches" : "Matawi Yote"}</option>
            <option value="Head Office">{lang === "en" ? "Head Office" : "Makao Makuu"}</option>
            <option value="Westlands">{lang === "en" ? "Westlands" : "Westlands"}</option>
            <option value="Mombasa">{lang === "en" ? "Mombasa" : "Mombasa"}</option>
          </select>

          {/* Period Selection */}
          <div className="inline-flex flex-wrap items-center gap-1 rounded-full border border-slate-200/80 bg-white/80 p-1 shadow-sm backdrop-blur">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition cursor-pointer",
                  period === p ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100",
                )}
              >
                {PERIOD_NAMES[p]?.[lang] || p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label={t("revenue")} value={tzs(filteredRevenue)} delta={k.revenueDelta} icon={Wallet} positiveIsGood />
        <KpiCard label={t("expenditures")} value={tzs(filteredExpenditures)} delta={k.expendituresDelta} icon={Receipt} positiveIsGood={false} />
        <KpiCard label={t("grossProfit")} value={tzs(filteredGrossProfit)} delta={k.grossProfitDelta} icon={TrendingUp} positiveIsGood />
        <KpiCard label={t("collection")} value={tzs(filteredCollection)} subtitle={`${k.collectionInvoices} ` + (lang === "en" ? "invoices" : "ankara")} icon={HandCoins} />
        <KpiCard label={t("purchases")} value={tzs(filteredPurchases)} subtitle={`${k.purchaseOrders} ` + (lang === "en" ? "maagizo" : "maagizo")} icon={ShoppingCart} />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Card className="lg:col-span-8">
          <CardHeader title={lang === "en" ? "Sales Trend" : "Mwenendo wa Mauzo"} subtitle={lang === "en" ? "Revenue across the last 6 months" : "Mapato ya miezi 6 iliyopita"} />
          <EChart
            height={350}
            option={{
              legend: { show: false },
              tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, confine: true },
              toolbox: {
                show: true,
                right: 10,
                top: 0,
                feature: {
                  saveAsImage: { show: true, title: lang === "en" ? "Save Image" : "Hifadhi Picha" },
                  dataView: { show: true, readOnly: true, title: lang === "en" ? "Data View" : "Angalia Data", lang: [lang === "en" ? "Data View" : "Angalia Data", lang === "en" ? "Close" : "Funga", lang === "en" ? "Refresh" : "Sasisha"] },
                  magicType: { show: true, type: ["line", "bar"], title: { line: lang === "en" ? "Line Chart" : "Mchoro wa Mstari", bar: lang === "en" ? "Bar Chart" : "Mchoro wa Mwamba" } }
                }
              },
              grid: { left: 52, right: 16, top: 50, bottom: 28 },
              xAxis: {
                type: "category",
                data: lang === "en" ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] : ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun"],
                axisLine: { lineStyle: { color: "#cbd5e1" } },
                axisTick: { show: false },
                axisLabel: { fontSize: 12, color: "#64748b" },
              },
              yAxis: {
                type: "value",
                splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
                axisLabel: { formatter: (v: number) => (v / 1_000_000).toFixed(1) + "M", fontSize: 11, color: "#94a3b8" },
              },
              series: [
                {
                  name: lang === "en" ? "Revenue" : "Mapato",
                  type: "bar",
                  data: [
                    { value: getFilteredValue(4_200_000), itemStyle: { color: "#a6e3dd" } },
                    { value: getFilteredValue(4_850_000), itemStyle: { color: "#a6e3dd" } },
                    { value: getFilteredValue(5_120_000), itemStyle: { color: "#a6e3dd" } },
                    { value: getFilteredValue(4_900_000), itemStyle: { color: "#a6e3dd" } },
                    { value: getFilteredValue(5_870_000), itemStyle: { color: "#a6e3dd" } },
                    { value: getFilteredValue(6_240_000), itemStyle: { color: "#1f9c88" } },
                  ],
                  barWidth: 28,
                  itemStyle: { borderRadius: [6, 6, 0, 0] },
                },
              ],
            }}
          />
          <div className="mt-2 flex items-center justify-center gap-5 text-xs text-muted-foreground">
            <Legend color="#a6e3dd" label={lang === "en" ? "Previous months" : "Miezi iliyopita"} />
            <Legend color="#1f9c88" label={lang === "en" ? "Current month" : "Mwezi huu"} />
          </div>
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-xl bg-slate-50/50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {lang === "en" ? "Best Month" : "Mwezi Bora"}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  {lang === "en" ? "June" : "Juni"} ({tzs(getFilteredValue(6240000))})
                </p>
              </div>
              <div className="rounded-xl bg-slate-50/50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {lang === "en" ? "Monthly Average" : "Wastani wa Mwezi"}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">{tzs(getFilteredValue(5196667))}</p>
              </div>
              <div className="rounded-xl bg-slate-50/50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {lang === "en" ? "Growth Rate" : "Kasi ya Ukuaji"}
                </p>
                <p className="mt-1 text-sm font-bold text-emerald-600">+8.7% MoM</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-5 lg:col-span-4">
          <Card>
            <CardHeader title={lang === "en" ? "Debtors & Creditors" : "Wadaiwa & Wadai"} />
            <div className="divide-y divide-slate-100">
              <Row to="/stakeholders/customers" icon={Users} label={lang === "en" ? "Debtors (12)" : "Wadaiwa (12)"} right={<span className="text-sm font-semibold">{tzs(4_200_000)}</span>} />
              <Row to="/stakeholders/suppliers" icon={Users} label={lang === "en" ? "Creditors (5)" : "Wadai (5)"} right={<span className="text-sm font-semibold">{tzs(1_800_000)}</span>} />
              <Row to="/sales/invoices" icon={Clock4} label={lang === "en" ? "Due Invoices" : "Ankara Zinazostahili"} right={<Badge tone="amber">7</Badge>} />
              <Row to="/sales/invoices" icon={AlertTriangle} label={lang === "en" ? "Overdue Invoices" : "Ankara Zilizopitwa na Muda"} right={<Badge tone="red">3</Badge>} />
            </div>
          </Card>

          <Card>
            <CardHeader title={lang === "en" ? "Approvals Needed" : "Uidhinishaji Unaohitajika"} />
            <div className="divide-y divide-slate-100">
              <Row to="/finance/payment-vouchers" icon={Coins} label={lang === "en" ? "Payments" : "Malipo"} right={<Badge tone="amber">4</Badge>} />
              <Row to="/finance/payment-vouchers" icon={Banknote} label={lang === "en" ? "Issue Cash / Cheque" : "Toa Taslimu / Hundi"} right={<Badge tone="red">2</Badge>} />
              <Row to="/products/purchase-orders" icon={FileText} label={t("purchaseOrder")} right={<Badge tone="blue">3</Badge>} />
              <Row to="/hr/payroll" icon={FileCheck2} label={t("payroll")} right={<Badge tone="green">1</Badge>} />
              <Row to="/hr/leave" icon={Calendar} label={t("leaveLabel")} right={<Badge tone="amber">5</Badge>} />
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader title={t("bankCash")} />
          <div className="divide-y divide-slate-100">
            <Row to="/finance/bank-cash" icon={Coins} label={t("cashAccount")} right={<span className="text-sm font-semibold">{tzs(320_000)}</span>} />
            <Row
              to="/finance/bank-cash"
              icon={Landmark}
              label="NMB Mbezi Luis"
              sublabel="Acct 4012 9981 23"
              right={<span className="text-sm font-semibold">{tzs(1_200_000)}</span>}
            />
          </div>
          <div className="my-4 h-px bg-slate-100" />
          <CardHeader title={lang === "en" ? "Stock Alerts" : "Arifa za Stoo"} />
          <div className="divide-y divide-slate-100">
            <Row to="/store/stock" icon={PackageX} label={lang === "en" ? "Low Stock (under 5)" : "Kiwango cha Chini (chini ya 5)"} right={<Badge tone="amber">12</Badge>} />
            <Row to="/store/stock" icon={PackageCheck} label={lang === "en" ? "Stock To Be Received" : "Bidhaa Zinazotarajiwa Kupokewa"} right={<Badge tone="blue">4</Badge>} />
            <Row to="/store/stock" icon={FileWarning} label={lang === "en" ? "Near Expiry" : "Karibu na Mwisho wa Matumizi"} right={<Badge tone="red">2</Badge>} />
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex gap-2">
              <button
                onClick={() => setTopTab("products")}
                className={cn(
                  "text-xs font-semibold pb-1.5 border-b-2 transition cursor-pointer",
                  topTab === "products" ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                {lang === "en" ? "Top Products" : "Bidhaa Maarufu"}
              </button>
              <button
                onClick={() => setTopTab("customers")}
                className={cn(
                  "text-xs font-semibold pb-1.5 border-b-2 transition cursor-pointer",
                  topTab === "customers" ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                {lang === "en" ? "Top Customers" : "Wateja Maarufu"}
              </button>
            </div>
          </div>

          <EChart
            height={240}
            option={{
              tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, confine: true },
              grid: { left: 90, right: 16, top: 8, bottom: 20 },
              xAxis: { type: "value", show: false },
              yAxis: {
                type: "category",
                data: topTab === "products"
                  ? [
                      lang === "en" ? "Product E" : "Bidhaa E",
                      lang === "en" ? "Product D" : "Bidhaa D",
                      lang === "en" ? "Product C" : "Bidhaa C",
                      lang === "en" ? "Product B" : "Bidhaa B",
                      lang === "en" ? "Product A" : "Bidhaa A",
                    ]
                  : [
                      "Harbor Logistics",
                      "Greenfield Co.",
                      "Bluepeak Ind.",
                      "Skyline Holdings",
                      "Acme Trading Ltd",
                    ],
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { fontSize: 11, color: "#64748b" }
              },
              series: [
                {
                  type: "bar",
                  data: topTab === "products"
                    ? [getFilteredValue(12000), getFilteredValue(18000), getFilteredValue(24000), getFilteredValue(36000), getFilteredValue(48000)]
                    : [getFilteredValue(15000), getFilteredValue(29000), getFilteredValue(38000), getFilteredValue(45000), getFilteredValue(62000)],
                  itemStyle: { color: "#1f9c88", borderRadius: [0, 4, 4, 0] },
                  barWidth: 14
                }
              ]
            }}
          />
        </Card>

        <Card>
          <CardHeader title={lang === "en" ? "Recent Invoices" : "Ankara za Hivi Karibuni"} />
          <div className="divide-y divide-slate-100">
            {[
              { name: "Acme Trading Ltd",    status: "Paid"    },
              { name: "Skyline Holdings",    status: "Pending" },
              { name: "Bluepeak Industries", status: "Overdue" },
              { name: "Greenfield Co.",      status: "Partial" },
              { name: "Harbor Logistics",    status: "Draft"   },
            ].map((inv) => (
              <Link
                key={inv.name}
                to="/sales/invoices"
                className="flex cursor-pointer items-center justify-between px-1 py-2.5 transition hover:bg-slate-50/80"
              >
                <span className="truncate text-sm text-foreground">{inv.name}</span>
                <InvoiceStatusPill status={inv.status} />
              </Link>
            ))}
          </div>
          <div className="my-4 h-px bg-slate-100" />
          <CardHeader title={lang === "en" ? "HR Snapshot" : "Picha Haraka ya HR"} />
          <div className="divide-y divide-slate-100">
            <Row to="/hr/leave" icon={Calendar} label={lang === "en" ? "Leave For Approval" : "Likizo za Kuidhinishwa"} right={<Badge tone="amber">3</Badge>} />
            <Row to="/products/expenses" icon={CheckCircle2} label={lang === "en" ? "Imprest To Be Returned" : "Imprest ya Kurudishwa"} right={<Badge tone="red">2</Badge>} />
          </div>
        </Card>
      </div>
    </div>
  );
}

// --- Sub-components ---

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("glass-card px-4 py-4", className)}>
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
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
  red:   "bg-rose-100 text-rose-700",
  amber: "bg-amber-100 text-amber-700",
  blue:  "bg-blue-100 text-blue-700",
  green: "bg-emerald-100 text-emerald-700",
  slate: "bg-slate-100 text-slate-600",
};

function Badge({ tone = "slate", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold", toneMap[tone])}>
      {children}
    </span>
  );
}

const invoicePillTone: Record<string, Tone> = {
  Paid: "green", Pending: "amber", Overdue: "red", Partial: "amber", Draft: "slate",
};

function InvoiceStatusPill({ status }: { status: string }) {
  const { lang } = useTranslate();
  const statusTranslations: Record<string, Record<string, string>> = {
    Paid: { en: "Paid", sw: "Imelipwa" },
    Pending: { en: "Pending", sw: "Inasubiri" },
    Overdue: { en: "Overdue", sw: "Muda Umeisha" },
    Partial: { en: "Partial", sw: "Kiasi" },
    Draft: { en: "Draft", sw: "Rasimu" },
  };
  const tone = invoicePillTone[status] ?? "slate";
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", toneMap[tone])}>
      {statusTranslations[status]?.[lang] || status}
    </span>
  );
}

function Row({
  to, icon: Icon, label, sublabel, right,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  sublabel?: string;
  right: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex cursor-pointer items-center justify-between gap-3 px-1 py-2.5 transition hover:bg-slate-50/80"
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <Icon className="h-4 w-4 shrink-0 text-slate-400" />
        <span className="min-w-0">
          <span className="block truncate text-sm text-foreground">{label}</span>
          {sublabel && <span className="block truncate text-[11px] text-muted-foreground">{sublabel}</span>}
        </span>
      </span>
      <span className="shrink-0">{right}</span>
    </Link>
  );
}

function KpiCard({
  label, value, delta, subtitle, icon: Icon, positiveIsGood = true,
}: {
  label: string;
  value: string;
  delta?: number;
  subtitle?: string;
  icon: LucideIcon;
  positiveIsGood?: boolean;
}) {
  const { lang } = useTranslate();
  const up = (delta ?? 0) >= 0;
  const good = positiveIsGood ? up : !up;
  return (
    <div className="glass-card px-5 py-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 shrink-0 text-slate-400" />
      </div>
      <p className="mt-2.5 text-xl font-bold tracking-tight text-foreground">{value}</p>
      <div className="mt-2 text-xs">
        {delta !== undefined ? (
          <span className={cn("inline-flex items-center gap-0.5 font-medium", good ? "text-emerald-600" : "text-rose-600")}>
            {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {up ? "+" : ""}{delta}%
            <span className="ml-1 font-normal text-muted-foreground">
              {lang === "en" ? "vs last period" : "ikilinganishwa na jana"}
            </span>
          </span>
        ) : (
          <span className="text-muted-foreground">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
