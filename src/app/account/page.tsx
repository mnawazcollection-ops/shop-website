"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";

interface OrderRecord {
  orderId: string;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    country: string;
  };
  shipping: {
    name: string;
    eta: string;
  };
  items: Array<{
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    quantity: number;
    variants?: Record<string, string>;
  }>;
  total: number;
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"portal" | "orders" | "track">("portal");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [clientName, setClientName] = useState("Victoria Sterling");
  const [clientEmail, setClientEmail] = useState("v.sterling@luxury.com");

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [trackQuery, setTrackQuery] = useState("");
  const [trackResult, setTrackResult] = useState<OrderRecord | null>(null);
  const [trackError, setTrackError] = useState("");

  // Load orders from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sir-ihsan-orders");
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        // Sample default order for luxury demonstration
        const sampleOrders: OrderRecord[] = [
          {
            orderId: "SIJ-2026-89421",
            createdAt: new Date().toISOString(),
            customer: {
              firstName: "Victoria",
              lastName: "Sterling",
              email: "v.sterling@luxury.com",
              city: "New York",
              country: "United States",
            },
            shipping: {
              name: "Complimentary Insured Courier",
              eta: "4–6 Business Days",
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
            total: 245,
          },
        ];
        setOrders(sampleOrders);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError("");
    setTrackResult(null);

    const q = trackQuery.trim().toUpperCase();
    if (!q) return;

    const found = orders.find((o) => o.orderId.toUpperCase() === q);
    if (found) {
      setTrackResult(found);
    } else {
      setTrackError(`No order records found matching ID "${q}". Please verify the format (e.g. SIJ-2026-XXXXX).`);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setActiveTab("portal");
  };

  return (
    <div className="bg-[#FCFAF8] min-h-[85vh] py-12 text-[#1A1A1A]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-[12px] uppercase tracking-[3px] text-[#C8A165] font-semibold mb-2">
            VIP Maison Concierge
          </p>
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-[#1A1A1A]">
            Client Portal & Orders
          </h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center border-b border-[#eee] mb-10 max-w-2xl mx-auto">
          {[
            { id: "portal", label: "My Profile & Status" },
            { id: "orders", label: `Order History (${orders.length})` },
            { id: "track", label: "Track Acquisition" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-4 sm:px-8 text-[12px] sm:text-[13px] uppercase tracking-[1.5px] font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#C8A165] text-[#1A1A1A]"
                  : "border-transparent text-[#999] hover:text-[#555]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Profile & VIP Status */}
        {activeTab === "portal" && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* VIP Tier Banner */}
            <div className="bg-gradient-to-r from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] text-white p-8 md:p-10 border border-[#C8A165]/30 shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <span className="text-[11px] uppercase tracking-[3px] text-[#C8A165] font-semibold block mb-1">
                    Maison Privilège Member
                  </span>
                  <h2 className="font-cormorant text-3xl md:text-4xl font-bold text-white mb-2">
                    {clientName}
                  </h2>
                  <p className="text-[13px] text-[#ccc] flex items-center gap-2">
                    <span>✉️ {clientEmail}</span>
                    <span>•</span>
                    <span className="text-[#C8A165]">Gold Tier Collector</span>
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 text-center rounded">
                  <p className="text-[11px] uppercase tracking-wider text-[#bbb]">Available Privileges</p>
                  <p className="font-cormorant text-2xl font-bold text-[#C8A165] mt-1">Complimentary</p>
                  <p className="text-[11px] text-[#aaa]">Insured Courier & VIP Sizing</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 border border-[#eee] shadow-sm">
                <p className="font-cormorant text-xl font-bold text-[#1A1A1A] mb-2">
                  Personal Atelier Concierge
                </p>
                <p className="text-[13px] text-[#666] mb-4">
                  Dedicated master jeweler available for private commission previews and ring resizing.
                </p>
                <a
                  href="mailto:concierge@sirihsan.com"
                  className="text-[12px] uppercase tracking-wider font-semibold text-[#C8A165] hover:underline"
                >
                  Contact Concierge →
                </a>
              </div>

              <div className="bg-white p-6 border border-[#eee] shadow-sm">
                <p className="font-cormorant text-xl font-bold text-[#1A1A1A] mb-2">
                  Saved Delivery Address
                </p>
                <p className="text-[13px] text-[#666] mb-4">
                  742 Fifth Avenue, Penthouse 12A<br />
                  New York, NY 10022<br />
                  United States
                </p>
                <span className="text-[12px] uppercase tracking-wider font-semibold text-green-700">
                  ✓ Verified Vault Address
                </span>
              </div>

              <div className="bg-white p-6 border border-[#eee] shadow-sm">
                <p className="font-cormorant text-xl font-bold text-[#1A1A1A] mb-2">
                  Saved Wishlist
                </p>
                <p className="text-[13px] text-[#666] mb-4">
                  Review your curated pieces, diamond solitaire bands, and custom gift lists.
                </p>
                <Link
                  href="/wishlist"
                  className="text-[12px] uppercase tracking-wider font-semibold text-[#C8A165] hover:underline"
                >
                  View My Wishlist →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Order History */}
        {activeTab === "orders" && (
          <div className="max-w-4xl mx-auto space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white p-12 text-center border border-[#eee] shadow-sm">
                <p className="font-cormorant text-2xl font-bold text-[#1A1A1A] mb-2">
                  No previous acquisitions recorded
                </p>
                <p className="text-[14px] text-[#777] mb-6">
                  Browse our handcrafted collections and experience artisan fine jewelry.
                </p>
                <Link
                  href="/shop"
                  className="bg-[#1A1A1A] hover:bg-[#C8A165] text-white px-8 py-3.5 text-[12px] uppercase tracking-[2px] font-bold transition-colors"
                >
                  Explore Boutique
                </Link>
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.orderId} className="bg-white border border-[#eee] shadow-sm overflow-hidden">
                  {/* Order header banner */}
                  <div className="p-6 bg-[#FAF7F4] border-b border-[#eee] flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#888] font-semibold">Order Number</span>
                      <p className="font-bold text-[16px] text-[#C8A165] tracking-wider">{ord.orderId}</p>
                      <p className="text-[12px] text-[#888] mt-0.5">
                        Placed on {new Date(ord.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded">
                        <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                        In Artisan Preparation
                      </span>
                      <Link
                        href={`/order-success?orderId=${ord.orderId}`}
                        className="px-4 py-2 border border-[#ddd] hover:border-[#C8A165] hover:text-[#C8A165] text-[12px] uppercase tracking-wider font-semibold text-[#555] transition-colors"
                      >
                        View Official Receipt
                      </Link>
                    </div>
                  </div>

                  {/* Order item rows */}
                  <div className="p-6 divide-y divide-[#eee]">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-[#F8F6F3] border border-[#eee] shrink-0 overflow-hidden">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/product/${item.slug}`}
                            className="font-cormorant text-lg font-bold text-[#1A1A1A] hover:text-[#C8A165] transition-colors truncate block"
                          >
                            {item.name}
                          </Link>
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

                  {/* Total footer */}
                  <div className="p-4 px-6 bg-[#FAF7F4] border-t border-[#eee] flex items-center justify-between text-[13px]">
                    <span className="text-[#666]">{ord.shipping.name}</span>
                    <span className="font-bold text-[16px] text-[#1A1A1A]">
                      Total: ${ord.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Track Acquisition */}
        {activeTab === "track" && (
          <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 border border-[#eee] shadow-sm">
            <h2 className="font-cormorant text-2xl font-bold text-[#1A1A1A] mb-2 text-center">
              Real-Time Atelier & Courier Tracker
            </h2>
            <p className="text-[13px] text-[#777] text-center mb-6">
              Enter your official Sir Ihsan Order Number to view master inspection status and armored transit telemetry.
            </p>

            <form onSubmit={handleTrackSearch} className="flex gap-2 mb-6">
              <input
                type="text"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder="e.g. SIJ-2026-89421"
                className="flex-1 px-4 py-3 text-[14px] border border-[#ddd] outline-none focus:border-[#C8A165] uppercase transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#C8A165] text-white text-[12px] uppercase tracking-[1.5px] font-bold transition-colors"
              >
                Track
              </button>
            </form>

            {trackError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-[13px] mb-6 rounded">
                {trackError}
              </div>
            )}

            {trackResult && (
              <div className="p-6 bg-[#FAF7F4] border border-[#eee] space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-[#eee] pb-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#888]">Order ID</span>
                    <p className="font-bold text-[16px] text-[#C8A165]">{trackResult.orderId}</p>
                  </div>
                  <span className="text-green-700 font-semibold text-[13px] bg-green-50 px-2.5 py-1 rounded">
                    ✓ Handcrafting Complete
                  </span>
                </div>

                <div className="space-y-2 text-[13px] text-[#555]">
                  <p><strong>Courier:</strong> {trackResult.shipping.name}</p>
                  <p><strong>Estimated Delivery:</strong> {trackResult.shipping.eta}</p>
                  <p><strong>Destination:</strong> {trackResult.customer.city}, {trackResult.customer.country}</p>
                  <p><strong>Total Value:</strong> ${trackResult.total.toFixed(2)} (Insured)</p>
                </div>

                <Link
                  href={`/order-success?orderId=${trackResult.orderId}`}
                  className="inline-block mt-2 text-[12px] uppercase tracking-wider font-semibold text-[#C8A165] hover:underline"
                >
                  View Full Acquisition Receipt & Tracking Stepper →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
