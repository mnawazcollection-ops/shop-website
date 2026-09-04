"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearch } from "@/store/StoreContext";
import { products } from "@/data";

export default function SearchOverlay() {
  const { isSearchOpen, setSearchOpen } = useSearch();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleClose = () => {
    setQuery("");
    setSearchOpen(false);
  };

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen]);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const popularSearches = ["Gold", "Diamond", "Earrings", "Rings", "Bracelets", "Necklaces"];

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Search panel */}
      <div className="relative bg-white w-full max-w-3xl mx-auto mt-[120px] md:mt-[140px] shadow-2xl animate-fadeIn">
        {/* Search input */}
        <form onSubmit={handleSubmit} className="flex items-center border-b border-[#eee]">
          <svg className="w-5 h-5 ml-6 text-[#999]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for jewelry..."
            className="flex-1 px-4 py-5 text-[16px] text-[#1A1A1A] placeholder-[#aaa] outline-none bg-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mr-2 text-[#999] hover:text-[#333] p-2"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-5 text-[12px] uppercase tracking-wider text-[#888] hover:text-[#D97706] font-bold border-l border-[#eee] transition-colors"
          >
            Close
          </button>
        </form>

        {/* Content area */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim().length < 2 ? (
            /* Popular searches */
            <div className="p-6">
              <h4 className="text-[12px] uppercase tracking-[2px] text-amber-700 font-bold mb-4">
                Popular Searches
              </h4>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 border border-[#e5e5e5] text-[13px] text-[#555] hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50/50 transition-colors rounded-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            /* Search results */
            <div className="p-4">
              <p className="text-[12px] uppercase tracking-wider text-amber-600 font-bold px-2 mb-3">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </p>
              <div className="space-y-1">
                {results.slice(0, 6).map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-4 p-3 hover:bg-amber-50/40 rounded transition-colors group"
                  >
                    <div className="relative w-14 h-14 bg-[#F8F6F3] shrink-0 overflow-hidden border border-[#eee] rounded-sm">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-[#999] uppercase tracking-wider">
                        {product.category}
                      </p>
                      <p className="text-[14px] text-[#1A1A1A] font-medium group-hover:text-[#D97706] transition-colors truncate">
                        {product.name}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {product.originalPrice && (
                        <span className="text-[12px] text-[#999] line-through block">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-[15px] font-bold text-[#D97706]">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              {results.length > 6 && (
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                  }}
                  className="w-full mt-3 py-3 text-center text-[13px] text-[#D97706] font-bold uppercase tracking-wider hover:bg-amber-50/60 transition-colors border-t border-[#eee]"
                >
                  View All {results.length} Results →
                </button>
              )}
            </div>
          ) : (
            /* No results */
            <div className="p-8 text-center">
              <p className="text-[#888] text-[15px] mb-2">
                No products found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-[13px] text-[#aaa]">
                Try a different search term or browse our categories.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
