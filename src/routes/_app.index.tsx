import { createFileRoute, Link } from "@tanstack/react-router";
import { FileWarning, Package, PackageCheck, PackageX, Receipt, ShoppingCart, TrendingUp, Wallet, type LucideIcon } from "lucide-react";
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
  nearExpiry: number;
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
};

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
  const highestProductRevenue = Math.max(...data.topProducts.map((product) => product.revenue), 1);
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
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-foreground">
              {lang === "en" ? "Top-selling products" : "Bidhaa Zinazouzwa Zaidi"}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {lang === "en" ? "Ranked by today's posted sales" : "Kwa mauzo ya leo yaliyokamilika"}
            </p>
          </div>
          {data.topProducts.length ? (
            <div className="space-y-4">
              {data.topProducts.map((product, index) => (
                <div key={product.name} className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="min-w-0">
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span className="truncate font-medium text-foreground">
                        <span className="mr-2 text-xs font-semibold text-slate-400">{index + 1}</span>
                        {product.name}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {product.quantity} {lang === "en" ? "sold" : "zimeuzwa"}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#1f9c88]"
                        style={{ width: `${Math.max((product.revenue / highestProductRevenue) * 100, 4)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-right text-sm font-semibold text-foreground">
                    {money(product.revenue)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No completed sales yet.
            </p>
          )}
        </GlassCard>
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
            <AlertLink to="/store/stock" icon={PackageCheck} label={lang === "en" ? "Low stock" : "Bidhaa chache"} count={data.lowStock} tone="amber" />
            <AlertLink to="/store/stock" icon={PackageX} label={lang === "en" ? "Out of stock" : "Bidhaa zimeisha"} count={data.outOfStock} tone="red" />
            <AlertLink
              to="/store/stock"
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
    </div>
  );
}

function AlertLink({
  to,
  icon: Icon,
  label,
  count,
  tone,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  count: number;
  tone: "amber" | "red" | "orange";
}) {
  const badgeColor =
    tone === "red"
      ? "bg-rose-100 text-rose-700"
      : tone === "orange"
        ? "bg-orange-100 text-orange-700"
        : "bg-amber-100 text-amber-700";
  return (
    <Link to={to} className="flex items-center gap-3 px-1 py-3 transition-colors hover:bg-slate-50/80">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" />
      <span className="flex-1 text-sm text-foreground">{label}</span>
      <span className={`min-w-7 rounded-full px-2 py-0.5 text-center text-xs font-semibold ${badgeColor}`}>
        {count}
      </span>
    </Link>
  );
}
