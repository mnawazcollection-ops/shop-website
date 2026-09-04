"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist, useCart } from "@/store/StoreContext";
import { Product } from "@/types";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();

  const { addToCart, setCartOpen } = useCart();
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleMoveToCart = (product: Product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  const handleAddAllToCart = () => {
    items.forEach((item) => addToCart(item, 1));
    setCartOpen(true);
  };

  const handleShareWishlist = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="bg-[#FCFAF8] min-h-[80vh] py-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12px] text-[#888] uppercase tracking-wider mb-8">
          <Link href="/" className="hover:text-[#D97706] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-semibold">Wishlist</span>
        </nav>

        {/* Page Title */}
        <div className="text-center mb-10">
          <p className="text-[12px] uppercase tracking-[3px] text-amber-600 font-bold mb-2">
            Saved Treasures
          </p>
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-[#1A1A1A]">
            My Wishlist
          </h1>
          <div className="flex justify-center mt-3">
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
          </div>
          <p className="text-[#666] text-[14px] mt-3 font-medium">
            {items.length} {items.length === 1 ? "piece" : "pieces"} saved for later
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Wishlist State */
          <div className="max-w-2xl mx-auto bg-white p-12 text-center border border-[#eee] shadow-sm rounded">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-rose-100 shadow-inner">
              <svg
                width="36"
                height="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h2 className="font-cormorant text-3xl font-bold text-[#1A1A1A] mb-3">
              Your Wishlist is Empty
            </h2>
            <p className="text-[14px] text-[#777] mb-8 max-w-md mx-auto">
              Explore our boutique and save your favorite rings, necklaces, earrings, and fine jewelry pieces.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] hover:from-[#E49008] hover:to-[#9A4206] text-white px-10 py-4 text-[12px] uppercase tracking-[2px] font-bold transition-all shadow-lg shadow-amber-500/25 rounded-sm"
            >
              Discover Fine Pieces
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-[#eee] shadow-sm overflow-hidden rounded">
            {/* Top Wishlist Actions Bar */}
            <div className="p-6 bg-[#FAF7F4] border-b border-[#eee] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShareWishlist}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[#ddd] bg-white hover:border-[#D97706] hover:text-[#D97706] text-[12px] uppercase tracking-wider font-bold text-[#555] transition-colors rounded-sm"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                  {copiedLink ? "Link Copied!" : "Share Wishlist"}
                </button>
                <button
                  onClick={clearWishlist}
                  className="text-[12px] text-[#999] hover:text-red-500 uppercase tracking-wider underline ml-2 transition-colors font-medium"
                >
                  Clear All
                </button>
              </div>

              <button
                onClick={handleAddAllToCart}
                className="px-6 py-2.5 bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] hover:from-[#E49008] hover:to-[#9A4206] text-white text-[12px] uppercase tracking-[1.5px] font-bold transition-all shadow-md shadow-amber-500/25 rounded-sm"
              >
                Add All to Bag
              </button>
            </div>

            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 px-6 py-4 bg-[#FAF7F4] border-b border-[#eee] text-[11px] uppercase tracking-[1.5px] font-semibold text-[#888]">
              <div className="col-span-5">Product</div>
              <div className="col-span-2 text-center">Unit Price</div>
              <div className="col-span-2 text-center">Stock Status</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {/* Wishlist Items */}
            <div className="divide-y divide-[#eee]">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                >
                  {/* Product thumbnail + info */}
                  <div className="col-span-5 flex items-center gap-4">
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="text-[#bbb] hover:text-red-500 transition-colors p-1"
                      title="Remove"
                    >
                      ✕
                    </button>
                    <Link
                      href={`/product/${product.slug}`}
                      className="relative w-20 h-20 bg-[#F8F6F3] shrink-0 border border-[#eee] overflow-hidden"
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
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-left md:text-center">
                    <span className="md:hidden text-[12px] text-[#888] mr-2">Price:</span>
                    <span className="font-bold text-[16px] text-[#D97706]">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[12px] text-[#999] line-through ml-2">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="col-span-2 text-left md:text-center">
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      In Stock
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex flex-wrap sm:flex-nowrap items-center justify-start md:justify-end gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`flex-1 sm:flex-initial text-center px-4 py-2.5 text-[11px] uppercase tracking-[1.5px] font-bold rounded-sm transition-all shadow-sm ${
                        addedIds[product.id]
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/20"
                          : "bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] hover:from-[#E49008] hover:to-[#9A4206] text-white shadow-amber-500/20"
                      }`}
                    >
                      {addedIds[product.id] ? "Added!" : "Add to Bag"}
                    </button>
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="flex-1 sm:flex-initial text-center px-3 py-2.5 border border-[#ddd] hover:border-[#D97706] hover:text-[#D97706] text-[11px] uppercase tracking-[1.5px] font-bold text-[#555] transition-colors whitespace-nowrap rounded-sm"
                      title="Move to bag and remove from wishlist"
                    >
                      Move to Bag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
