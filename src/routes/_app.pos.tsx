import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  Minus,
  Package,
  Plus,
  Receipt,
  ScanLine,
  Search,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { getCustomersFn, getProductsFn } from "@/lib/api/domain";
import { getBusinessSettingsFn } from "@/lib/api/operations";
import { createSaleFn } from "@/lib/api/sales";
import { useTranslate } from "@/lib/i18n";

type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  image?: string | null;
};
type Customer = { id: number; name: string; status: string };
type CartItem = Product & { quantity: number };
type PaymentMethod = "cash" | "mobile" | "credit";

export const Route = createFileRoute("/_app/pos")({
  head: () => ({ meta: [{ title: "Point of Sale — DeveleERP" }] }),
  loader: async () => {
    const [productResult, customerResult, settings] = await Promise.all([
      getProductsFn(),
      getCustomersFn(),
      getBusinessSettingsFn(),
    ]);
    return {
      products: productResult.data as Product[],
      customers: (customerResult.data as Customer[]).filter(
        (customer) => customer.status === "Active",
      ),
      settings,
      isTestUser: productResult.isTestUser,
    };
  },
  component: PosPage,
});

const money = (value: number) => `TZS ${new Intl.NumberFormat("en-TZ").format(value)}`;

function PosPage() {
  const router = useRouter();
  const { lang } = useTranslate();
  const { products, customers, settings, isTestUser } = Route.useLoaderData();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [customerId, setCustomerId] = useState<number | "">("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [tendered, setTendered] = useState(0);
  const [mobileReference, setMobileReference] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{ receiptNumber: string; total: number } | null>(null);

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const query = search.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) || product.sku.toLowerCase().includes(query)
        );
      }),
    [products, search],
  );
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const safeDiscount = Math.min(Math.max(0, discount), subtotal);
  const tax = Math.round(((subtotal - safeDiscount) * settings.taxRateBasisPoints) / 10000);
  const total = subtotal - safeDiscount + tax;
  const change = paymentMethod === "cash" ? Math.max(0, tendered - total) : 0;

  function add(product: Product) {
    if (product.stock <= 0) return;
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing)
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item,
        );
      return [...current, { ...product, quantity: 1 }];
    });
  }
  function quantity(productId: number, delta: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.min(item.stock, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  async function checkout() {
    setError(null);
    if (!cart.length) return;
    if (paymentMethod === "cash" && tendered < total) {
      setError("Cash tendered is less than the total.");
      return;
    }
    if (paymentMethod === "credit" && !customerId) {
      setError("Choose a registered customer for a credit sale.");
      return;
    }
    if (paymentMethod === "mobile" && !mobileReference.trim()) {
      setError("Enter the confirmed mobile-money reference.");
      return;
    }
    if (isTestUser) {
      setError("Demo mode does not post production sales.");
      return;
    }
    setSaving(true);
    try {
      const sale = await createSaleFn({
        data: {
          customerId: customerId || null,
          items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
          discount: safeDiscount,
          taxRateBasisPoints: settings.taxRateBasisPoints,
          payments: [
            { method: paymentMethod, amount: total, reference: mobileReference || undefined },
          ],
        },
      });
      setReceipt({ receiptNumber: sale.receiptNumber, total: sale.total });
      setCart([]);
      setDiscount(0);
      setTendered(0);
      setMobileReference("");
      await router.invalidate();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sale could not be completed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="glass-card flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-blue-900 shadow-sm">
            <ScanLine className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800">
              {lang === "en" ? "DeveleERP Terminal" : "Kituo cha Mauzo"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {lang === "en" ? "Live stock and secure checkout" : "Stoo halisi na malipo salama"}
            </p>
          </div>
        </div>
        <Link
          to="/sales/receipts"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Receipt className="h-4 w-4 text-[#1f9c88]" />
          {lang === "en" ? "View receipts" : "Angalia risiti"}
        </Link>
      </div>
      {isTestUser && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
          Demo mode: checkout is disabled so no temporary receipt can be mistaken for a real sale.
        </p>
      )}
      {receipt && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          <div>
            <p className="font-bold">Sale completed: {receipt.receiptNumber}</p>
            <p className="text-sm">{money(receipt.total)}</p>
          </div>
          <Link to="/sales/receipts" className="rounded-lg bg-white px-3 py-2 text-sm font-bold">
            View receipts
          </Link>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <section className="space-y-4 lg:col-span-8">
          <div className="glass-card p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={
                  lang === "en" ? "Search catalog by name or SKU..." : "Tafuta jina au SKU..."
                }
                className="input-field pl-9"
              />
            </div>
          </div>
          <div className="grid max-h-[66vh] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
            {visibleProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                disabled={product.stock <= 0}
                onClick={() => add(product)}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left transition hover:border-[#1f9c88] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="relative flex h-20 items-end overflow-hidden border-b border-slate-100 bg-slate-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <Package className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                  )}
                  <span className="relative m-2 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                    {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                  </span>
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-bold text-slate-800 transition-colors group-hover:text-[#177d6d]">
                    {product.name}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {product.sku}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm font-extrabold text-slate-900">{money(product.price)}</p>
                    <span className="rounded-lg bg-slate-50 p-1 text-[#1f9c88] transition group-hover:bg-[#1f9c88] group-hover:text-white">
                      <Plus className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
            {!visibleProducts.length && (
              <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-muted-foreground">
                {lang === "en"
                  ? "No products match your search."
                  : "Hakuna bidhaa inayolingana na utafutaji."}
              </div>
            )}
          </div>
        </section>
        <section className="glass-card flex min-h-[70vh] flex-col p-4 lg:col-span-4 lg:h-[76vh]">
          <div className="mb-3 flex items-center gap-2 border-b pb-3">
            <ShoppingCart className="h-4 w-4 text-[#1f9c88]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Current sale
            </h2>
            <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-900">
              {cart.length} items
            </span>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto">
            {cart.map((item) => (
              <div
                key={item.id}
                className="space-y-2.5 rounded-xl border border-slate-100 bg-slate-50/60 p-3"
              >
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{money(item.price)} each</p>
                  </div>
                  <button
                    onClick={() =>
                      setCart((current) => current.filter((row) => row.id !== item.id))
                    }
                    className="rounded-full p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => quantity(item.id, -1)}
                    className="rounded-md border border-slate-200 bg-white p-1 text-slate-600 transition hover:bg-slate-100"
                    aria-label={`Decrease ${item.name}`}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button
                    onClick={() => quantity(item.id, 1)}
                    className="rounded-md border border-slate-200 bg-white p-1 text-slate-600 transition hover:bg-slate-100"
                    aria-label={`Increase ${item.name}`}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <span className="ml-auto font-bold">{money(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
            {!cart.length && (
              <p className="py-16 text-center text-sm text-muted-foreground">
                Select products to begin.
              </p>
            )}
          </div>
          <div className="mt-4 space-y-3 border-t pt-4">
            <select
              value={customerId}
              onChange={(event) => setCustomerId(Number(event.target.value) || "")}
              className="input-field"
            >
              <option value="">Walk-in customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-3 gap-2">
              {(["cash", "mobile", "credit"] as PaymentMethod[]).map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`rounded-lg border px-2 py-2 text-xs font-bold capitalize ${paymentMethod === method ? "border-[#1f9c88] bg-emerald-50 text-emerald-800" : ""}`}
                >
                  {method}
                </button>
              ))}
            </div>
            <label className="flex items-center justify-between gap-3 text-sm">
              Discount (TZS)
              <input
                min={0}
                type="number"
                value={discount}
                onChange={(event) => setDiscount(Math.max(0, Number(event.target.value)))}
                className="input-field w-36"
              />
            </label>
            {paymentMethod === "cash" && (
              <label className="flex items-center justify-between gap-3 text-sm">
                Cash tendered
                <input
                  min={0}
                  type="number"
                  value={tendered}
                  onChange={(event) => setTendered(Math.max(0, Number(event.target.value)))}
                  className="input-field w-36"
                />
              </label>
            )}
            {paymentMethod === "mobile" && (
              <label className="block text-sm">
                Confirmed reference
                <input
                  value={mobileReference}
                  onChange={(event) => setMobileReference(event.target.value)}
                  className="input-field mt-1"
                />
              </label>
            )}
            <div className="space-y-1.5 rounded-xl bg-slate-50 p-3 text-sm">
              <Row label="Subtotal" value={money(subtotal)} />
              <Row label="Discount" value={`- ${money(safeDiscount)}`} />
              <Row label={`Tax (${settings.taxRateBasisPoints / 100}%)`} value={money(tax)} />
              <Row label="Total" value={money(total)} strong />
              {paymentMethod === "cash" && <Row label="Change" value={money(change)} />}
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700"
              >
                {error}
              </p>
            )}
            <button
              disabled={!cart.length || saving}
              onClick={checkout}
              className="w-full rounded-xl bg-[#1f9c88] py-3 text-sm font-black text-white disabled:opacity-50"
            >
              {saving ? "Posting sale..." : `Complete sale · ${money(total)}`}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? "border-t pt-2 text-base font-black" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
