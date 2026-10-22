import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Package, Receipt, ShoppingCart, TrendingUp, Wallet } from "lucide-react";
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
      note: `${data.salesCount} transactions`,
      icon: Wallet,
      tone: "bg-emerald-50 text-emerald-800",
    },
    {
      label: lang === "en" ? "Today's expenses" : "Matumizi ya leo",
      value: money(data.expenses),
      note: "Approved expenses",
      icon: Receipt,
      tone: "bg-rose-50 text-rose-800",
    },
    {
      label: lang === "en" ? "Today's purchases" : "Manunuzi ya leo",
      value: money(data.purchases),
      note: "Purchase orders",
      icon: ShoppingCart,
      tone: "bg-blue-50 text-blue-800",
    },
    {
      label: lang === "en" ? "Operating margin" : "Faida ya uendeshaji",
      value: money(data.grossMargin),
      note: "Sales minus expenses",
      icon: TrendingUp,
      tone: "bg-violet-50 text-violet-800",
    },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">
          {lang === "en" ? "Pharmacy overview" : "Muhtasari wa Duka la Dawa"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {lang === "en"
            ? "Live figures from posted database transactions for today."
            : "Takwimu halisi za miamala ya leo."}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, note, icon: Icon, tone }) => (
          <div key={label} className="glass-card p-5">
            <div className={`mb-4 grid h-10 w-10 place-items-center rounded-xl ${tone}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold uppercase text-muted-foreground">{label}</p>
            <p className="mt-1 text-xl font-black">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="glass-card p-5 lg:col-span-2">
          <h2 className="mb-4 font-bold">
            {lang === "en" ? "Top-selling products" : "Bidhaa Zinazouzwa Zaidi"}
          </h2>
          {data.topProducts.length ? (
            <div className="divide-y">
              {data.topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="grid grid-cols-[2rem_1fr_auto_auto] items-center gap-3 py-3 text-sm"
                >
                  <span className="font-black text-muted-foreground">{index + 1}</span>
                  <span className="font-semibold">{product.name}</span>
                  <span>{product.quantity} sold</span>
                  <span className="font-bold">{money(product.revenue)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No completed sales yet.
            </p>
          )}
        </section>
        <section className="glass-card p-5">
          <h2 className="mb-4 font-bold">
            {lang === "en" ? "Stock attention" : "Tahadhari za Bidhaa"}
          </h2>
          <div className="space-y-3">
            <AlertLink to="/store/stock" label="Low stock" count={data.lowStock} tone="amber" />
            <AlertLink to="/store/stock" label="Out of stock" count={data.outOfStock} tone="red" />
            <AlertLink
              to="/store/stock"
              label="Expiring within 90 days"
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
        </section>
      </div>
    </div>
  );
}

function AlertLink({
  to,
  label,
  count,
  tone,
}: {
  to: string;
  label: string;
  count: number;
  tone: "amber" | "red" | "orange";
}) {
  const color =
    tone === "red"
      ? "bg-rose-50 text-rose-800"
      : tone === "orange"
        ? "bg-orange-50 text-orange-800"
        : "bg-amber-50 text-amber-800";
  return (
    <Link to={to} className={`flex items-center gap-3 rounded-xl p-3 ${color}`}>
      <AlertTriangle className="h-4 w-4" />
      <span className="flex-1 text-sm font-semibold">{label}</span>
      <span className="font-black">{count}</span>
    </Link>
  );
}
