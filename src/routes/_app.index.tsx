import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarX,
  FileWarning,
  Package,
  PackageCheck,
  PackageX,
  Receipt,
  ShoppingCart,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { EChart } from "@/components/charts/EChart";
import { GlassCard } from "@/components/erp/GlassCard";
import { KpiCard } from "@/components/erp/KpiCard";
import { getDashboardFn } from "@/lib/api/operations";
import { useTranslate } from "@/lib/i18n";

type DashboardData = {
  revenue: number;
  salesCount: number;
  expenses: number;
  purchases: number;
  grossMargin: number;
  lowStock: number;
  outOfStock: number;
  expired: number;
  nearExpiry: number;
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
  topCustomers: Array<{ name: string; revenue: number }>;
  monthlySales: Array<{ month: string; revenue: number; salesCount: number }>;
};

const BRAND = "#1f9c88";
const BRAND_SOFT = "#a6e3dd";
const INK_MUTED = "#64748b";
const GRID = "#f1f5f9";

function compact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — DeveleERP" },
      { name: "description", content: "Live pharmacy overview." },
    ],
  }),
  loader: () => getDashboardFn(),
  component: Dashboard,
});

const money = (value: number) => `TZS ${new Intl.NumberFormat("en-TZ").format(value)}`;

function Dashboard() {
  const data = Route.useLoaderData() as DashboardData;
  const { lang } = useTranslate();
  const cards = [
    {
      label: lang === "en" ? "Today's sales" : "Mauzo ya leo",
      value: money(data.revenue),
      note: lang === "en" ? `${data.salesCount} transactions` : `Miamala ${data.salesCount}`,
      icon: Wallet,
      tint: "emerald" as const,
    },
    {
      label: lang === "en" ? "Today's expenses" : "Matumizi ya leo",
      value: money(data.expenses),
      note: lang === "en" ? "Approved expenses" : "Matumizi yaliyoidhinishwa",
      icon: Receipt,
      tint: "amber" as const,
    },
    {
      label: lang === "en" ? "Today's purchases" : "Manunuzi ya leo",
      value: money(data.purchases),
      note: lang === "en" ? "Purchase orders" : "Maagizo ya manunuzi",
      icon: ShoppingCart,
      tint: "blue" as const,
    },
    {
      label: lang === "en" ? "Operating margin" : "Faida ya uendeshaji",
      value: money(data.grossMargin),
      note: lang === "en" ? "Sales minus expenses" : "Mauzo ukitoa matumizi",
      icon: TrendingUp,
      tint: "violet" as const,
    },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {lang === "en" ? "Pharmacy overview" : "Muhtasari wa Duka la Dawa"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {lang === "en"
            ? "Live figures from posted database transactions for today."
            : "Takwimu halisi za miamala ya leo."}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, note, icon, tint }) => (
          <KpiCard key={label} label={label} value={value} hint={note} icon={icon} tint={tint} />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <SalesTrendCard months={data.monthlySales} lang={lang} />
        <GlassCard>
          <div className="mb-2 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-foreground">
              {lang === "en" ? "Stock attention" : "Tahadhari za Bidhaa"}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {lang === "en" ? "Items requiring action" : "Bidhaa zinazohitaji hatua"}
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            <AlertLink
              tab="stock"
              filter="low"
              icon={PackageCheck}
              label={lang === "en" ? "Low stock" : "Bidhaa chache"}
              count={data.lowStock}
              tone="amber"
            />
            <AlertLink
              tab="stock"
              filter="out"
              icon={PackageX}
              label={lang === "en" ? "Out of stock" : "Bidhaa zimeisha"}
              count={data.outOfStock}
              tone="red"
            />
            <AlertLink
              tab="batches"
              filter="expired"
              icon={CalendarX}
              label={lang === "en" ? "Expired batches" : "Makundi yaliyoisha muda"}
              count={data.expired}
              tone="red"
            />
            <AlertLink
              tab="batches"
              filter="expiring"
              icon={FileWarning}
              label={lang === "en" ? "Expiring within 90 days" : "Zinaisha muda ndani ya siku 90"}
              count={data.nearExpiry}
              tone="orange"
            />
          </div>
          <Link
            to="/products/purchase-orders/new"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f9c88] px-4 py-2.5 text-sm font-bold text-white"
          >
            <Package className="h-4 w-4" /> Record purchase
          </Link>
        </GlassCard>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <RankingCard
          title={lang === "en" ? "Top-selling products" : "Bidhaa zinazouzwa zaidi"}
          subtitle={
            lang === "en" ? "Revenue from completed sales" : "Mapato ya mauzo yaliyokamilika"
          }
          rows={data.topProducts}
          empty={lang === "en" ? "No completed sales yet." : "Bado hakuna mauzo yaliyokamilika."}
        />
        <RankingCard
          title={lang === "en" ? "Top customers" : "Wateja wakubwa"}
          subtitle={
            lang === "en"
              ? "Registered customers by spend"
              : "Wateja waliosajiliwa kwa manunuzi yao"
          }
          rows={data.topCustomers}
          empty={
            lang === "en"
              ? "No sales to registered customers yet."
              : "Bado hakuna mauzo kwa wateja waliosajiliwa."
          }
        />
      </div>
    </div>
  );
}

function SalesTrendCard({ months, lang }: { months: DashboardData["monthlySales"]; lang: string }) {
  const labels = months.map(({ month }) =>
    new Date(`${month}-01T00:00:00`).toLocaleString(lang === "en" ? "en-GB" : "sw-TZ", {
      month: "short",
    }),
  );
  const bestIndex = months.reduce(
    (top, item, index) => (item.revenue > months[top].revenue ? index : top),
    0,
  );
  const average = Math.round(months.reduce((sum, item) => sum + item.revenue, 0) / months.length);
  const current = months[months.length - 1];
  const previous = months[months.length - 2];
  const growth = previous.revenue
    ? ((current.revenue - previous.revenue) / previous.revenue) * 100
    : null;
  return (
    <GlassCard className="lg:col-span-2">
      <div className="mb-2 border-b border-slate-100 pb-3">
        <h2 className="text-sm font-semibold text-foreground">
          {lang === "en" ? "Sales trend" : "Mwenendo wa mauzo"}
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {lang === "en"
            ? "Completed sales, last 6 months"
            : "Mauzo yaliyokamilika, miezi 6 iliyopita"}
        </p>
      </div>
      <EChart
        height={280}
        option={{
          legend: { show: false },
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            confine: true,
            valueFormatter: (value) => money(Number(value)),
          },
          grid: { left: 8, right: 8, top: 16, bottom: 8, containLabel: true },
          xAxis: {
            type: "category",
            data: labels,
            axisLine: { lineStyle: { color: "#cbd5e1" } },
            axisTick: { show: false },
            axisLabel: { fontSize: 12, color: INK_MUTED },
          },
          yAxis: {
            type: "value",
            splitLine: { lineStyle: { color: GRID, type: "dashed" } },
            axisLabel: {
              formatter: (value: number) => compact(value),
              fontSize: 11,
              color: INK_MUTED,
            },
          },
          series: [
            {
              name: lang === "en" ? "Revenue" : "Mapato",
              type: "bar",
              barMaxWidth: 32,
              // The current month is emphasised; earlier months recede.
              data: months.map((item, index) => ({
                value: item.revenue,
                itemStyle: { color: index === months.length - 1 ? BRAND : BRAND_SOFT },
              })),
              itemStyle: { borderRadius: [4, 4, 0, 0] },
            },
          ],
        }}
      />
      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
        <Stat
          label={lang === "en" ? "Best month" : "Mwezi bora"}
          value={
            months[bestIndex].revenue
              ? `${labels[bestIndex]} · ${money(months[bestIndex].revenue)}`
              : "—"
          }
        />
        <Stat
          label={lang === "en" ? "Monthly average" : "Wastani wa mwezi"}
          value={money(average)}
        />
        <Stat
          label={lang === "en" ? "vs last month" : "Dhidi ya mwezi uliopita"}
          value={growth === null ? "—" : `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`}
        />
      </div>
    </GlassCard>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50/60 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

function RankingCard({
  title,
  subtitle,
  rows,
  empty,
}: {
  title: string;
  subtitle: string;
  rows: Array<{ name: string; revenue: number }>;
  empty: string;
}) {
  // ECharts draws category axes bottom-up, so reverse to put the leader on top.
  const ordered = [...rows].reverse();
  return (
    <GlassCard>
      <div className="mb-2 border-b border-slate-100 pb-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {rows.length ? (
        <EChart
          height={Math.max(160, rows.length * 44)}
          option={{
            legend: { show: false },
            tooltip: {
              trigger: "axis",
              axisPointer: { type: "shadow" },
              confine: true,
              valueFormatter: (value) => money(Number(value)),
            },
            grid: { left: 8, right: 56, top: 8, bottom: 8, containLabel: true },
            xAxis: { type: "value", show: false },
            yAxis: {
              type: "category",
              data: ordered.map((row) => row.name),
              axisLine: { show: false },
              axisTick: { show: false },
              axisLabel: { fontSize: 12, color: "#334155", width: 140, overflow: "truncate" },
            },
            series: [
              {
                type: "bar",
                data: ordered.map((row) => row.revenue),
                barMaxWidth: 16,
                itemStyle: { color: BRAND, borderRadius: [0, 4, 4, 0] },
                label: {
                  show: true,
                  position: "right",
                  color: INK_MUTED,
                  fontSize: 11,
                  formatter: ({ value }) => compact(Number(value)),
                },
              },
            ],
          }}
        />
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground">{empty}</p>
      )}
    </GlassCard>
  );
}

function AlertLink({
  tab,
  filter,
  icon: Icon,
  label,
  count,
  tone,
}: {
  tab: "stock" | "batches";
  filter: "low" | "out" | "expired" | "expiring";
  icon: LucideIcon;
  label: string;
  count: number;
  tone: "amber" | "red" | "orange";
}) {
  // A non-zero red count is shown solid so problems stand out at a glance.
  const badgeColor =
    tone === "red"
      ? count > 0
        ? "bg-rose-600 text-white"
        : "bg-rose-100 text-rose-700"
      : tone === "orange"
        ? "bg-orange-100 text-orange-700"
        : "bg-amber-100 text-amber-700";
  return (
    <Link
      to="/store/stock"
      search={{ tab, filter }}
      className="flex items-center gap-3 px-1 py-3 transition-colors hover:bg-slate-50/80"
    >
      <Icon className="h-4 w-4 shrink-0 text-slate-400" />
      <span className="flex-1 text-sm text-foreground">{label}</span>
      <span
        className={`min-w-7 rounded-full px-2 py-0.5 text-center text-xs font-semibold ${badgeColor}`}
      >
        {count}
      </span>
    </Link>
  );
}
