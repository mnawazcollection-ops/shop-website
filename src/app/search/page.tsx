"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { categories } from "@/data";
import { useStore } from "@/store/StoreContext";
import ProductCard from "@/components/ui/ProductCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const { products } = useStore();

  const [inputQuery, setInputQuery] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  const filteredProducts = useMemo(() => {
    let list = products;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedCategory !== "all") {
      list = list.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (sortBy === "price-low") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return list;
  }, [products, query, selectedCategory, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputQuery.trim())}`);
    }
  };

  const popularSearches = ["Gold", "Diamond", "Earrings", "Rings", "Bracelets", "Necklaces"];

  return (
    <div className="bg-[#FCFAF8] min-h-[80vh] py-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12px] text-slate-500 uppercase tracking-wider mb-8">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Search Results</span>
          {query && (
            <>
              <span>/</span>
              <span className="text-amber-600 font-bold truncate max-w-[200px]">&ldquo;{query}&rdquo;</span>
            </>
          )}
        </nav>

        {/* Search Header Banner */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-[12px] uppercase tracking-[3px] text-amber-600 font-bold mb-2">
            Search Boutique
          </p>
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {query ? `Results for “${query}”` : "Search Our Collections"}
          </h1>
          <p className="text-slate-600 text-[14px]">
            <span className="font-bold text-amber-600">{filteredProducts.length}</span> {filteredProducts.length === 1 ? "product" : "products"} found
          </p>

          {/* Search Bar Input */}
          <form onSubmit={handleSearchSubmit} className="mt-6 flex max-w-xl mx-auto shadow-md shadow-amber-500/10 border border-amber-200/70 bg-white rounded-sm overflow-hidden">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search for gold, diamond, rings, necklaces..."
              className="flex-1 px-4 py-3 text-[14px] outline-none text-slate-900 focus:ring-1 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] hover:from-[#FBBF24] hover:via-[#F59E0B] hover:to-[#D97706] text-white px-7 text-[12px] uppercase tracking-[1.5px] font-bold transition-all shadow-md shadow-amber-500/25"
            >
              Search
            </button>
          </form>

          {/* Popular Tag Pills */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
            <span className="text-[12px] text-slate-500 font-medium">Popular:</span>
            {popularSearches.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setInputQuery(tag);
                  router.push(`/search?q=${encodeURIComponent(tag)}`);
                }}
                className="text-[12px] font-semibold text-slate-600 hover:text-amber-600 hover:underline px-2 py-0.5 rounded-full hover:bg-amber-50 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Filter and Sort Bar */}
        {filteredProducts.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-6 bg-white border border-amber-100/60 mb-8 shadow-sm rounded-sm">
            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] uppercase tracking-wider font-bold text-slate-500 mr-2">
                Filter:
              </span>
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-1.5 rounded-sm text-[12px] uppercase tracking-wider font-bold transition-all ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-sm shadow-amber-500/30"
                    : "bg-[#FAF7F4] text-slate-700 hover:bg-amber-50 hover:text-amber-700"
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`px-3.5 py-1.5 rounded-sm text-[12px] uppercase tracking-wider font-bold transition-all ${
                    selectedCategory.toLowerCase() === c.name.toLowerCase()
                      ? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-sm shadow-amber-500/30"
                      : "bg-[#FAF7F4] text-slate-700 hover:bg-amber-50 hover:text-amber-700"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Sort options */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[12px] uppercase tracking-wider font-bold text-slate-500">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-[13px] border border-slate-200 bg-white px-3 py-1.5 outline-none text-slate-700 font-medium rounded-sm focus:border-amber-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        )}

        {/* Results Grid or Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="max-w-2xl mx-auto bg-white p-12 text-center border border-amber-100 shadow-md shadow-amber-500/5 rounded-sm">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h2 className="font-cormorant text-3xl font-bold text-slate-900 mb-2">
              No matching jewelry found
            </h2>
            <p className="text-[14px] text-slate-600 mb-8">
              We couldn&apos;t find any items matching &ldquo;{query}&rdquo;. Check your spelling or browse our bestselling collections below.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/shop"
                className="bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] text-white px-8 py-3.5 text-[12px] uppercase tracking-[2px] font-bold rounded-sm shadow-md shadow-amber-500/25 hover:shadow-lg transition-all"
              >
                View All Products
              </Link>
            </div>

            {/* Popular categories */}
            <div className="mt-12 pt-8 border-t border-slate-100">
              <p className="text-[12px] uppercase tracking-[2px] text-amber-700 font-bold mb-4">
                Popular Collections
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.slice(0, 4).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.name.toLowerCase()}`}
                    className="p-3 bg-[#FAF7F4] hover:bg-amber-50 text-center font-cormorant text-[16px] font-bold text-slate-800 hover:text-amber-700 rounded-sm border border-transparent hover:border-amber-200 transition-all"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <p className="text-[#888] font-cormorant text-2xl">Loading search results...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
