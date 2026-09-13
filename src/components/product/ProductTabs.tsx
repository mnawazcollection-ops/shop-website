"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, Review } from "@/types";

interface ProductTabsProps {
  product: Product;
  reviews: Review[];
}

export default function ProductTabs({ product, reviews }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "shipping" | "reviews"
  >("description");

  const tabs = [
    { key: "description" as const, label: "Description" },
    { key: "specifications" as const, label: "Additional Information" },
    { key: "shipping" as const, label: "Shipping & Returns" },
    { key: "reviews" as const, label: `Reviews (${reviews.length})` },
  ];

  return (
    <div className="mt-16 lg:mt-20">
      {/* Tab Buttons */}
      <div className="border-b border-[#e5e5e5]">
        <div className="flex flex-wrap gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-6 lg:px-8 py-4 text-[13px] font-semibold uppercase tracking-[1.5px] transition-all duration-200 ${
                activeTab === tab.key
                  ? "text-[#1A1A1A] bg-white"
                  : "text-[#888] hover:text-[#1A1A1A] bg-transparent"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-8 lg:py-10">
        {/* Description */}
        {activeTab === "description" && (
          <div className="max-w-4xl">
            {product.description ? (
              <div className="text-[15px] text-[#555] leading-[1.85] space-y-5">
                {product.description.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ) : (
              <p className="text-[15px] text-[#666] leading-relaxed">
                {product.shortDescription ||
                  "Exquisitely designed and handcrafted by master artisans using premium hallmarked gold and certified precious stones."}
              </p>
            )}
          </div>
        )}

        {/* Specifications */}
        {activeTab === "specifications" && (
          <div className="max-w-3xl">
            {product.specifications ? (
              <table className="w-full text-[14px]">
                <tbody>
                  {Object.entries(product.specifications).map(
                    ([key, value], i) => (
                      <tr
                        key={key}
                        className={
                          i % 2 === 0 ? "bg-[#faf8f5]" : "bg-white"
                        }
                      >
                        <td className="py-3.5 px-5 font-semibold text-[#333] w-[200px] border border-[#f0f0f0]">
                          {key}
                        </td>
                        <td className="py-3.5 px-5 text-[#666] border border-[#f0f0f0]">
                          {value}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <p className="text-[14px] text-[#666]">
                No additional specifications available.
              </p>
            )}
          </div>
        )}

        {/* Shipping & Returns */}
        {activeTab === "shipping" && (
          <div className="max-w-3xl space-y-6">
            <div className="flex gap-4">
              <div className="text-[#D97706] shrink-0 mt-0.5">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-[#1A1A1A] mb-1.5">
                  Free Express Shipping
                </h4>
                <p className="text-[14px] text-[#666] leading-relaxed">
                  Free insured delivery on all orders over Rs. 50,000 across Pakistan. Standard delivery for orders under Rs. 50,000 is Rs. 2,500. Safe handover with tracking on all parcels. International shipping is also available upon request.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-[#D97706] shrink-0 mt-0.5">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-[#1A1A1A] mb-1.5">
                  Returns & Exchanges
                </h4>
                <p className="text-[14px] text-[#666] leading-relaxed">
                  We accept returns and size exchanges within 30 days of delivery. Items must be new and unworn with original box and certificates. Custom or engraved jewelry cannot be returned. Contact our support team to help you with an exchange or return.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-[#D97706] shrink-0 mt-0.5">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-[#1A1A1A] mb-1.5">
                  Lifetime Warranty
                </h4>
                <p className="text-[14px] text-[#666] leading-relaxed">
                  Every M. Nawaz Jewelry Collection piece is backed by our lifetime authenticity guarantee. We also offer complimentary professional cleaning and inspection services for all purchased items.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <div className="max-w-4xl">
            {reviews.length > 0 ? (
              <div className="space-y-8">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="pb-8 border-b border-[#f0f0f0] last:border-0"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-[#F0ECE5] overflow-hidden shrink-0 relative ring-2 ring-amber-400/40">
                        {review.avatar ? (
                          <Image
                            src={review.avatar}
                            alt={review.author}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#D97706] font-bold text-lg">
                            {review.author.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        {/* Rating + Date */}
                        <div className="flex items-center gap-3 mb-1.5">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`w-[14px] h-[14px] ${
                                  i < review.rating
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
                          <span className="text-[12px] text-[#aaa]">
                            {review.date}
                          </span>
                          {review.verified && (
                            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 font-bold rounded">
                              ✓ Verified Purchase
                            </span>
                          )}
                        </div>

                        {/* Author + Title */}
                        <div className="mb-2">
                          <span className="font-bold text-[14px] text-[#1A1A1A]">
                            {review.author}
                          </span>
                          {review.title && (
                            <span className="text-[14px] text-[#555]">
                              {" "}
                              — {review.title}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <p className="text-[14px] text-[#666] leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#faf8f5] border border-[#f0f0f0] rounded">
                <p className="text-[#888] text-[15px] mb-4">
                  No reviews yet. Be the first to review this product.
                </p>
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] hover:from-[#E49008] hover:to-[#9A4206] text-white px-6 py-2.5 text-[12px] uppercase tracking-wider font-bold shadow-md shadow-amber-500/25 transition-all rounded-sm">
                  Write a Review
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
