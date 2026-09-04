"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface OrderItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  variants?: Record<string, string>;
}

interface OrderData {
  orderId: string;
  createdAt: string;
  customer: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    country: string;
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    zip: string;
  };
  shipping: {
    name: string;
    price: number;
    eta: string;
  };
  payment: {
    method: string;
    cardLast4?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "SIJ-2026-89421";

  const [order] = useState<OrderData | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("sir-ihsan-latest-order");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.orderId === orderId || !searchParams.get("orderId")) {
          return parsed;
        }
      }
      const allOrders = localStorage.getItem("sir-ihsan-orders");
      if (allOrders) {
        const list = JSON.parse(allOrders);
        const match = list.find((o: OrderData) => o.orderId === orderId);
        if (match) return match;
      }
    } catch {
      // fallback
    }
    return null;
  });

  // Fallback demo order if visited directly without storage
  const displayOrder: OrderData = order || {
    orderId,
    createdAt: new Date().toISOString(),
    customer: {
      email: "client@mnawazjewelry.com",
      phone: "+1 (555) 234-5678",
      firstName: "Victoria",
      lastName: "Sterling",
      country: "United States",
      address1: "742 Fifth Avenue",
      address2: "Suite 12A",
      city: "New York",
      state: "NY",
      zip: "10022",
    },
    shipping: {
      name: "Complimentary Insured Courier",
      price: 0,
      eta: "4–6 Business Days",
    },
    payment: {
      method: "card",
      cardLast4: "8821",
    },
    items: [
      {
        id: "1",
        name: "Golden Bloom Earrings",
        slug: "golden-bloom-earrings",
        image: "/images/products/earrings-1.jpg",
        price: 245,
        quantity: 1,
        variants: { metal: "18K Yellow Gold" },
      },
    ],
    subtotal: 245,
    discount: 0,
    shippingCost: 0,
    total: 245,
  };

  const formattedDate = new Date(displayOrder.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-[#FCFAF8] min-h-screen py-12 md:py-16 text-[#1A1A1A]">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        {/* Celebration Header Card */}
        <div className="bg-white p-8 md:p-12 border border-[#eee] shadow-sm text-center mb-8 relative overflow-hidden">
          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/25">
            <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <p className="text-[12px] uppercase tracking-[3px] text-emerald-600 font-bold mb-2">
            Order Confirmed & Secured
          </p>
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-3">
            Thank You, {displayOrder.customer.firstName}!
          </h1>
          <p className="text-[15px] text-[#555] max-w-lg mx-auto leading-relaxed">
            Your fine jewellery acquisition has been secured. A confirmation email has been dispatched to{" "}
            <strong className="text-[#1A1A1A]">{displayOrder.customer.email}</strong>.
          </p>

          <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-amber-50/60 border border-amber-200/60 rounded text-[13px] text-[#555]">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-[#888]">Order ID:</span>
            <span className="font-bold text-[#D97706] tracking-wider">{displayOrder.orderId}</span>
            <span className="text-[#bbb]">|</span>
            <span className="text-[#777]">{formattedDate}</span>
          </div>
        </div>

        {/* Live Status Tracker */}
        <div className="bg-white p-6 md:p-8 border border-[#eee] shadow-sm mb-8">
          <h2 className="font-cormorant text-2xl font-bold text-[#1A1A1A] mb-6">
            Atelier Preparation & Transit Tracker
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {[
              {
                step: "1",
                title: "Order Secured",
                desc: "Payment authorized & GIA recorded",
                status: "completed",
              },
              {
                step: "2",
                title: "Artisan Inspection",
                desc: "Hand-polishing & hallmark certification",
                status: "active",
              },
              {
                step: "3",
                title: "Vault Dispatch",
                desc: "Tamper-evident armored courier",
                status: "pending",
              },
              {
                step: "4",
                title: "Delivered",
                desc: `Est: ${displayOrder.shipping.eta}`,
                status: "pending",
              },
            ].map((s) => (
              <div key={s.step} className="flex sm:flex-col items-start gap-4 sm:gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${
                    s.status === "completed"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25"
                      : s.status === "active"
                      ? "bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] text-white ring-4 ring-amber-400/30 shadow-md shadow-amber-500/30 animate-pulse"
                      : "bg-[#eee] text-[#888]"
                  }`}
                >
                  {s.status === "completed" ? "✓" : s.step}
                </div>
                <div>
                  <p className="font-bold text-[14px] text-[#1A1A1A]">{s.title}</p>
                  <p className="text-[12px] text-[#777] mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details & Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left 2 Cols: Itemized Receipt Table */}
          <div className="lg:col-span-2 bg-white border border-[#eee] shadow-sm overflow-hidden">
            <div className="p-6 bg-[#FAF7F4] border-b border-[#eee] flex items-center justify-between">
              <h2 className="font-cormorant text-2xl font-bold text-[#1A1A1A]">
                Acquisition Details
              </h2>
              <span className="text-[12px] text-[#888]">
                {displayOrder.items.length} {displayOrder.items.length === 1 ? "Piece" : "Pieces"}
              </span>
            </div>

            <div className="divide-y divide-[#eee] p-6">
              {displayOrder.items.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-[#F8F6F3] border border-[#eee] shrink-0 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-cormorant text-lg font-bold text-[#1A1A1A] truncate">
                      {item.name}
                    </p>
                    {item.variants && (
                      <p className="text-[11px] text-[#888] capitalize">
                        {Object.values(item.variants).join(" • ")}
                      </p>
                    )}
                    <p className="text-[12px] text-[#777]">
                      Qty: <strong>{item.quantity}</strong> × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-semibold text-[15px] text-[#1A1A1A]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="p-6 bg-[#FAF7F4] border-t border-[#eee] space-y-2.5 text-[13px] text-[#666]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1A1A1A]">${displayOrder.subtotal.toFixed(2)}</span>
              </div>
              {displayOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>VIP Promotional Privilege</span>
                  <span>-${displayOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Courier Delivery</span>
                <span className="font-semibold text-emerald-600">
                  {displayOrder.shippingCost === 0 ? "Complimentary (FREE)" : `$${displayOrder.shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Hallmark Certification & Duties</span>
                <span className="font-semibold text-emerald-600">Complimentary Included</span>
              </div>
              <div className="pt-3 border-t border-[#eee] flex justify-between items-baseline">
                <span className="font-bold text-[15px] text-[#1A1A1A]">Final Paid Total</span>
                <span className="font-cormorant text-3xl font-bold text-[#D97706]">
                  ${displayOrder.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Customer & Shipping Details */}
          <div className="space-y-6">
            <div className="bg-white p-6 border border-[#eee] shadow-sm space-y-5 text-[13px]">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-[#888] mb-1">
                  Delivery Destination
                </p>
                <p className="font-bold text-[#1A1A1A]">
                  {displayOrder.customer.firstName} {displayOrder.customer.lastName}
                </p>
                <p className="text-[#555] mt-0.5">{displayOrder.customer.address1}</p>
                {displayOrder.customer.address2 && <p className="text-[#555]">{displayOrder.customer.address2}</p>}
                <p className="text-[#555]">
                  {displayOrder.customer.city}
                  {displayOrder.customer.state ? `, ${displayOrder.customer.state}` : ""} {displayOrder.customer.zip}
                </p>
                <p className="text-[#555]">{displayOrder.customer.country}</p>
              </div>

              <div className="pt-4 border-t border-[#eee]">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-[#888] mb-1">
                  Delivery Method
                </p>
                <p className="font-medium text-[#1A1A1A]">{displayOrder.shipping.name}</p>
                <p className="text-[12px] text-[#D97706] font-bold mt-0.5">
                  Est. Delivery: {displayOrder.shipping.eta}
                </p>
              </div>

              <div className="pt-4 border-t border-[#eee]">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-[#888] mb-1">
                  Payment Method
                </p>
                <p className="font-medium text-[#1A1A1A] capitalize">
                  {displayOrder.payment.method === "card"
                    ? `Credit Card (ending in ${displayOrder.payment.cardLast4 || "8821"})`
                    : displayOrder.payment.method}
                </p>
                <p className="text-[12px] text-emerald-600 font-bold mt-0.5">✓ Paid & Verified</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 border border-[#eee] shadow-sm space-y-3">
              <button
                onClick={() => window.print()}
                className="w-full py-3 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white uppercase text-[11px] tracking-[2px] font-bold transition-colors flex items-center justify-center gap-2 rounded-sm"
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6.72 13.829c-.24-1.076-.64-2.128-1.2-3.131M17.28 13.829c.24-1.076.64-2.128 1.2-3.131M3 6.75h18M6.75 3h10.5M6.75 21h10.5M4.5 12h15" />
                </svg>
                Print Receipt / Invoice
              </button>

              <Link
                href="/shop"
                className="w-full py-3 bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] hover:from-[#E49008] hover:to-[#9A4206] text-white uppercase text-[11px] tracking-[2px] font-bold transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5 rounded-sm"
              >
                Continue Shopping →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <p className="text-[#888] font-cormorant text-2xl">Confirming your order...</p>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
