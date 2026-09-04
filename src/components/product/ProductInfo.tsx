"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types";
import { useCart, useWishlist } from "@/store/StoreContext";
import { useRouter } from "next/navigation";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const { addToCart, setCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >(() => {
    const initial: Record<string, string> = {};
    product.variants?.forEach((v) => {
      const firstInStock = v.options.find((o) => o.inStock !== false);
      if (firstInStock) initial[v.type] = firstInStock.value;
    });
    return initial;
  });
  const [addedToCart, setAddedToCart] = useState(false);
  const wishlisted = isInWishlist(product.id);

  // Calculate price based on selected variant modifiers
  const computedPrice = useMemo(() => {
    let price = product.price;
    product.variants?.forEach((variant) => {
      const selected = selectedVariants[variant.type];
      const option = variant.options.find((o) => o.value === selected);
      if (option?.priceModifier) {
        price += option.priceModifier;
      }
    });
    return price;
  }, [product.price, product.variants, selectedVariants]);

  const computedOriginalPrice = useMemo(() => {
    if (!product.originalPrice) return undefined;
    let price = product.originalPrice;
    product.variants?.forEach((variant) => {
      const selected = selectedVariants[variant.type];
      const option = variant.options.find((o) => o.value === selected);
      if (option?.priceModifier) {
        price += option.priceModifier;
      }
    });
    return price;
  }, [product.originalPrice, product.variants, selectedVariants]);

  const salePercent =
    computedOriginalPrice
      ? Math.round(
          ((computedOriginalPrice - computedPrice) / computedOriginalPrice) *
            100
        )
      : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
    setAddedToCart(true);
    setCartOpen(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariants);
    router.push("/cart");
  };

  return (
    <div className="flex flex-col">
      {/* Category */}
      <p className="text-[12px] uppercase tracking-[3px] text-[#999] mb-2">
        {product.category}
      </p>

      {/* Title */}
      <h1 className="font-cormorant text-[28px] md:text-[32px] lg:text-[36px] font-bold text-[#1A1A1A] leading-tight mb-3">
        {product.name}
      </h1>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-[15px] h-[15px] ${
                i < (product.rating || 0)
                  ? "text-[#F59E0B] drop-shadow-sm"
                  : "text-[#ddd]"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-[13px] text-[#888]">
          ({product.reviewCount || 0} customer review{(product.reviewCount || 0) !== 1 ? "s" : ""})
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#eee]">
        {computedOriginalPrice && (
          <span className="text-[20px] text-[#999] line-through">
            ${computedOriginalPrice.toFixed(2)}
          </span>
        )}
        <span className="text-[30px] font-bold text-[#D97706] tracking-tight">
          ${computedPrice.toFixed(2)}
        </span>
        {salePercent > 0 && (
          <span className="text-[11px] font-bold text-white bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm shadow-red-500/25">
            Save {salePercent}%
          </span>
        )}
      </div>

      {/* Short description */}
      {product.shortDescription && (
        <p className="text-[14px] text-[#666] leading-relaxed mb-6">
          {product.shortDescription}
        </p>
      )}

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-5 mb-6 pb-6 border-b border-[#eee]">
          {product.variants.map((variant) => (
            <div key={variant.type}>
              <label className="block text-[13px] font-semibold text-[#333] uppercase tracking-wider mb-2.5">
                {variant.label}:{" "}
                <span className="font-normal text-[#888] capitalize">
                  {variant.options.find(
                    (o) => o.value === selectedVariants[variant.type]
                  )?.label || ""}
                </span>
              </label>

              <div className="flex flex-wrap gap-2.5">
                {variant.type === "color"
                  ? variant.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          option.inStock !== false &&
                          setSelectedVariants((prev) => ({
                            ...prev,
                            [variant.type]: option.value,
                          }))
                        }
                        disabled={option.inStock === false}
                        className={`relative w-9 h-9 rounded-full border-2 transition-all duration-200 ${
                          selectedVariants[variant.type] === option.value
                            ? "border-[#D97706] ring-2 ring-[#D97706]/40 scale-110 shadow-sm"
                            : "border-[#ddd] hover:border-[#aaa]"
                        } ${
                          option.inStock === false
                            ? "opacity-30 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        title={option.label}
                        aria-label={option.label}
                      >
                        <span
                          className="absolute inset-[3px] rounded-full"
                          style={{ backgroundColor: option.colorHex || "#ccc" }}
                        />
                        {option.inStock === false && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-full h-[1.5px] bg-[#999] rotate-45 absolute" />
                          </span>
                        )}
                      </button>
                    ))
                  : variant.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          option.inStock !== false &&
                          setSelectedVariants((prev) => ({
                            ...prev,
                            [variant.type]: option.value,
                          }))
                        }
                        disabled={option.inStock === false}
                        className={`px-4 py-2 text-[13px] font-medium border transition-all duration-200 ${
                          selectedVariants[variant.type] === option.value
                            ? "border-[#D97706] bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] text-white shadow-sm shadow-amber-500/25"
                            : "border-[#ddd] text-[#555] hover:border-[#D97706] hover:text-[#D97706]"
                        } ${
                          option.inStock === false
                            ? "opacity-40 cursor-not-allowed line-through"
                            : "cursor-pointer"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quantity + Add to Cart + Buy Now Row */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-4">
        {/* Quantity selector */}
        <div className="flex items-center border border-[#ddd] shrink-0 rounded overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-12 h-[52px] flex items-center justify-center text-[18px] text-[#666] hover:text-[#D97706] hover:bg-amber-50 transition-colors"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-12 h-[52px] text-center text-[15px] font-semibold text-[#1A1A1A] border-x border-[#ddd] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-12 h-[52px] flex items-center justify-center text-[18px] text-[#666] hover:text-[#D97706] hover:bg-amber-50 transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className={`flex-1 h-[52px] flex items-center justify-center gap-2.5 text-[13px] font-bold uppercase tracking-[1.5px] rounded transition-all duration-300 ${
            addedToCart
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
              : "bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] hover:from-[#E49008] hover:to-[#9A4206] text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-[0.99]"
          }`}
        >
          {addedToCart ? (
            <>
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Added to Cart
            </>
          ) : (
            <>
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              Add to Cart
            </>
          )}
        </button>

        {/* Buy Now */}
        <button
          onClick={handleBuyNow}
          className="h-[52px] px-8 flex items-center justify-center text-[13px] font-bold uppercase tracking-[1.5px] rounded bg-[#1A1A1A] hover:bg-neutral-800 text-white border border-[#1A1A1A] hover:border-neutral-800 transition-all shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
        >
          Buy Now
        </button>
      </div>

      {/* Wishlist + Compare + Share row */}
      <div className="flex items-center gap-5 py-4 mb-6 border-b border-[#eee]">
        <button
          onClick={() => toggleWishlist(product)}
          className={`flex items-center gap-2 text-[13px] font-medium transition-colors ${
            wishlisted
              ? "text-rose-600"
              : "text-[#666] hover:text-[#D97706]"
          }`}
        >
          <svg
            width="18"
            height="18"
            fill={wishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          {wishlisted ? "In Wishlist (Remove)" : "Add to Wishlist"}
        </button>

        <span className="w-px h-4 bg-[#ddd]" />

        <button className="flex items-center gap-2 text-[13px] text-[#666] hover:text-[#D97706] transition-colors">
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
          Share
        </button>
      </div>

      {/* SKU / Category / Tags Meta */}
      <div className="space-y-2 text-[13px] text-[#888]">
        {product.sku && (
          <p>
            <span className="font-semibold text-[#555] uppercase tracking-wider">
              SKU:
            </span>{" "}
            {product.sku}
          </p>
        )}
        <p>
          <span className="font-semibold text-[#555] uppercase tracking-wider">
            Category:
          </span>{" "}
          <span className="text-[#D97706] hover:underline cursor-pointer font-medium">
            {product.category}
          </span>
        </p>
        {product.tags && product.tags.length > 0 && (
          <p>
            <span className="font-semibold text-[#555] uppercase tracking-wider">
              Tags:
            </span>{" "}
            {product.tags.map((tag, i) => (
              <span key={tag}>
                <span className="text-[#D97706] hover:underline cursor-pointer font-medium">
                  {tag}
                </span>
                {i < product.tags!.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        )}
      </div>

      {/* Guarantee badges */}
      <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-[#eee]">
        {[
          {
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            ),
            text: "Free Insured Courier",
            color: "text-amber-700 bg-amber-50/80 border-amber-200/60",
          },
          {
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
            ),
            text: "30-Day Bespoke Returns",
            color: "text-emerald-700 bg-emerald-50/80 border-emerald-200/60",
          },
          {
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            ),
            text: "100% GIA Certified",
            color: "text-blue-700 bg-blue-50/80 border-blue-200/60",
          },
          {
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            ),
            text: "Luxury Velvet Packaging",
            color: "text-rose-700 bg-rose-50/80 border-rose-200/60",
          },
        ].map((item, i) => (
          <div key={i} className={`flex items-center gap-2.5 text-[12px] font-medium p-2.5 rounded-lg border ${item.color}`}>
            <span className="shrink-0">{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}
