"use client";

import { use, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data";
import { useStore } from "@/store/StoreContext";
import ProductCard from "@/components/ui/ProductCard";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getCollectionSchema } from "@/lib/seo";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Category custom banner descriptions and images
const categoryMetadata: Record<
  string,
  {
    title: string;
    subtitle: string;
    description: string;
    bannerImage: string;
  }
> = {
  rings: {
    title: "Signature Rings",
    subtitle: "Artisan Fine Jewelry",
    description:
      "From radiant solitaire diamonds to hand-carved eternity bands in 18K gold and platinum, discover rings that celebrate love and timeless personal expression.",
    bannerImage:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&h=600&fit=crop",
  },
  necklaces: {
    title: "Timeless Necklaces & Pendants",
    subtitle: "Artisan Fine Jewelry",
    description:
      "Luminous freshwater pearls, delicate yellow gold chains, and master-crafted gemstone pendants sculpted to adorn with effortless grace.",
    bannerImage:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&h=600&fit=crop",
  },
  earrings: {
    title: "Radiant Earrings",
    subtitle: "Artisan Fine Jewelry",
    description:
      "Hand-sculpted floral studs, cascading diamond drops, and sculpted gold hoops created to illuminate every contour.",
    bannerImage:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&h=600&fit=crop",
  },
  bracelets: {
    title: "Artisan Bracelets & Bangles",
    subtitle: "Artisan Fine Jewelry",
    description:
      "Sculptural twisted gold cuffs, intricate filigree bangles, and tennis bracelets forged from ethical metals and fine diamonds.",
    bannerImage:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&h=600&fit=crop",
  },
  pendants: {
    title: "Bespoke Pendants",
    subtitle: "Artisan Fine Jewelry",
    description:
      "Exquisite central charms, solitaire drops, and symbolic heritage talismans designed to stay close to your heart.",
    bannerImage:
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=1600&h=600&fit=crop",
  },
  "gold-sets": {
    title: "Imperial Gold Sets",
    subtitle: "Artisan Fine Jewelry",
    description:
      "Harmonious suites of matching necklaces, earrings, and bracelets crafted for grand celebrations, weddings, and royal milestones.",
    bannerImage:
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=1600&h=600&fit=crop",
  },
  watches: {
    title: "Luxury Timepieces",
    subtitle: "Precision & Horology",
    description:
      "Swiss-precision craftsmanship meets artisan jewelry detailing. Elegant diamond bezels and precious gold link bracelets.",
    bannerImage:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&h=600&fit=crop",
  },
  "new-arrivals": {
    title: "New Arrivals",
    subtitle: "Autumn / Winter Haute Joaillerie",
    description:
      "Explore the latest creations fresh from our atelier. Groundbreaking design, rare stones, and renewed contemporary silhouettes.",
    bannerImage:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&h=600&fit=crop",
  },
  "best-sellers": {
    title: "Iconic Best Sellers",
    subtitle: "Most Loved Masterpieces",
    description:
      "Our most sought-after icons, cherished by collectors across the globe for their unmatched beauty and enduring perfection.",
    bannerImage:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1600&h=600&fit=crop",
  },
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const normalizedSlug = slug.toLowerCase();
  const { products } = useStore();

  // Filters state
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [metalFilter, setMetalFilter] = useState<string>("all");
  const [saleFilter, setSaleFilter] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Meta info
  const meta = categoryMetadata[normalizedSlug] || {
    title: normalizedSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    subtitle: "Artisan Fine Jewelry",
    description:
      "Discover handcrafted luxury jewelry meticulously designed and shaped with ethical gold, diamonds, and precious gemstones.",
    bannerImage:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&h=600&fit=crop",
  };

  // Base product filtering
  const baseCategoryProducts = useMemo(() => {
    if (normalizedSlug === "new-arrivals") {
      return products.filter((p) => p.badge === "new" || p.rating === 5);
    }
    if (normalizedSlug === "best-sellers") {
      return products.filter((p) => p.badge === "hot" || (p.reviewCount || 0) >= 15);
    }
    const matched = products.filter(
      (p) =>
        p.category.toLowerCase() === normalizedSlug ||
        p.category.toLowerCase().includes(normalizedSlug) ||
        p.tags?.some((t) => t.toLowerCase() === normalizedSlug)
    );
    // If no exact match (e.g. watches or rare tag), fallback to all products so page isn't broken
    return matched.length > 0 ? matched : products;
  }, [products, normalizedSlug]);

  // Apply subfilters (price, metal, sale, sort)
  const filteredProducts = useMemo(() => {
    let result = [...baseCategoryProducts];

    // Price
    if (priceFilter === "under-100k") {
      result = result.filter((p) => p.price < 100000);
    } else if (priceFilter === "100k-250k") {
      result = result.filter((p) => p.price >= 100000 && p.price <= 250000);
    } else if (priceFilter === "over-250k") {
      result = result.filter((p) => p.price > 250000);
    }

    // Metal
    if (metalFilter !== "all") {
      result = result.filter((p) =>
        p.tags?.some((t) => t.toLowerCase() === metalFilter.toLowerCase()) ||
        p.name.toLowerCase().includes(metalFilter.toLowerCase())
      );
    }

    // Sale only
    if (saleFilter) {
      result = result.filter((p) => p.originalPrice || p.badge === "sale");
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "newest") {
      result.sort((a, b) => (b.badge === "new" ? 1 : 0) - (a.badge === "new" ? 1 : 0));
    }

    return result;
  }, [baseCategoryProducts, priceFilter, metalFilter, saleFilter, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Collections", url: "/shop" },
    { name: meta.title, url: `/category/${normalizedSlug}` },
  ]);

  const collectionSchema = getCollectionSchema({
    name: meta.title,
    url: `/category/${normalizedSlug}`,
    description: meta.description,
    itemCount: filteredProducts.length,
  });

  return (
    <div className="bg-[#FCFAF8] min-h-screen">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [breadcrumbSchema, collectionSchema],
        }}
      />
      {/* Category Hero Banner */}
      <div className="relative h-[320px] md:h-[400px] w-full overflow-hidden flex items-center justify-center">
        <Image
          src={meta.bannerImage}
          alt={meta.title}
          fill
          priority
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto text-white">
          {/* Breadcrumb */}
          <nav className="flex justify-center items-center gap-2 text-[11px] uppercase tracking-[2px] text-[#ddd] mb-3">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-amber-400 transition-colors">
              Collections
            </Link>
            <span>/</span>
            <span className="text-amber-400 font-bold">{meta.title}</span>
          </nav>

          <p className="text-[12px] uppercase tracking-[3px] text-amber-400 font-bold mb-2 drop-shadow">
            {meta.subtitle}
          </p>
          <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 drop-shadow-md">
            {meta.title}
          </h1>
          <p className="text-[14px] md:text-[15px] text-[#eee] max-w-xl mx-auto leading-relaxed">
            {meta.description}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
        {/* Filter and Controls Header */}
        <div className="bg-white p-4 md:p-6 border border-[#eee] shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[#ddd] text-[12px] uppercase tracking-wider font-semibold text-[#1A1A1A]"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              Filters
            </button>

            <span className="text-[13px] text-[#777]">
              Showing <strong className="text-amber-600 font-bold">{visibleProducts.length}</strong> of{" "}
              <strong className="text-[#1A1A1A]">{filteredProducts.length}</strong> pieces
            </span>
          </div>

          {/* Desktop Filter Pills */}
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-[12px] uppercase tracking-wider text-[#888] font-semibold">
              Price:
            </span>
            {[
              { label: "All", val: "all" },
              { label: "Under Rs. 100k", val: "under-100k" },
              { label: "Rs. 100k - 250k", val: "100k-250k" },
              { label: "Over Rs. 250k", val: "over-250k" },
            ].map((p) => (
              <button
                key={p.val}
                onClick={() => setPriceFilter(p.val)}
                className={`px-3 py-1.5 text-[12px] uppercase tracking-wider rounded-sm transition-all ${
                  priceFilter === p.val
                    ? "bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] text-white font-bold shadow-md shadow-amber-500/25"
                    : "bg-[#FAF7F4] text-[#555] hover:bg-amber-50 hover:text-amber-700"
                }`}
              >
                {p.label}
              </button>
            ))}

            <span className="w-px h-4 bg-[#ddd] mx-2" />

            <button
              onClick={() => setSaleFilter(!saleFilter)}
              className={`px-3 py-1.5 text-[12px] uppercase tracking-wider rounded-sm transition-all ${
                saleFilter
                  ? "bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold shadow-md shadow-rose-500/25"
                  : "bg-[#FAF7F4] text-[#555] hover:bg-rose-50 hover:text-rose-700"
              }`}
            >
              Sale Only
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] uppercase tracking-wider text-[#888] font-semibold">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-[13px] border border-[#ddd] bg-white px-3 py-2 outline-none text-[#555]"
            >
              <option value="featured">Featured Collection</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Mobile Filter Drawer / Collapsible */}
        {mobileFilterOpen && (
          <div className="lg:hidden bg-white p-6 border border-[#eee] shadow-md mb-8 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div>
              <p className="text-[12px] uppercase tracking-wider text-[#1A1A1A] font-semibold mb-2">
                Price Range
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "All", val: "all" },
                  { label: "Under Rs. 100k", val: "under-100k" },
                  { label: "Rs. 100k - 250k", val: "100k-250k" },
                  { label: "Over Rs. 250k", val: "over-250k" },
                ].map((p) => (
                  <button
                    key={p.val}
                    onClick={() => setPriceFilter(p.val)}
                    className={`px-3 py-1 text-[12px] border ${
                      priceFilter === p.val
                        ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                        : "border-[#ddd] text-[#555]"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[12px] uppercase tracking-wider text-[#1A1A1A] font-semibold mb-2">
                Special Offers
              </p>
              <button
                onClick={() => setSaleFilter(!saleFilter)}
                className={`px-4 py-1.5 text-[12px] border ${
                  saleFilter
                    ? "border-[#E74C3C] bg-[#E74C3C] text-white"
                    : "border-[#ddd] text-[#555]"
                }`}
              >
                {saleFilter ? "✓ Sale Only" : "Show Sale Items"}
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {visibleProducts.length === 0 ? (
          <div className="bg-white p-12 text-center border border-[#eee] max-w-xl mx-auto">
            <p className="font-cormorant text-2xl font-bold text-[#1A1A1A] mb-2">
              No products found in this filter
            </p>
            <p className="text-[13px] text-[#777] mb-6">
              Try adjusting your price range or clearing the active filters.
            </p>
            <button
              onClick={() => {
                setPriceFilter("all");
                setMetalFilter("all");
                setSaleFilter(false);
              }}
              className="bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] text-white px-6 py-2.5 text-[12px] uppercase tracking-wider font-bold transition-all shadow-md shadow-amber-500/25 rounded-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More Pagination */}
            {visibleCount < filteredProducts.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                  className="px-10 py-4 bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] hover:from-[#E49008] hover:to-[#9A4206] text-white text-[12px] uppercase tracking-[2px] font-bold transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 rounded-sm"
                >
                  Load More Pieces ({filteredProducts.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}

        {/* Category Exploration Carousel / Cards */}
        <div className="mt-20 pt-12 border-t border-[#eee]">
          <div className="text-center mb-10">
            <p className="text-[12px] uppercase tracking-[3px] text-amber-600 font-bold mb-2">
              Explore More
            </p>
            <h3 className="font-cormorant text-3xl font-bold text-[#1A1A1A]">
              Other Collections You May Adore
            </h3>
            <div className="flex justify-center mt-3">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className={`group p-4 text-center border rounded transition-all duration-200 ${
                  c.slug === normalizedSlug
                    ? "border-[#D97706] bg-amber-50/60 shadow-sm"
                    : "border-[#eee] bg-white hover:border-[#D97706] hover:shadow-md"
                }`}
              >
                <div className="relative w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden border border-[#eee] ring-2 ring-transparent group-hover:ring-amber-400/50 transition-all">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="64px"
                  />
                </div>
                <p className="font-cormorant font-bold text-[15px] text-[#1A1A1A] group-hover:text-amber-600 transition-colors">
                  {c.name}
                </p>
                <p className="text-[11px] text-[#888] mt-0.5 font-medium">{c.productCount} Pieces</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
