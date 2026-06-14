import { createFileRoute, useRouter } from "@tanstack/react-router";
import { 
  ScanLine, ShoppingCart, CreditCard, Sparkles, Plus, Minus, Trash2, 
  Calculator, LogOut, Clock, User, DollarSign, X, FileText, CheckCircle, Search, RefreshCw, Tv
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useTranslate } from "@/lib/i18n";
import { products, customers, currency } from "@/lib/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/pos")({
  head: () => ({ meta: [{ title: "Point of Sale — DeveleERP" }] }),
  component: PosPage,
});

type CartItem = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  serialNo?: string;
  image?: string;
};

type HeldCart = {
  id: string;
  customerName: string;
  items: CartItem[];
  time: string;
};

type ShiftLog = {
  active: boolean;
  cashier: string;
  startTime: string;
  openingFloat: number;
  ordersCount: number;
  cashSales: number;
  mobileSales: number;
  creditSales: number;
};

export function PosPage() {
  const router = useRouter();
  const { t, lang } = useTranslate();

  // Local helper for TZS currency mapping
  const tzs = (amount: number) => {
    return "TZS " + new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount);
  };

  // State Definitions
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [posTab, setPosTab] = useState<"products" | "services">("products");
  const [activeMobileView, setActiveMobileView] = useState<"catalog" | "cart">("catalog");

  // Discount & Tax Config
  const [discountVal, setDiscountVal] = useState(0);
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");

  // Modals & Panels State
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [heldOpen, setHeldOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  // Shift Register State
  const [shift, setShift] = useState<ShiftLog>({
    active: true,
    cashier: "Aisha Otieno",
    startTime: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
    openingFloat: 50000,
    ordersCount: 4,
    cashSales: 184000,
    mobileSales: 112000,
    creditSales: 48000,
  });

  const [newFloatInput, setNewFloatInput] = useState("50000");

  // Calculator State
  const [calcInput, setCalcInput] = useState("");

  // Held Carts List State
  const [heldCarts, setHeldCarts] = useState<HeldCart[]>([
    {
      id: "HLD-102",
      customerName: "Acme Trading Ltd",
      items: [
        { id: "PRD-3001", name: "Organic Sugar 2kg", sku: "SKU-4001", category: "Groceries", price: 6200, quantity: 2, image: "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=500&auto=format&fit=crop&q=60" },
        { id: "PRD-3002", name: "Hand Sanitizer 500ml", sku: "SKU-4002", category: "Household", price: 8400, quantity: 1, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60" },
      ],
      time: "10:15 AM",
    },
  ]);

  // Checkout Payment Inputs
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "mobile" | "stk" | "credit" | "split">("cash");
  const [amountTendered, setAmountTendered] = useState<number>(0);
  const [stkPhone, setStkPhone] = useState("+254 700 123 456");
  const [stkStatus, setStkStatus] = useState<"idle" | "sending" | "success" | "failed">("idle");
  const [splitCash, setSplitCash] = useState<number>(0);
  const [splitMobile, setSplitMobile] = useState<number>(0);

  // Receipt details storage
  const [latestReceipt, setLatestReceipt] = useState<{
    id: string;
    customer: string;
    items: CartItem[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    payment: string;
    tendered: number;
    change: number;
  } | null>(null);

  // Categories helper
  const categories = ["All", "Beverages", "Groceries", "Household", "Electronics", "Furniture", "Stationery"];

  // Filter products based on search, tab, and category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search term match
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category tab match
      const matchCategory = selectedCategory === "All" || p.category === selectedCategory;

      // Type Tab Match (Mock: Furniture & Electronics are Services for mock demo variety, others are products)
      const isService = p.category === "Furniture" || p.category === "Electronics";
      const matchTab = posTab === "products" ? !isService : isService;

      return matchSearch && matchCategory && matchTab;
    });
  }, [searchQuery, selectedCategory, posTab]);

  // Calculate cart math
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (discountType === "percent") {
      return (cartSubtotal * discountVal) / 100;
    }
    return Math.min(discountVal, cartSubtotal);
  }, [cartSubtotal, discountVal, discountType]);

  const cartTax = useMemo(() => {
    return Math.round((cartSubtotal - discountAmount) * 0.18);
  }, [cartSubtotal, discountAmount]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount + cartTax);
  }, [cartSubtotal, discountAmount, cartTax]);

  const changeDue = useMemo(() => {
    const tendered = paymentMethod === "split" ? (splitCash + splitMobile) : amountTendered;
    return Math.max(0, tendered - cartTotal);
  }, [amountTendered, cartTotal, paymentMethod, splitCash, splitMobile]);

  // Broadcast active cart to Customer Display
  useEffect(() => {
    try {
      localStorage.setItem("pos_active_cart", JSON.stringify({
        items: cart,
        subtotal: cartSubtotal,
        discount: discountAmount,
        tax: cartTax,
        total: cartTotal,
        customer: customers.find((c) => c.id === selectedCustomerId)?.name || "Walk-in Customer"
      }));
      window.dispatchEvent(new Event("pos_cart_updated"));
    } catch (e) {
      console.error(e);
    }
  }, [cart, cartSubtotal, discountAmount, cartTax, cartTotal, selectedCustomerId]);

  // Cart Handlers
  const handleAddToCart = (product: typeof products[0]) => {
    const tzsPrice = product.price; // prices are already in TZS
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.id === product.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          sku: product.sku,
          category: product.category,
          price: tzsPrice,
          quantity: 1,
          image: product.image,
        },
      ];
    });
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateSerial = (id: string, serial: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, serialNo: serial } : item))
    );
  };

  // Hold Sale Handler
  const handleHoldSale = () => {
    if (cart.length === 0) return;
    const customer = customers.find((c) => c.id === selectedCustomerId)!;
    const newHold: HeldCart = {
      id: `HLD-${Math.floor(Math.random() * 900 + 100)}`,
      customerName: customer.name,
      items: [...cart],
      time: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
    };
    setHeldCarts((prev) => [newHold, ...prev]);
    setCart([]);
    setDiscountVal(0);
  };

  // Resume Sale
  const handleResumeCart = (held: HeldCart) => {
    setCart(held.items);
    setHeldCarts((prev) => prev.filter((h) => h.id !== held.id));
    setHeldOpen(false);
  };

  // Start checkout click
  const handleOpenCheckout = () => {
    if (cart.length === 0) return;
    setAmountTendered(cartTotal);
    setSplitCash(Math.round(cartTotal / 2));
    setSplitMobile(Math.round(cartTotal / 2));
    setCheckoutOpen(true);
  };

  // Trigger STK Push mock
  const handleStkPush = () => {
    setStkStatus("sending");
    setTimeout(() => {
      setStkStatus("success");
    }, 2000);
  };

  // Finish checkout payment
  const handleCompletePayment = () => {
    const customer = customers.find((c) => c.id === selectedCustomerId)!;
    const receiptId = `REC-${Math.floor(Math.random() * 90000 + 10000)}`;

    const details = {
      id: receiptId,
      customer: customer.name,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      tax: cartTax,
      total: cartTotal,
      payment: paymentMethod.toUpperCase(),
      tendered: paymentMethod === "split" ? (splitCash + splitMobile) : amountTendered,
      change: changeDue,
    };

    // Add to shift register stats
    setShift((prev) => {
      let cashAdd = 0;
      let mobAdd = 0;
      let credAdd = 0;

      if (paymentMethod === "cash") cashAdd = cartTotal;
      else if (paymentMethod === "mobile" || paymentMethod === "stk") mobAdd = cartTotal;
      else if (paymentMethod === "credit") credAdd = cartTotal;
      else if (paymentMethod === "split") {
        cashAdd = splitCash;
        mobAdd = splitMobile;
      }

      return {
        ...prev,
        ordersCount: prev.ordersCount + 1,
        cashSales: prev.cashSales + cashAdd,
        mobileSales: prev.mobileSales + mobAdd,
        creditSales: prev.creditSales + credAdd,
      };
    });

    setLatestReceipt(details);
    setCheckoutOpen(false);
    setReceiptOpen(true);
    setCart([]);
    setDiscountVal(0);
    setStkStatus("idle");
    setActiveMobileView("catalog");
  };

  // Calculator helper
  const handleCalcClick = (val: string) => {
    if (val === "C") {
      setCalcInput("");
    } else if (val === "=") {
      try {
        // Safe evaluation helper
        const clean = calcInput.replace(/[^0-9+\-*/.]/g, "");
        // eslint-disable-next-line no-eval
        const result = eval(clean);
        setCalcInput(String(result));
      } catch {
        setCalcInput("Error");
      }
    } else {
      setCalcInput((prev) => prev + val);
    }
  };

  // Preset cashier payments
  const handleAddPreset = (val: number) => {
    setAmountTendered((prev) => prev + val);
  };

  return (
    <div className="space-y-4">
      {/* Top POS Action Toolbar */}
      <div className="glass-card flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-blue-900 shadow-sm">
            <ScanLine className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800">
              {lang === "en" ? "DeveleERP Terminal" : "Kituo cha Mauzo (DeveleERP)"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {lang === "en" ? "Register Open" : "Sajili Imefunguliwa"} &bull; {shift.cashier}
            </p>
          </div>
        </div>

        {/* Buttons: Calculator, Shift, Held Sales */}
        <div className="flex items-center gap-2">
          {/* Draggable Calculator Button */}
          <button
            onClick={() => setCalcOpen(!calcOpen)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold shadow-sm transition-all cursor-pointer",
              calcOpen ? "bg-blue-100 text-blue-900 border-blue-200" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
            )}
          >
            <Calculator className="h-4 w-4 text-blue-600" />
            <span className="hidden sm:inline">{lang === "en" ? "Calculator" : "Kikokotoo"}</span>
          </button>

          {/* Held Sales Button */}
          <button
            onClick={() => setHeldOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer"
          >
            <Clock className="h-4 w-4 text-amber-600" />
            <span>{lang === "en" ? "Held Sales" : "Viporo"}</span>
            {heldCarts.length > 0 && (
              <span className="ml-1 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                {heldCarts.length}
              </span>
            )}
          </button>

          {/* Shift Management Button */}
          <button
            onClick={() => setShiftModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer"
          >
            <DollarSign className="h-4 w-4 text-emerald-600" />
            <span>{lang === "en" ? "Shift Register" : "Mwenendo wa Zamu"}</span>
          </button>

          {/* Customer Display Button */}
          <button
            onClick={() => {
              window.open("/pos-display", "pos_customer_display", "width=1024,height=768");
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer"
          >
            <Tv className="h-4 w-4 text-slate-600" />
            <span>{lang === "en" ? "Customer Display" : "Skrini ya Mteja"}</span>
          </button>
        </div>
      </div>

      {/* Main Terminal Screen Split */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left Catalog Grid Column */}
        <div className={cn("space-y-4 lg:col-span-8", activeMobileView === "catalog" ? "block" : "hidden lg:block")}>
          {/* Search, Categories, and Type Selector */}
          <div className="glass-card p-4 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Product Type Tab Toggle */}
              <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                <button
                  onClick={() => setPosTab("products")}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
                    posTab === "products" ? "bg-white text-blue-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  {lang === "en" ? "Products" : "Bidhaa"}
                </button>
                <button
                  onClick={() => setPosTab("services")}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
                    posTab === "services" ? "bg-white text-blue-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  {lang === "en" ? "Services" : "Huduma"}
                </button>
              </div>

              {/* Search Field */}
              <div className="relative max-w-xs flex-1">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={lang === "en" ? "Search catalog..." : "Tafuta bidhaa/huduma..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Scrollable Categories List */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-xs font-medium border transition shrink-0 cursor-pointer",
                    selectedCategory === cat
                      ? "bg-blue-100 text-blue-900 border-blue-200 font-semibold"
                      : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                  )}
                >
                  {cat === "All" ? (lang === "en" ? "All Categories" : "Makundi Yote") : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Catalog Cards Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 max-h-[58vh] overflow-y-auto pr-1">
            {filteredProducts.map((p) => {
              const itemPrice = p.price; // already in TZS
              // Pick custom colored gradient to act as placeholder image if no image available
              const colors = [
                "from-teal-400 to-emerald-500",
                "from-orange-400 to-rose-500",
                "from-sky-400 to-indigo-500",
                "from-violet-400 to-purple-500",
                "from-amber-400 to-yellow-500",
              ];
              const gradIdx = p.id.charCodeAt(p.id.length - 1) % colors.length;

              return (
                <div 
                  key={p.id}
                  onClick={() => handleAddToCart(p)}
                  className="glass-card hover:border-[#1f9c88] hover:shadow-md transition-all duration-200 group cursor-pointer overflow-hidden relative flex flex-col justify-between"
                >
                  {/* Real Product Image Header */}
                  {p.image ? (
                    <div className="h-28 w-full relative overflow-hidden bg-slate-100 flex items-end justify-between text-white border-b border-slate-100">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105 duration-200"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-90 relative z-10 px-3 py-2">{p.category}</span>
                      <span className="text-[10px] font-semibold bg-[#1f9c88]/90 rounded px-1.5 py-0.5 backdrop-blur-sm relative z-10 mx-3 my-2">
                        {p.stock > 0 ? (lang === "en" ? `${p.stock} left` : `${p.stock} zipo`) : (lang === "en" ? "Out" : "Hamna")}
                      </span>
                    </div>
                  ) : (
                    <div className={cn("h-16 w-full bg-gradient-to-tr flex items-end justify-between px-3 py-2 text-white", colors[gradIdx])}>
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">{p.category}</span>
                      <span className="text-[10px] font-semibold bg-white/20 rounded px-1.5 py-0.5 backdrop-blur-sm">
                        {p.stock > 0 ? (lang === "en" ? `${p.stock} left` : `${p.stock} zipo`) : (lang === "en" ? "Out" : "Hamna")}
                      </span>
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="p-3 space-y-1">
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#1f9c88] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{p.sku}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-extrabold text-slate-900">{tzs(itemPrice)}</span>
                      <div className="rounded-lg bg-slate-50 group-hover:bg-[#1f9c88] group-hover:text-white p-1 text-[#1f9c88] transition-colors">
                        <Plus className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <p className="text-sm text-muted-foreground font-medium">
                  {lang === "en" ? "No products match your filters." : "Hakuna bidhaa inayolingana na vichujio vyako."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Active Cart Column */}
        <div className={cn("space-y-4 lg:col-span-4", activeMobileView === "cart" ? "block" : "hidden lg:block")}>
          <div className="glass-card flex flex-col justify-between h-[76vh] lg:h-[73vh] p-4">
            {/* Customer select and Cart Top info */}
            <div className="space-y-3">
              {/* Mobile back to catalog button */}
              <button
                type="button"
                onClick={() => setActiveMobileView("catalog")}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 lg:hidden mb-2"
              >
                &larr; {lang === "en" ? "Back to Products" : "Rudi kwenye Bidhaa"}
              </button>

              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1 text-slate-600">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">{lang === "en" ? "Checkout Cart" : "Mkokoteni wa Malipo"}</span>
                </div>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-900">
                  {cart.length} {lang === "en" ? "items" : "bidhaa"}
                </span>
              </div>

              {/* Customer Selector */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {lang === "en" ? "Select Customer" : "Chagua Mteja"}
                </label>
                <select 
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.contact})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cart Items List - Vertical Scrollable area */}
            <div className="flex-1 my-3 overflow-y-auto space-y-2.5 pr-0.5">
              {cart.map((item) => {
                const productObj = products.find((p) => p.id === item.id);
                const itemImage = productObj?.image;
                const unitLabel = item.category === "Groceries" || item.category === "Beverages" ? "kg" : "pcs";

                return (
                  <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 space-y-2.5 shadow-sm">
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="h-12 w-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative flex items-center justify-center">
                        {itemImage ? (
                          <img src={itemImage} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <ShoppingCart className="h-5 w-5 text-slate-400" />
                        )}
                      </div>

                      {/* Name & Remove */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">{item.name}</h4>
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="rounded-full p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
                            title={lang === "en" ? "Remove item" : "Ondoa bidhaa"}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{item.sku}</p>
                      </div>
                    </div>

                    {/* Serial/IMEI input */}
                    <div className="space-y-1">
                      <input
                        type="text"
                        placeholder={lang === "en" ? "IMEI / Serial # (optional)" : "IMEI / Namba ya Usajili (kwa hiari)"}
                        value={item.serialNo || ""}
                        onChange={(e) => handleUpdateSerial(item.id, e.target.value)}
                        className="w-full h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] outline-none focus:border-[#1f9c88] text-slate-700 placeholder:text-slate-400"
                      />
                    </div>

                    {/* Quantity controls + Price */}
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
                          <button
                            onClick={() => handleUpdateQty(item.id, -1)}
                            className="rounded-md bg-white p-1 text-slate-600 hover:bg-slate-200 transition"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-700">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQty(item.id, 1)}
                            className="rounded-md bg-white p-1 text-slate-600 hover:bg-slate-200 transition"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500">{unitLabel}</span>
                      </div>

                      {/* Total price for the row + Unit price */}
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-slate-900 block">{tzs(item.price * item.quantity)}</span>
                        <span className="text-[9px] font-medium text-slate-400">@ {tzs(item.price)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {cart.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                  <ShoppingCart className="h-8 w-8 stroke-1 text-slate-300" />
                  <p className="text-xs font-medium">
                    {lang === "en" ? "Cart is empty. Click catalog products to add." : "Mkokoteni hauna bidhaa. Chagua bidhaa kuongeza."}
                  </p>
                </div>
              )}
            </div>

            {/* Calculations & Checkout action buttons */}
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>{lang === "en" ? "Subtotal" : "Nusu Jumla"}</span>
                  <span className="font-semibold">{tzs(cartSubtotal)}</span>
                </div>
                
                {/* Discount parameter */}
                <div className="flex items-center justify-between text-slate-500">
                  <div className="flex items-center gap-1">
                    <span>{lang === "en" ? "Discount" : "Punguzo"}</span>
                    <input 
                      type="number"
                      value={discountVal}
                      onChange={(e) => setDiscountVal(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-10 rounded border border-slate-200 px-1 text-center text-[10px] outline-none text-slate-700"
                    />
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as "percent" | "fixed")}
                      className="rounded border border-slate-200 text-[10px] text-slate-600 outline-none"
                    >
                      <option value="percent">%</option>
                      <option value="fixed">TZS</option>
                    </select>
                  </div>
                  <span className="font-semibold text-rose-600">-{tzs(discountAmount)}</span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>{lang === "en" ? "VAT (18%)" : "Kodi (VAT 18%)"}</span>
                  <span className="font-semibold">{tzs(cartTax)}</span>
                </div>

                <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 text-sm font-bold text-blue-950">
                  <span>{lang === "en" ? "Grand Total" : "Jumla Kuu"}</span>
                  <span>{tzs(cartTotal)}</span>
                </div>
              </div>

              {/* Operations triggers: Hold, Clear, Pay */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setCart([])}
                  disabled={cart.length === 0}
                  className="rounded-xl border border-rose-200 bg-rose-50/50 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100/50 disabled:opacity-40 cursor-pointer"
                >
                  {lang === "en" ? "Clear" : "Futa"}
                </button>
                <button
                  onClick={handleHoldSale}
                  disabled={cart.length === 0}
                  className="rounded-xl border border-amber-200 bg-amber-50/50 py-2 text-xs font-bold text-amber-600 hover:bg-amber-100/50 disabled:opacity-40 cursor-pointer"
                >
                  {lang === "en" ? "Hold" : "Kiporo"}
                </button>
                <button
                  onClick={handleOpenCheckout}
                  disabled={cart.length === 0}
                  className="rounded-xl bg-blue-500 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-600 disabled:opacity-40 cursor-pointer"
                >
                  {lang === "en" ? "Pay Now" : "Lipa Sasa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating mobile cart checkout indicator */}
      {cart.length > 0 && activeMobileView === "catalog" && (
        <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
          <button
            type="button"
            onClick={() => setActiveMobileView("cart")}
            className="flex w-full items-center justify-between rounded-2xl bg-blue-600 px-5 py-4 text-white shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-sm font-bold">
                {lang === "en" ? `View Cart (${cart.length} items)` : `Angalia Mkokoteni (${cart.length} bidhaa)`}
              </span>
            </div>
            <span className="text-sm font-black">{tzs(cartTotal)}</span>
          </button>
        </div>
      )}

      {/* FLOATING DRAGGABLE CALCULATOR WIDGET */}
      {calcOpen && (
        <div className={cn(
          "fixed z-50 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl",
          cart.length > 0 && activeMobileView === "catalog" ? "bottom-24 right-4" : "bottom-6 right-6"
        )}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <span className="text-xs font-bold text-slate-700">{lang === "en" ? "Quick Calculator" : "Kikokotoo cha Haraka"}</span>
            <button onClick={() => setCalcOpen(false)} className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          {/* Display screen */}
          <div className="mb-3 rounded-xl bg-slate-900 p-3 text-right text-lg font-bold text-emerald-400 truncate h-12">
            {calcInput || "0"}
          </div>
          {/* Keypad grid */}
          <div className="grid grid-cols-4 gap-2">
            {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"].map((key) => (
              <button
                key={key}
                onClick={() => handleCalcClick(key)}
                className={cn(
                  "rounded-lg py-2 text-xs font-bold transition cursor-pointer",
                  key === "=" 
                    ? "col-span-1 bg-emerald-500 text-white hover:bg-emerald-600" 
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                )}
              >
                {key}
              </button>
            ))}
            <button
              onClick={() => handleCalcClick("C")}
              className="col-span-4 rounded-lg bg-rose-50 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 transition cursor-pointer"
            >
              Clear (C)
            </button>
          </div>
        </div>
      )}

      {/* SHIFT REGISTER MANAGEMENT MODAL */}
      {shiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {lang === "en" ? "Active Shift Register" : "Zamu Active ya Mauzo"}
              </h2>
              <button onClick={() => setShiftModalOpen(false)} className="rounded p-0.5 text-slate-400 hover:bg-slate-100">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {shift.active ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 p-4 space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>{lang === "en" ? "Cashier" : "Mhudumu"}</span>
                    <span className="font-bold text-slate-800">{shift.cashier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === "en" ? "Opened At" : "Muda wa Kuanza"}</span>
                    <span className="font-bold text-slate-800">{shift.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === "en" ? "Opening Float" : "Kiasi cha Kuanzia"}</span>
                    <span className="font-bold text-slate-800">{tzs(shift.openingFloat)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2">
                    <span>{lang === "en" ? "Total Transactions" : "Jumla ya Hati"}</span>
                    <span className="font-bold text-slate-800">{shift.ordersCount}</span>
                  </div>
                </div>

                {/* Sales stats grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-xl border border-slate-100 p-2.5 bg-emerald-50/20">
                    <p className="text-[9px] font-semibold text-slate-400 uppercase">{lang === "en" ? "Cash" : "Taslimu"}</p>
                    <p className="mt-1 font-bold text-slate-700">{tzs(shift.cashSales)}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 p-2.5 bg-blue-50/20">
                    <p className="text-[9px] font-semibold text-slate-400 uppercase">{lang === "en" ? "Mobile" : "Mtandao"}</p>
                    <p className="mt-1 font-bold text-slate-700">{tzs(shift.mobileSales)}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 p-2.5 bg-rose-50/20">
                    <p className="text-[9px] font-semibold text-slate-400 uppercase">{lang === "en" ? "Credit" : "Mkopo"}</p>
                    <p className="mt-1 font-bold text-slate-700">{tzs(shift.creditSales)}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShift({ ...shift, active: false });
                  }}
                  className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-rose-700 transition cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  {lang === "en" ? "Close Register (End Shift)" : "Funga Mauzo (Mwisho wa Zamu)"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  {lang === "en" ? "Enter opening float cash balance to open a new register shift." : "Weka kiasi cha kuanzia kufungua zamu mpya ya mauzo."}
                </p>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">{lang === "en" ? "Opening Float (TZS)" : "Kiasi cha Kuanzia (TZS)"}</label>
                  <input
                    type="number"
                    value={newFloatInput}
                    onChange={(e) => setNewFloatInput(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 text-slate-800"
                  />
                </div>
                <button
                  onClick={() => {
                    setShift({
                      active: true,
                      cashier: "Aisha Otieno",
                      startTime: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
                      openingFloat: parseInt(newFloatInput) || 0,
                      ordersCount: 0,
                      cashSales: 0,
                      mobileSales: 0,
                      creditSales: 0,
                    });
                  }}
                  className="w-full rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition cursor-pointer"
                >
                  {lang === "en" ? "Start Shift" : "Anza Zamu Mpya"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HELD SALES (VIPORO) MODAL */}
      {heldOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {lang === "en" ? "Held Sales (Viporo)" : "Orodha ya Mauzo ya Viporo"}
              </h2>
              <button onClick={() => setHeldOpen(false)} className="rounded p-0.5 text-slate-400 hover:bg-slate-100">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
              {heldCarts.map((h) => {
                const total = h.items.reduce((s, it) => s + it.price * it.quantity, 0);
                return (
                  <div key={h.id} className="flex items-center justify-between border border-slate-150 rounded-xl p-3 bg-slate-50/30">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{h.id}</span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">{h.time}</span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-slate-700">{h.customerName}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{h.items.length} products &bull; {tzs(total)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setHeldCarts((prev) => prev.filter((item) => item.id !== h.id))}
                        className="rounded-lg p-2 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleResumeCart(h)}
                        className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                      >
                        {lang === "en" ? "Resume" : "Rejesha"}
                      </button>
                    </div>
                  </div>
                );
              })}

              {heldCarts.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-sm">
                  {lang === "en" ? "No held sales at this time." : "Hakuna viporo vilivyohifadhiwa kwa sasa."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT FLOW DRAWER / MODAL */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-6 relative">
            <button 
              onClick={() => setCheckoutOpen(false)} 
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left Payment Options selection */}
            <div className="md:col-span-5 space-y-4 border-r border-slate-100 pr-2">
              <h2 className="text-base font-bold text-slate-900">
                {lang === "en" ? "Choose Payment Method" : "Chagua Njia ya Malipo"}
              </h2>

              <div className="flex flex-col gap-2">
                {[
                  { key: "cash", label: lang === "en" ? "Cash" : "Taslimu", icon: DollarSign },
                  { key: "mobile", label: lang === "en" ? "Mobile Money" : "Pesa ya Mtandao", icon: CreditCard },
                  { key: "stk", label: lang === "en" ? "M-Pesa STK Push" : "STK Push (M-Pesa)", icon: Sparkles },
                  { key: "credit", label: lang === "en" ? "On Account / Credit" : "Akaunti / Deni", icon: FileText },
                  { key: "split", label: lang === "en" ? "Split Payment" : "Malipo ya Mgawanyo", icon: RefreshCw },
                ].map((meth) => {
                  const Icon = meth.icon;
                  return (
                    <button
                      key={meth.key}
                      onClick={() => setPaymentMethod(meth.key as any)}
                      className={cn(
                        "flex items-center gap-3 w-full rounded-xl px-4 py-3 text-xs font-bold text-left border transition-all cursor-pointer",
                        paymentMethod === meth.key 
                          ? "bg-blue-100 text-blue-900 border-blue-300 shadow-sm" 
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      <Icon className="h-4.5 w-4.5 text-blue-600" />
                      <span>{meth.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Calculator / Checkout detail inputs */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{lang === "en" ? "Payment Details" : "Maelezo ya Malipo"}</h3>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === "en" ? "Amount Due" : "Kiasi Kinachotakiwa"}</span>
                    <span className="font-extrabold text-blue-950">{tzs(cartTotal)}</span>
                  </div>
                </div>

                {/* Sub-parameters based on method */}
                <div className="mt-4">
                  {paymentMethod === "cash" && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">{lang === "en" ? "Amount Tendered (TZS)" : "Fedha Zilizopokelewa (TZS)"}</label>
                        <input
                          type="number"
                          value={amountTendered || ""}
                          onChange={(e) => setAmountTendered(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 text-slate-800 font-bold"
                        />
                      </div>
                      
                      {/* Presets denominations */}
                      <div className="grid grid-cols-3 gap-2">
                        {[1000, 5000, 10000, 20000, 50000].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => handleAddPreset(preset)}
                            className="rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                          >
                            +{preset}
                          </button>
                        ))}
                        <button
                          onClick={() => setAmountTendered(cartTotal)}
                          className="rounded-lg bg-blue-550 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                        >
                          Exact (Kamili)
                        </button>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "stk" && (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">{lang === "en" ? "M-Pesa Registered Number" : "Namba ya M-Pesa iliyosajiliwa"}</label>
                        <input
                          type="text"
                          value={stkPhone}
                          onChange={(e) => setStkPhone(e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 text-slate-800 font-bold"
                        />
                      </div>
                      <button
                        onClick={handleStkPush}
                        disabled={stkStatus === "sending"}
                        className="w-full rounded-xl bg-emerald-500 py-2 text-xs font-bold text-white shadow hover:bg-emerald-600 disabled:opacity-50 cursor-pointer"
                      >
                        {stkStatus === "idle" && (lang === "en" ? "Send STK Push Request" : "Tuma Ombi la STK Push")}
                        {stkStatus === "sending" && (lang === "en" ? "Waiting for User input..." : "Inasubiri mtumiaji...")}
                        {stkStatus === "success" && (lang === "en" ? "Payment Confirmed Success!" : "Malipo Yamethibitishwa!")}
                      </button>
                    </div>
                  )}

                  {paymentMethod === "split" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">{lang === "en" ? "Cash Amount" : "Kiasi cha Taslimu"}</label>
                        <input
                          type="number"
                          value={splitCash}
                          onChange={(e) => setSplitCash(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">{lang === "en" ? "Mobile Wallet Amount" : "Kiasi cha Mtandao"}</label>
                        <input
                          type="number"
                          value={splitMobile}
                          onChange={(e) => setSplitMobile(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 text-slate-800"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "credit" && (
                    <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 font-medium">
                      {lang === "en" 
                        ? "This transaction will be recorded on the customer's ledger as an outstanding invoice." 
                        : "Malipo haya yataandikwa kwenye leja ya mteja kama deni linalosubiri kulipwa."}
                    </p>
                  )}

                  {paymentMethod === "mobile" && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">{lang === "en" ? "Reference Code" : "Kumbukumbu ya Malipo"}</label>
                      <input
                        type="text"
                        placeholder="e.g. PP26GH1289"
                        className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-blue-500 text-slate-800"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Confirm / Change block */}
              <div className="mt-6 border-t border-slate-100 pt-4 space-y-4">
                {(paymentMethod === "cash" || paymentMethod === "split") && (
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-500">{lang === "en" ? "Change Due" : "Chenji ya kurudisha"}</span>
                    <span className="text-emerald-600 text-lg">{tzs(changeDue)}</span>
                  </div>
                )}

                <button
                  onClick={handleCompletePayment}
                  disabled={stkStatus === "sending"}
                  className="w-full rounded-2xl bg-blue-500 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-600 transition cursor-pointer"
                >
                  {lang === "en" ? "Confirm Payment" : "Thibitisha Kukamilisha Malipo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* THERMAL PRINT RECEIPT PREVIEW MODAL */}
      {receiptOpen && latestReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700">{lang === "en" ? "Payment Successful" : "Malipo Yamefanikiwa"}</span>
              <button 
                onClick={() => setReceiptOpen(false)} 
                className="rounded p-0.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Thermal styled container */}
            <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl font-mono text-[10px] space-y-3 max-h-[50vh] overflow-y-auto">
              <div className="text-center space-y-0.5">
                <p className="font-bold text-xs uppercase">DeveleERP Demo Shop</p>
                <p>Makao Makuu, Westlands</p>
                <p>Tel: +254 700 123 456</p>
                <p>-------------------------</p>
              </div>

              <div className="space-y-0.5 text-[9px]">
                <p>RECEIPT: {latestReceipt.id}</p>
                <p>DATE: {new Date().toLocaleString()}</p>
                <p>CUSTOMER: {latestReceipt.customer}</p>
                <p>-------------------------</p>
              </div>

              {/* Items Table */}
              <div className="space-y-1.5">
                {latestReceipt.items.map((it) => (
                  <div key={it.id} className="flex justify-between">
                    <span className="truncate max-w-[150px]">{it.name} (x{it.quantity})</span>
                    <span>{tzs(it.price * it.quantity)}</span>
                  </div>
                ))}
                <p>-------------------------</p>
              </div>

              {/* Math summaries */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span>{tzs(latestReceipt.subtotal)}</span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>DISCOUNT</span>
                  <span>-{tzs(latestReceipt.discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (18%)</span>
                  <span>{tzs(latestReceipt.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                  <span>TOTAL PAID</span>
                  <span>{tzs(latestReceipt.total)}</span>
                </div>
              </div>

              <div className="space-y-1 pt-1 border-t border-dashed border-slate-300">
                <div className="flex justify-between">
                  <span>METHOD</span>
                  <span>{latestReceipt.payment}</span>
                </div>
                <div className="flex justify-between">
                  <span>TENDERED</span>
                  <span>{tzs(latestReceipt.tendered)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CHANGE</span>
                  <span>{tzs(latestReceipt.change)}</span>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="font-bold">Asante kwa kufanya biashara nasi!</p>
                <p>Thank you for shopping with us!</p>
              </div>
            </div>

            {/* Print actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setReceiptOpen(false)}
                className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {lang === "en" ? "Close" : "Funga"}
              </button>
              <button
                onClick={() => {
                  alert("Receipt sent to thermal print spooler!");
                  setReceiptOpen(false);
                }}
                className="flex-1 inline-flex justify-center items-center gap-1.5 rounded-lg bg-blue-500 py-2 text-xs font-bold text-white shadow hover:bg-blue-600 cursor-pointer"
              >
                <CheckCircle className="h-4 w-4" />
                {lang === "en" ? "Print Receipt" : "Chapisha Risiti"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
