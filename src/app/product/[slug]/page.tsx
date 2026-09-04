"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { products, productReviews } from "@/data";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";
import ProductCard from "@/components/ui/ProductCard";
import Button from "@/components/ui/Button";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const product = products.find((p) => p.slug === slug);

  // Recently viewed (client-side localStorage)
  const [recentlyViewed] = useState<typeof products>(() => {
    if (typeof window === "undefined" || !product) return [];
    try {
      const stored = localStorage.getItem("sir-ihsan-recently-viewed");
      const viewed: string[] = stored ? JSON.parse(stored) : [];
      return viewed
        .filter((s) => s !== product.slug)
        .map((s) => products.find((p) => p.slug === s))
        .filter(Boolean)
        .slice(0, 4) as typeof products;
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!product) return;
    try {
      const stored = localStorage.getItem("sir-ihsan-recently-viewed");
      const viewed: string[] = stored ? JSON.parse(stored) : [];
      const updated = [
        product.slug,
        ...viewed.filter((s) => s !== product.slug),
      ].slice(0, 8);
      localStorage.setItem("sir-ihsan-recently-viewed", JSON.stringify(updated));
    } catch {
      // localStorage error fallback
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="font-cormorant text-4xl font-bold text-[#1A1A1A] mb-4">
            Product Not Found
          </h1>
          <p className="text-[15px] text-[#666] mb-8">
            The jewelry piece you are looking for does not exist or has been
            moved to a different collection.
          </p>
          <Button href="/shop" variant="primary" size="lg">
            Return to Shop
          </Button>
        </div>
      </div>
    );
  }

  const galleryImages = product.gallery || [product.image];
  const reviews = productReviews[product.id] || [];

  // Related products: same category, excluding current, limit 4
  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.category.toLowerCase() === product.category.toLowerCase()
    )
    .slice(0, 4);

  // If not enough same-category, fill with other products
  const fillProducts =
    relatedProducts.length < 4
      ? products
          .filter(
            (p) =>
              p.id !== product.id &&
              !relatedProducts.find((rp) => rp.id === p.id)
          )
          .slice(0, 4 - relatedProducts.length)
      : [];

  const allRelated = [...relatedProducts, ...fillProducts];

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image.startsWith("http") ? product.image : `https://sir-ihsan-jewelry.com${product.image}`,
    "description": product.shortDescription || product.description,
    "sku": product.sku || `SIJ-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Sir Ihsan"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://sir-ihsan-jewelry.com/product/${product.slug}`,
      "priceCurrency": "USD",
      "price": product.price,
      "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Sir Ihsan Luxury Jewelry"
      }
    },
    ...(product.rating ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount || 1
      }
    } : {})
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {/* Breadcrumb */}
      <div className="bg-[#FAF7F4] border-b border-[#f0ece5]">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-[13px]">
            <Link
              href="/"
              className="text-[#888] hover:text-[#D97706] transition-colors"
            >
              Home
            </Link>
            <svg
              width="12"
              height="12"
              fill="none"
              stroke="#bbb"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
            <Link
              href="/shop"
              className="text-[#888] hover:text-[#D97706] transition-colors"
            >
              Shop
            </Link>
            <svg
              width="12"
              height="12"
              fill="none"
              stroke="#bbb"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
            <Link
              href={`/shop?category=${product.category.toLowerCase()}`}
              className="text-[#888] hover:text-[#D97706] transition-colors"
            >
              {product.category}
            </Link>
            <svg
              width="12"
              height="12"
              fill="none"
              stroke="#bbb"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#1A1A1A] font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-[1400px] mx-auto px-6 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Left: Gallery */}
          <ProductGallery
            images={galleryImages}
            productName={product.name}
            badge={product.badge}
            originalPrice={product.originalPrice}
            price={product.price}
          />

          {/* Right: Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Tabs: Description, Specs, Shipping, Reviews */}
        <ProductTabs product={product} reviews={reviews} />

        {/* Related Products */}
        <RelatedProducts products={allRelated} />

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section className="mt-16 lg:mt-24 pt-12 lg:pt-16 border-t border-[#eee]">
            <div className="text-center mb-10">
              <p className="text-[12px] tracking-[3px] uppercase text-amber-600 font-bold mb-2">
                Your Browsing History
              </p>
              <h2 className="font-cormorant text-[28px] md:text-[34px] font-bold text-[#1A1A1A]">
                Recently Viewed
              </h2>
              <div className="flex justify-center mt-3">
                <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7">
              {recentlyViewed.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
