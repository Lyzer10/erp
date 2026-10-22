import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Minus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
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
      <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
        <section className="glass-card p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={lang === "en" ? "Search name or SKU" : "Tafuta jina au SKU"}
              className="input-field pl-10"
            />
          </div>
          <div className="grid max-h-[72vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                disabled={product.stock <= 0}
                onClick={() => add(product)}
                className="overflow-hidden rounded-xl border bg-white text-left shadow-sm transition hover:border-[#1f9c88] disabled:opacity-50"
              >
                {product.image && (
                  <img src={product.image} alt="" className="h-24 w-full object-cover" />
                )}
                <div className="p-3">
                  <p className="truncate text-sm font-bold">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.sku} · {product.stock} available
                  </p>
                  <p className="mt-2 font-black text-[#177d6d]">{money(product.price)}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
        <section className="glass-card flex min-h-[70vh] flex-col p-4">
          <div className="mb-3 flex items-center gap-2 border-b pb-3">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="font-bold">Current sale</h2>
            <span className="ml-auto text-sm text-muted-foreground">{cart.length} lines</span>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="rounded-xl border p-3">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{money(item.price)} each</p>
                  </div>
                  <button
                    onClick={() =>
                      setCart((current) => current.filter((row) => row.id !== item.id))
                    }
                    className="text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => quantity(item.id, -1)} className="rounded border p-1">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button onClick={() => quantity(item.id, 1)} className="rounded border p-1">
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
            <div className="space-y-1 rounded-xl bg-slate-50 p-3 text-sm">
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
