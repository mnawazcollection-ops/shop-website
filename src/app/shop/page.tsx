"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";
import { categories } from "@/data";
import { useStore } from "@/store/StoreContext";
import { formatPrice } from "@/lib/currency";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const { products } = useStore();

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState(1000000);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (
          selectedCategory !== "all" &&
          p.category.toLowerCase() !== selectedCategory.toLowerCase() &&
          p.slug.indexOf(selectedCategory.toLowerCase()) === -1
        ) {
          return false;
        }
        if (p.price > priceRange) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [products, selectedCategory, sortBy, priceRange]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      {/* Breadcrumb / Title */}
      <div className="text-center mb-12">
        <p className="text-[12px] tracking-[3px] uppercase text-amber-600 mb-2 font-bold">
          M. Nawaz Jewelry Collection
        </p>
        <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-[#1A1A1A]">
          Shop Fine Jewelry
        </h1>
        <div className="flex justify-center mt-3">
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          {/* Categories Filter */}
          <div className="border border-[#f0f0f0] p-6 bg-white shadow-sm rounded-sm">
            <h3 className="font-cormorant text-xl font-bold text-[#1A1A1A] mb-4 pb-2 border-b border-[#f0f0f0]">
              Categories
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left text-[14px] transition-colors flex justify-between items-center ${
                    selectedCategory === "all"
                      ? "text-amber-600 font-bold"
                      : "text-[#666] hover:text-amber-600"
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[12px] text-[#999] font-medium">{products.length}</span>
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left text-[14px] transition-colors flex justify-between items-center ${
                      selectedCategory === cat.slug
                        ? "text-amber-600 font-bold"
                        : "text-[#666] hover:text-amber-600"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[12px] text-[#999] font-medium">
                      {cat.productCount}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range Filter */}
          <div className="border border-[#f0f0f0] p-6 bg-white shadow-sm rounded-sm">
            <h3 className="font-cormorant text-xl font-bold text-[#1A1A1A] mb-4 pb-2 border-b border-[#f0f0f0]">
              Max Price: <span className="text-amber-600">{formatPrice(priceRange)}</span>
            </h3>
            <input
              type="range"
              min="20000"
              max="1000000"
              step="10000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[12px] text-[#888] mt-2 font-medium">
              <span>{formatPrice(20000)}</span>
              <span className="text-amber-600 font-bold">{formatPrice(1000000)}+</span>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-[#f0f0f0]">
            <p className="text-[14px] text-[#666]">
              Showing <span className="font-bold text-[#1A1A1A]">{filteredProducts.length}</span> luxury creations
            </p>
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-[13px] text-[#666] uppercase tracking-wider font-semibold">
                Sort By:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-[#ddd] px-3 py-1.5 text-[13px] text-[#333] focus:outline-none focus:border-amber-600 bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-[#ddd]">
              <p className="text-[16px] text-[#888] mb-4">
                No products found matching your filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setPriceRange(2000);
                }}
                className="text-amber-600 hover:text-amber-700 underline text-[14px] font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#888]">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
