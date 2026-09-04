"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { products, categories } from "@/data";
import ProductCard from "@/components/ui/ProductCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

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
  }, [query, selectedCategory, sortBy]);

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
        <nav className="flex items-center gap-2 text-[12px] text-[#888] uppercase tracking-wider mb-8">
          <Link href="/" className="hover:text-[#C8A165] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-semibold">Search Results</span>
          {query && (
            <>
              <span>/</span>
              <span className="text-[#C8A165] truncate max-w-[200px]">&ldquo;{query}&rdquo;</span>
            </>
          )}
        </nav>

        {/* Search Header Banner */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-[12px] uppercase tracking-[3px] text-[#C8A165] font-semibold mb-2">
            Search Boutique
          </p>
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
            {query ? `Results for “${query}”` : "Search Our Collections"}
          </h1>
          <p className="text-[#777] text-[14px]">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
          </p>

          {/* Search Bar Input */}
          <form onSubmit={handleSearchSubmit} className="mt-6 flex max-w-xl mx-auto shadow-sm border border-[#ddd] bg-white">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search for gold, diamond, rings, necklaces..."
              className="flex-1 px-4 py-3 text-[14px] outline-none text-[#1A1A1A]"
            />
            <button
              type="submit"
              className="bg-[#1A1A1A] hover:bg-[#C8A165] text-white px-6 text-[12px] uppercase tracking-[1.5px] font-bold transition-colors"
            >
              Search
            </button>
          </form>

          {/* Popular Tag Pills */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
            <span className="text-[12px] text-[#888]">Popular:</span>
            {popularSearches.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setInputQuery(tag);
                  router.push(`/search?q=${encodeURIComponent(tag)}`);
                }}
                className="text-[12px] text-[#666] hover:text-[#C8A165] hover:underline"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Filter and Sort Bar */}
        {filteredProducts.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-6 bg-white border border-[#eee] mb-8 shadow-sm">
            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] uppercase tracking-wider font-semibold text-[#888] mr-2">
                Filter:
              </span>
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1 text-[12px] uppercase tracking-wider transition-colors ${
                  selectedCategory === "all"
                    ? "bg-[#1A1A1A] text-white font-semibold"
                    : "bg-[#FAF7F4] text-[#555] hover:bg-[#f0ece5]"
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`px-3 py-1 text-[12px] uppercase tracking-wider transition-colors ${
                    selectedCategory.toLowerCase() === c.name.toLowerCase()
                      ? "bg-[#1A1A1A] text-white font-semibold"
                      : "bg-[#FAF7F4] text-[#555] hover:bg-[#f0ece5]"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Sort options */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[12px] uppercase tracking-wider font-semibold text-[#888]">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-[13px] border border-[#ddd] bg-white px-3 py-1.5 outline-none text-[#555]"
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
          <div className="max-w-2xl mx-auto bg-white p-12 text-center border border-[#eee] shadow-sm">
            <div className="w-16 h-16 bg-[#FAF7F4] text-[#999] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h2 className="font-cormorant text-3xl font-bold text-[#1A1A1A] mb-2">
              No matching jewelry found
            </h2>
            <p className="text-[14px] text-[#777] mb-8">
              We couldn&apos;t find any items matching &ldquo;{query}&rdquo;. Check your spelling or browse our bestselling collections below.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/shop"
                className="bg-[#1A1A1A] hover:bg-[#C8A165] text-white px-8 py-3.5 text-[12px] uppercase tracking-[2px] font-bold transition-colors"
              >
                View All Products
              </Link>
            </div>

            {/* Popular categories */}
            <div className="mt-12 pt-8 border-t border-[#eee]">
              <p className="text-[12px] uppercase tracking-[2px] text-[#999] font-semibold mb-4">
                Popular Collections
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.slice(0, 4).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.name.toLowerCase()}`}
                    className="p-3 bg-[#FAF7F4] hover:bg-[#f0ece5] text-center font-cormorant text-[16px] font-bold text-[#1A1A1A] hover:text-[#C8A165] transition-colors"
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
