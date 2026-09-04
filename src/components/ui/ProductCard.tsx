"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useState } from "react";
import { useCart, useWishlist } from "@/store/StoreContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const badgeColors = {
    new: "bg-[#C8A165] text-white",
    sale: "bg-[#E74C3C] text-white",
    hot: "bg-[#1A1A1A] text-white",
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden bg-[#F8F6F3] mb-4">
        <div className="aspect-square relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 text-[10px] tracking-wider uppercase font-medium z-10 ${
              badgeColors[product.badge]
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Top-Right Quick Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
            isWishlisted
              ? "bg-white text-[#E74C3C] shadow-md scale-100 opacity-100"
              : "bg-white/80 backdrop-blur-sm text-[#555] hover:text-[#E74C3C] hover:bg-white opacity-0 group-hover:opacity-100"
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label="Wishlist"
        >
          <svg
            width="15"
            height="15"
            fill={isWishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Quick Actions Bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 flex justify-center gap-2 py-3 bg-white/95 backdrop-blur-sm transition-all duration-300 z-10 ${
            isHovered
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/product/${product.slug}`;
            }}
            className="w-9 h-9 flex items-center justify-center border border-[#e5e5e5] hover:bg-[#C8A165] hover:border-[#C8A165] hover:text-white transition-colors duration-200"
            title="View Details"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button
            onClick={handleWishlistClick}
            className={`w-9 h-9 flex items-center justify-center border transition-colors duration-200 ${
              isWishlisted
                ? "border-[#E74C3C] bg-[#E74C3C] text-white"
                : "border-[#e5e5e5] hover:bg-[#C8A165] hover:border-[#C8A165] hover:text-white text-[#1A1A1A]"
            }`}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <svg
              width="16"
              height="16"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
          <button
            onClick={handleAddToCartClick}
            className={`w-9 h-9 flex items-center justify-center border transition-colors duration-200 ${
              added
                ? "border-green-600 bg-green-600 text-white"
                : "border-[#e5e5e5] hover:bg-[#C8A165] hover:border-[#C8A165] hover:text-white text-[#1A1A1A]"
            }`}
            title="Add to Cart"
          >
            {added ? (
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="text-center">
        <p className="text-[11px] text-[#999] uppercase tracking-[2px] mb-1">
          {product.category}
        </p>
        <h3 className="font-medium text-[15px] text-[#1A1A1A] mb-2 group-hover:text-[#C8A165] transition-colors duration-200">
          {product.name}
        </h3>
        <div className="flex items-center justify-center gap-2">
          {product.originalPrice && (
            <span className="text-[14px] text-[#999] line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-[15px] font-semibold text-[#C8A165]">
            ${product.price.toFixed(2)}
          </span>
        </div>
        {/* Rating Stars */}
        {product.rating && (
          <div className="flex justify-center gap-0.5 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < product.rating! ? "text-[#C8A165]" : "text-[#ddd]"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
