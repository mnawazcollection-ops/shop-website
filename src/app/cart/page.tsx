"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/StoreContext";
import { categories } from "@/data";
import { formatPrice } from "@/lib/currency";

const FREE_SHIPPING_THRESHOLD = 50000;

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
  } = useCart();

  const [orderNotes, setOrderNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    percent?: number;
    amount?: number;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [checkoutSuccess] = useState(false);

  // Discount calculation
  const discountAmount = appliedDiscount
    ? appliedDiscount.percent
      ? (cartSubtotal * appliedDiscount.percent) / 100
      : (appliedDiscount.amount || 0)
    : 0;

  const discountedSubtotal = Math.max(0, cartSubtotal - discountAmount);
  const shipping =
    cartSubtotal === 0 || cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 2500;
  const estimatedTotal = discountedSubtotal + shipping;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "LUXURY10" || code === "WELCOME10") {
      setAppliedDiscount({ code, percent: 10 });
      setCouponSuccess("10% luxury discount applied!");
    } else if (code === "GOLD50" || code === "GOLD5000") {
      setAppliedDiscount({ code, amount: 5000 });
      setCouponSuccess("Rs. 5,000 artisan discount applied!");
    } else {
      setCouponError("Invalid promo code. Try 'LUXURY10' or 'GOLD5000'");
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const freeShippingProgress = Math.min(
    100,
    (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100
  );
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - cartSubtotal
  );

  return (
    <div className="bg-[#FCFAF8] min-h-[80vh] py-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[12px] text-[#888] uppercase tracking-wider mb-8">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-semibold">Shopping Bag</span>
        </nav>

        {/* Page Title */}
        <div className="text-center mb-10">
          <p className="text-[12px] uppercase tracking-[3px] text-amber-600 font-bold mb-2">
            Your Selection
          </p>
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-[#1A1A1A]">
            Shopping Bag
          </h1>
        </div>

        {checkoutSuccess ? (
          <div className="max-w-2xl mx-auto bg-white p-12 text-center border border-[#eee] shadow-sm rounded-sm">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm shadow-emerald-500/20">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="font-cormorant text-3xl font-bold text-[#1A1A1A] mb-3">
              Thank You For Your Order
            </h2>
            <p className="text-[14px] text-[#666] leading-relaxed mb-6">
              We have received your order. We are packing your jewelry in our luxury gift box. A confirmation email has been sent to you.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/shop"
                className="bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] text-white px-8 py-3.5 text-[12px] uppercase tracking-[2px] font-bold transition-all shadow-md shadow-amber-500/25 rounded-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart State */
          <div className="max-w-3xl mx-auto bg-white p-12 text-center border border-amber-100/60 shadow-md shadow-amber-500/5 rounded-sm">
            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <h2 className="font-cormorant text-3xl font-bold text-[#1A1A1A] mb-3">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-[14px] text-[#777] mb-8 max-w-md mx-auto">
              Before you can checkout, you must select items to purchase. Explore our signature artisan collections below.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] text-white px-10 py-4 text-[12px] uppercase tracking-[2px] font-bold transition-all shadow-md shadow-amber-500/25 rounded-sm mb-12"
            >
              Start Shopping
            </Link>

            {/* Featured Categories in Empty State */}
            <div className="pt-10 border-t border-[#eee]">
              <p className="text-[12px] uppercase tracking-[2px] text-amber-700 font-bold mb-6">
                Featured Categories
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.slice(0, 4).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.name.toLowerCase()}`}
                    className="p-4 bg-[#FAF7F4] hover:bg-amber-50/60 transition-all border border-[#eee] hover:border-amber-200 text-center group rounded-sm"
                  >
                    <p className="font-cormorant text-lg font-bold text-[#1A1A1A] group-hover:text-amber-600 transition-colors">
                      {cat.name}
                    </p>
                    <p className="text-[11px] text-[#888] mt-1">{cat.productCount} Items</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left 2 Columns: Items & Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Free Shipping Notification Card */}
              <div className="bg-white p-6 border border-[#eee] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] text-[#555] font-medium">
                    {remainingForFreeShipping > 0 ? (
                      <>
                        Add <strong className="text-[#D97706] font-bold">{formatPrice(remainingForFreeShipping)}</strong> more for <strong>Free Express Insured Courier</strong>
                      </>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        You have unlocked Complimentary Insured Express Shipping!
                      </span>
                    )}
                  </span>
                  <span className="text-[12px] text-amber-700 font-bold">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full bg-[#f0ede8] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-amber-400 to-[#F59E0B] shadow-sm shadow-amber-500/50 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Table Card */}
              <div className="bg-white border border-[#eee] shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-12 px-6 py-4 bg-[#FAF7F4] border-b border-[#eee] text-[11px] uppercase tracking-[1.5px] font-semibold text-[#888]">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                <div className="divide-y divide-[#eee]">
                  {items.map(({ product, quantity, selectedVariants }) => (
                    <div
                      key={product.id}
                      className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                    >
                      {/* Product details */}
                      <div className="col-span-6 flex items-center gap-4">
                        <Link
                          href={`/product/${product.slug}`}
                          className="relative w-20 h-20 bg-[#F8F6F3] shrink-0 border border-[#eee] overflow-hidden rounded-sm"
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </Link>
                        <div className="min-w-0">
                          <p className="text-[11px] uppercase tracking-wider text-[#999]">
                            {product.category}
                          </p>
                          <Link
                            href={`/product/${product.slug}`}
                            className="font-cormorant text-lg font-bold text-[#1A1A1A] hover:text-[#D97706] transition-colors line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          {selectedVariants && Object.keys(selectedVariants).length > 0 && (
                            <p className="text-[11px] text-[#888] capitalize mt-0.5">
                              {Object.entries(selectedVariants)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(" • ")}
                            </p>
                          )}
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-[11px] text-rose-500 hover:text-rose-700 uppercase tracking-wider underline mt-2 block transition-colors font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-left md:text-center text-[14px] text-amber-700 font-bold">
                        <span className="md:hidden text-[12px] text-[#888] mr-2">Price:</span>
                        {formatPrice(product.price)}
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2 flex items-center md:justify-center">
                        <div className="flex items-center border border-[#ddd] rounded-sm">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-sm text-[#555] hover:bg-amber-50 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) =>
                              updateQuantity(
                                product.id,
                                Math.max(1, parseInt(e.target.value) || 1)
                              )
                            }
                            className="w-10 h-8 text-center text-[13px] font-bold text-[#1A1A1A] border-x border-[#ddd] outline-none"
                          />
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-sm text-[#555] hover:bg-amber-50 transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-2 text-left md:text-right font-bold text-[15px] text-[#1A1A1A]">
                        <span className="md:hidden text-[12px] text-[#888] mr-2">Subtotal:</span>
                        {formatPrice(product.price * quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table Bottom Actions */}
                <div className="p-6 bg-[#FAF7F4] border-t border-[#eee] flex flex-wrap items-center justify-between gap-4">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[1.5px] font-bold text-[#1A1A1A] hover:text-[#D97706] transition-colors"
                  >
                    ← Continue Shopping
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-[12px] uppercase tracking-[1.5px] font-semibold text-[#999] hover:text-rose-600 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Order Notes Field */}
              <div className="bg-white p-6 border border-[#eee] shadow-sm rounded-sm">
                <label className="block text-[12px] uppercase tracking-[1.5px] font-semibold text-[#1A1A1A] mb-2">
                  Special Instructions / Gift Message
                </label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Add ring size, custom engraving requests, or gift card message..."
                  rows={3}
                  className="w-full p-3 text-[13px] border border-slate-200 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 transition-all rounded-sm resize-none"
                />
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout */}
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-white p-8 border border-[#eee] shadow-sm rounded-sm">
                <h2 className="font-cormorant text-2xl font-bold text-[#1A1A1A] pb-4 border-b border-[#eee] mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3.5 text-[14px] text-[#555] mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#1A1A1A]">
                      {formatPrice(cartSubtotal)}
                    </span>
                  </div>

                  {appliedDiscount && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount ({appliedDiscount.code})</span>
                      <span className="font-bold">
                        -{formatPrice(discountAmount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Delivery</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax & Packaging</span>
                    <span className="font-semibold text-emerald-600">Included</span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyCoupon} className="mb-6 pt-4 border-t border-[#eee]">
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#777] mb-2">
                    Discount Code / Coupon
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. LUXURY10"
                      className="flex-1 px-3 py-2.5 text-[13px] border border-slate-200 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 uppercase rounded-sm"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] text-white text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm rounded-sm"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-[11px] mt-1.5">{couponError}</p>
                  )}
                  {couponSuccess && (
                    <p className="text-green-600 text-[11px] mt-1.5">{couponSuccess}</p>
                  )}
                </form>

                {/* Total */}
                <div className="pt-4 border-t border-[#eee] mb-8">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-[#1A1A1A] text-lg">Total</span>
                    <span className="font-cormorant text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600">
                      {formatPrice(estimatedTotal)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#999]">
                    Including safe delivery & authenticity certificate
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] hover:from-[#FBBF24] hover:to-[#D97706] text-white py-4 uppercase text-[12px] tracking-[2px] font-bold transition-all shadow-lg shadow-amber-500/25 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Proceed to Checkout →
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-[#eee] space-y-2 text-[11px] text-[#888] text-center">
                  <p className="flex items-center justify-center gap-1.5">
                    <span>🔒</span> 100% Safe & Secure Checkout
                  </p>
                  <p>Free Delivery & 30-Day Easy Returns</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
