"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/StoreContext";

interface ShippingOption {
  id: string;
  name: string;
  desc: string;
  price: number;
  eta: string;
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "free-insured",
    name: "Complimentary Insured Courier",
    desc: "Fully insured transit with signature required",
    price: 0,
    eta: "4–6 Business Days",
  },
  {
    id: "express-air",
    name: "Priority Air Vault Express",
    desc: "Air cargo express with tamper-evident seal",
    price: 35,
    eta: "2–3 Business Days",
  },
  {
    id: "white-glove",
    name: "White-Glove VIP Delivery",
    desc: "Personal courier & GIA appraisal pack",
    price: 75,
    eta: "Next Business Day",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartSubtotal, clearCart } = useCart();

  // Mobile Order Summary toggle
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newsletter, setNewsletter] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("United States");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const [shippingMethod, setShippingMethod] = useState<string>("free-insured");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "wire">("card");

  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Promo discount
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    percent?: number;
    amount?: number;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState("");

  // Redirect if cart is empty on mount
  useEffect(() => {
    // Only redirect if hydrated and empty
    const timer = setTimeout(() => {
      if (items.length === 0) {
        // Can let user stay or redirect
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [items]);

  // Pricing calculations
  const selectedShipping =
    SHIPPING_OPTIONS.find((s) => s.id === shippingMethod) || SHIPPING_OPTIONS[0];

  const discountAmount = appliedDiscount
    ? appliedDiscount.percent
      ? (cartSubtotal * appliedDiscount.percent) / 100
      : (appliedDiscount.amount || 0)
    : 0;

  const total = Math.max(0, cartSubtotal - discountAmount + selectedShipping.price);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "LUXURY10" || code === "WELCOME10") {
      setAppliedDiscount({ code, percent: 10 });
      setCouponSuccess("10% luxury discount applied!");
    } else if (code === "GOLD50") {
      setAppliedDiscount({ code, amount: 50 });
      setCouponSuccess("$50 discount applied!");
    } else {
      setCouponError("Invalid promo code. Try 'LUXURY10' or 'GOLD50'");
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email || !firstName || !lastName || !address1 || !city || !zip) {
      setFormError("Please fill out all required contact and shipping fields.");
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        setFormError("Please provide all required payment card details.");
        return;
      }
    }

    setIsProcessing(true);

    try {
      const payload = {
        items: items.map((i) => ({
          id: i.product.id,
          quantity: i.quantity,
          selectedVariants: i.selectedVariants,
        })),
        customer: {
          email,
          phone,
          firstName,
          lastName,
          country,
          address1,
          address2,
          city,
          state,
          zip,
        },
        shippingMethod,
        couponCode: appliedDiscount?.code,
        paymentMethod,
        cardLast4: cardNumber ? cardNumber.replace(/\s+/g, "").slice(-4) : undefined,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to verify and place order. Please try again.");
      }

      const verifiedOrder = data.order;
      const orderId = verifiedOrder.orderNumber;

      // Customer-facing order snapshot for order-success page
      const customerOrderData = {
        orderId,
        createdAt: verifiedOrder.createdAt,
        customer: {
          email,
          phone,
          firstName,
          lastName,
          country,
          address1,
          address2,
          city,
          state,
          zip,
        },
        shipping: selectedShipping,
        payment: {
          method: paymentMethod,
          cardLast4: cardNumber ? cardNumber.replace(/\s+/g, "").slice(-4) : "8821",
        },
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          slug: i.product.slug,
          image: i.product.image,
          price: i.product.price,
          quantity: i.quantity,
          variants: i.selectedVariants,
        })),
        subtotal: verifiedOrder.subtotal,
        discount: verifiedOrder.discount,
        shippingCost: verifiedOrder.shipping,
        total: verifiedOrder.total,
      };

      // Save to customer order history
      try {
        const existing = localStorage.getItem("sir-ihsan-orders");
        const orders = existing ? JSON.parse(existing) : [];
        orders.unshift(customerOrderData);
        localStorage.setItem("sir-ihsan-orders", JSON.stringify(orders));
        localStorage.setItem("sir-ihsan-latest-order", JSON.stringify(customerOrderData));

        // Also push to admin orders if localStorage key is initialized
        const adminOrdersKey = "sir_ihsan_admin_orders";
        const adminExisting = localStorage.getItem(adminOrdersKey);
        const adminOrders = adminExisting ? JSON.parse(adminExisting) : [];
        adminOrders.unshift(verifiedOrder);
        localStorage.setItem(adminOrdersKey, JSON.stringify(adminOrders));
      } catch {
        // Safe fallback if local storage is restricted
      }

      clearCart();
      setIsProcessing(false);
      router.push(`/order-success?orderId=${orderId}`);
    } catch (err: unknown) {
      setIsProcessing(false);
      const msg = err instanceof Error ? err.message : "An unexpected error occurred during checkout.";
      setFormError(msg);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#FCFAF8] min-h-screen text-[#1A1A1A]">
      {/* Top Header Bar */}
      <header className="border-b border-[#eee] bg-white sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0">
              <Image
                src="/images/logo.png"
                alt="M. Nawaz Jewelry Collection Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-cormorant text-xl sm:text-2xl font-bold tracking-[2px] uppercase text-[#1A1A1A] group-hover:text-amber-600 transition-colors leading-tight">
                M. Nawaz
              </span>
              <span className="text-[9px] uppercase tracking-[2px] text-amber-700 font-semibold">
                Jewelry Collection
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-[12px] uppercase tracking-wider text-[#777]">
            <span className="hidden sm:flex items-center gap-1.5 text-green-700 font-medium">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              256-Bit Encrypted
            </span>
            <Link
              href="/cart"
              className="text-[#D97706] hover:underline font-bold flex items-center gap-1"
            >
              ← Back to Bag
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Collapsible Order Summary Bar */}
      <div className="lg:hidden bg-[#FAF7F4] border-b border-[#eee] px-4 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <button
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="flex items-center gap-2 text-[13px] text-[#D97706] font-bold"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span>{mobileSummaryOpen ? "Hide order summary" : "Show order summary"}</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform ${mobileSummaryOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <span className="font-cormorant text-xl font-bold text-[#D97706]">
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Mobile Expanded Summary Items */}
        {mobileSummaryOpen && (
          <div className="mt-4 pt-4 border-t border-[#eee] space-y-3 animate-in slide-in-from-top-2 duration-200">
            {items.map(({ product, quantity, selectedVariants }) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="relative w-14 h-14 bg-white border border-[#eee] shrink-0 overflow-hidden">
                  <Image src={product.image} alt={product.name} fill className="object-cover" sizes="56px" />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] text-white text-[9px] font-bold flex items-center justify-center rounded-bl">
                    {quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#1A1A1A] truncate">{product.name}</p>
                  {selectedVariants && (
                    <p className="text-[11px] text-[#888] capitalize">
                      {Object.values(selectedVariants).join(" / ")}
                    </p>
                  )}
                </div>
                <span className="text-[13px] font-semibold text-[#1A1A1A]">
                  ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Checkout Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12">
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Customer, Shipping & Payment (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Step Progress */}
            <nav className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-[#888] overflow-x-auto pb-2">
              <Link href="/cart" className="hover:text-[#D97706]">Bag</Link>
              <span>›</span>
              <span className="text-[#D97706] font-bold">Checkout</span>
              <span>›</span>
              <span>Confirmation</span>
            </nav>

            {/* Error banner */}
            {formError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded flex items-center gap-2">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {formError}
              </div>
            )}

            {/* Express Checkout Options */}
            <div className="bg-white p-6 border border-[#eee] shadow-sm">
              <p className="text-[11px] uppercase tracking-[2px] font-semibold text-[#888] text-center mb-3">
                Express Luxury Checkout
              </p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => alert("Shop Pay Express Checkout simulated")}
                  className="py-3 bg-[#5A31F4] hover:bg-[#4922e3] text-white font-semibold text-[13px] rounded transition-colors flex items-center justify-center gap-1.5"
                >
                  Shop <span className="italic font-bold">Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert("PayPal Express Gateway simulated")}
                  className="py-3 bg-[#FFC439] hover:bg-[#f0b52d] text-[#111] font-bold text-[13px] rounded transition-colors flex items-center justify-center gap-1"
                >
                  Pay<span className="text-[#0079C1]">Pal</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert("Google Pay / Apple Pay Gateway simulated")}
                  className="py-3 bg-[#1A1A1A] hover:bg-[#333] text-white font-semibold text-[13px] rounded transition-colors flex items-center justify-center gap-1.5"
                >
                   Pay
                </button>
              </div>

              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-[#eee]" />
                <span className="px-4 text-[11px] uppercase tracking-wider text-[#999] font-medium">
                  Or Proceed with Standard Order
                </span>
                <div className="flex-1 h-px bg-[#eee]" />
              </div>
            </div>

            {/* Section 1: Contact Information */}
            <div className="bg-white p-6 md:p-8 border border-[#eee] shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-cormorant text-2xl font-bold text-[#1A1A1A]">
                  1. Contact Information
                </h2>
                <span className="text-[12px] text-[#888]">Already a client? <Link href="/account" className="text-amber-600 font-bold hover:underline">Sign In</Link></span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#555] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@luxury.com"
                    className="w-full px-4 py-3 text-[14px] border border-slate-200 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 transition-all rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#555] mb-1">
                    Mobile Phone (for delivery SMS dispatch) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 text-[14px] border border-slate-200 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 transition-all rounded-sm"
                  />
                </div>

                <label className="flex items-center gap-2.5 text-[13px] text-[#666] cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="w-4 h-4 accent-amber-600 rounded"
                  />
                  <span>Receive bespoke jewellery collection launches & VIP salon invitations</span>
                </label>
              </div>
            </div>

            {/* Section 2: Delivery Address */}
            <div className="bg-white p-6 md:p-8 border border-[#eee] shadow-sm">
              <h2 className="font-cormorant text-2xl font-bold text-[#1A1A1A] mb-5">
                2. Delivery & Vault Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#555] mb-1">
                    Country / Region *
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 text-[14px] border border-slate-200 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 bg-white transition-all rounded-sm"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="France">France</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Germany">Germany</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#555] mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      className="w-full px-4 py-3 text-[14px] border border-slate-200 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 transition-all rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#555] mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full px-4 py-3 text-[14px] border border-slate-200 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 transition-all rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#555] mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    placeholder="742 Evergreen Terrace"
                    className="w-full px-4 py-3 text-[14px] border border-slate-200 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 transition-all rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#555] mb-1">
                    Apartment, Suite, Unit (optional)
                  </label>
                  <input
                    type="text"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    placeholder="Penthouse 4B"
                    className="w-full px-4 py-3 text-[14px] border border-slate-200 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 transition-all rounded-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#555] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                      className="w-full px-4 py-3 text-[14px] border border-slate-200 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 transition-all rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#555] mb-1">
                      State / Province
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="NY"
                      className="w-full px-4 py-3 text-[14px] border border-slate-200 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 transition-all rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#555] mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="10001"
                      className="w-full px-4 py-3 text-[14px] border border-slate-200 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 transition-all rounded-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Shipping Method */}
            <div className="bg-white p-6 md:p-8 border border-[#eee] shadow-sm">
              <h2 className="font-cormorant text-2xl font-bold text-[#1A1A1A] mb-5">
                3. Courier & Transit Method
              </h2>

              <div className="space-y-3">
                {SHIPPING_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between p-4 border cursor-pointer transition-all rounded-sm ${
                      shippingMethod === opt.id
                        ? "border-[#D97706] bg-amber-50/40 shadow-sm shadow-amber-500/10 ring-1 ring-amber-400/30"
                        : "border-[#eee] hover:border-amber-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === opt.id}
                        onChange={() => setShippingMethod(opt.id)}
                        className="mt-1 w-4 h-4 accent-amber-600"
                      />
                      <div>
                        <p className="font-semibold text-[14px] text-[#1A1A1A]">{opt.name}</p>
                        <p className="text-[12px] text-[#777] mt-0.5">{opt.desc}</p>
                        <p className="text-[11px] text-[#D97706] font-bold mt-1">
                          Est. Transit: {opt.eta}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-[14px] text-[#1A1A1A]">
                      {opt.price === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${opt.price.toFixed(2)}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 4: Payment Method */}
            <div className="bg-white p-6 md:p-8 border border-[#eee] shadow-sm">
              <h2 className="font-cormorant text-2xl font-bold text-[#1A1A1A] mb-5">
                4. Payment Method
              </h2>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-2 mb-6 border-b border-[#eee] pb-4">
                {(
                  [
                    { id: "card", label: "Credit / Debit Card" },
                    { id: "paypal", label: "PayPal" },
                    { id: "wire", label: "Bank Wire / COD" },
                  ] as const
                ).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaymentMethod(p.id)}
                    className={`py-2 text-[12px] uppercase tracking-wider font-bold border-b-2 transition-all ${
                      paymentMethod === p.id
                        ? "border-[#D97706] text-amber-700 font-bold"
                        : "border-transparent text-[#999] hover:text-[#555]"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#555]">
                        Card Number *
                      </label>
                      <span className="text-[11px] text-[#888]">Visa, Mastercard, Amex</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                          const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
                          setCardNumber(formatted);
                        }}
                        placeholder="4532 •••• •••• 8921"
                        className="w-full px-4 py-3 text-[14px] border border-slate-200 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 transition-all rounded-sm"
                      />
                      <span className="absolute right-3 top-3.5 text-xs text-[#999]">💳</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#555] mb-1">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 text-[14px] border border-slate-200 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 transition-all uppercase rounded-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#555] mb-1">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (val.length >= 2) {
                            setCardExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
                          } else {
                            setCardExpiry(val);
                          }
                        }}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 text-[14px] border border-slate-200 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 transition-all rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#555] mb-1">
                        Security CVV *
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                        placeholder="•••"
                        className="w-full px-4 py-3 text-[14px] border border-slate-200 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 transition-all rounded-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "paypal" && (
                <div className="p-6 bg-[#FAF7F4] border border-[#eee] text-center space-y-3">
                  <p className="text-[13px] text-[#666]">
                    After clicking &ldquo;Place Order&rdquo;, you will be securely redirected to PayPal to complete your purchase.
                  </p>
                  <p className="text-[11px] text-[#888]">
                    Eligible for PayPal Buyer Protection & Pay in 4 Interest-Free Installments.
                  </p>
                </div>
              )}

              {paymentMethod === "wire" && (
                <div className="p-6 bg-[#FAF7F4] border border-[#eee] text-left space-y-2">
                  <p className="font-semibold text-[13px] text-[#1A1A1A]">
                    Private Vault Bank Wire / Cash On VIP Delivery
                  </p>
                  <p className="text-[12px] text-[#666]">
                    Our private jewellery concierge will reach out to you within 2 business hours via your confirmed telephone number with wire routing details and courier verification protocol.
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button on Mobile */}
            <div className="lg:hidden">
              <button
                type="submit"
                disabled={isProcessing || items.length === 0}
                className="w-full bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] hover:from-[#E49008] hover:to-[#9A4206] disabled:from-gray-300 disabled:to-gray-400 text-white py-4 uppercase text-[12px] tracking-[2px] font-bold transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 rounded-sm"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Securing Order & Vault...
                  </>
                ) : (
                  `Authorize & Place Order • $${total.toFixed(2)}`
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 md:p-8 border border-[#eee] shadow-sm sticky top-[90px]">
              <h3 className="font-cormorant text-2xl font-bold text-[#1A1A1A] pb-4 border-b border-[#eee] mb-6">
                Your Selection ({items.length})
              </h3>

              {/* Items List */}
              <div className="divide-y divide-[#eee] max-h-[340px] overflow-y-auto pr-1 mb-6">
                {items.length === 0 ? (
                  <p className="text-[13px] text-[#888] py-4 text-center">
                    No items in cart. <Link href="/shop" className="text-amber-600 font-bold underline">Discover Pieces</Link>
                  </p>
                ) : (
                  items.map(({ product, quantity, selectedVariants }) => (
                    <div key={product.id} className="py-3 flex items-center gap-4">
                      <div className="relative w-16 h-16 bg-[#F8F6F3] shrink-0 border border-slate-200 overflow-hidden rounded-sm">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                        <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold flex items-center justify-center rounded-bl shadow-sm">
                          {quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[13px] text-[#1A1A1A] truncate">{product.name}</p>
                        {selectedVariants && (
                          <p className="text-[11px] text-[#888] capitalize mt-0.5">
                            {Object.values(selectedVariants).join(" • ")}
                          </p>
                        )}
                        <p className="text-[12px] text-amber-600 font-bold mt-0.5">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      <span className="font-bold text-[14px] text-[#1A1A1A]">
                        ${(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Promo Code Input */}
              <div className="pt-4 border-t border-[#eee] mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Discount code (e.g. LUXURY10)"
                    className="flex-1 px-3 py-2.5 text-[13px] border border-slate-200 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 uppercase transition-all rounded-sm"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-gradient-to-r hover:from-[#F59E0B] hover:to-[#D97706] text-white text-[11px] font-bold uppercase tracking-wider transition-all"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-red-500 text-[11px] mt-1.5">{couponError}</p>}
                {couponSuccess && <p className="text-emerald-600 font-semibold text-[11px] mt-1.5">{couponSuccess}</p>}
              </div>

              {/* Cost Summary Breakdown */}
              <div className="space-y-3 text-[14px] text-[#666] pt-4 border-t border-[#eee] mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1A1A1A]">${cartSubtotal.toFixed(2)}</span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({appliedDiscount.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Transit Insurance & Delivery</span>
                  <span className="font-semibold">
                    {selectedShipping.price === 0 ? (
                      <span className="text-emerald-600 font-bold tracking-wide">COMPLIMENTARY</span>
                    ) : (
                      `$${selectedShipping.price.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Taxes & Duties</span>
                  <span className="font-semibold text-emerald-600">Complimentary Included</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-4 border-t border-[#eee] mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-lg text-[#1A1A1A]">Total</span>
                  <span className="font-cormorant text-3xl font-bold text-[#D97706]">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-[#888] mt-1">
                  Includes GIA certification certificate & wax-sealed luxury presentation box.
                </p>
              </div>

              {/* Desktop Place Order Button */}
              <div className="hidden lg:block">
                <button
                  type="submit"
                  disabled={isProcessing || items.length === 0}
                  className="w-full bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] hover:from-[#E49008] hover:to-[#9A4206] disabled:from-gray-300 disabled:to-gray-400 text-white py-4 uppercase text-[12px] tracking-[2px] font-bold transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer rounded-sm"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Securing Order & Vault...
                    </>
                  ) : (
                    `Authorize & Place Order • $${total.toFixed(2)}`
                  )}
                </button>
              </div>

              {/* Luxury Guarantee List */}
              <div className="mt-6 pt-6 border-t border-[#eee] space-y-2.5 text-[11px] text-[#666]">
                <div className="flex items-center gap-2">
                  <span className="text-[#D97706] font-bold">✦</span>
                  <span>100% Genuine Handcrafted Ethical Gold & Natural Diamonds</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✦</span>
                  <span>Armored Insured Delivery with Real-time GPS Tracker</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✦</span>
                  <span>30-Day Complimentary Exchange & Return Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
