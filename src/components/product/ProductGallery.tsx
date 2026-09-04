"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  badge?: "new" | "sale" | "hot";
  originalPrice?: number;
  price?: number;
}

export default function ProductGallery({
  images,
  productName,
  badge,
  originalPrice,
  price,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const mainImageRef = useRef<HTMLDivElement>(null);

  const salePercent =
    originalPrice && price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!mainImageRef.current) return;
      const rect = mainImageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    },
    []
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const lightboxPrev = () =>
    setLightboxIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const lightboxNext = () =>
    setLightboxIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row gap-4">
        {/* Thumbnail strip — vertical on desktop, horizontal on mobile */}
        <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] lg:w-[90px] shrink-0 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative shrink-0 w-[72px] h-[72px] lg:w-[82px] lg:h-[82px] border-2 rounded-sm overflow-hidden transition-all duration-200 ${
                idx === activeIndex
                  ? "border-[#D97706] ring-2 ring-amber-400/40 opacity-100 scale-105 shadow-sm"
                  : "border-[#e8e8e8] opacity-60 hover:opacity-100 hover:border-amber-400"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} view ${idx + 1}`}
                fill
                className="object-cover"
                sizes="82px"
              />
            </button>
          ))}
        </div>

        {/* Main image with zoom */}
        <div className="relative flex-1">
          <div
            ref={mainImageRef}
            className="relative aspect-square bg-[#F8F6F3] overflow-hidden cursor-crosshair group rounded-sm shadow-sm"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            onClick={() => openLightbox(activeIndex)}
          >
            <Image
              src={images[activeIndex]}
              alt={productName}
              fill
              className={`object-cover transition-transform duration-300 ${
                isZoomed ? "scale-[2]" : "scale-100"
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : undefined
              }
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
              {badge === "sale" && salePercent > 0 && (
                <span className="bg-gradient-to-r from-rose-600 to-red-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 shadow-md shadow-rose-500/25 rounded-sm">
                  -{salePercent}%
                </span>
              )}
              {badge === "new" && (
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 shadow-md shadow-emerald-500/25 rounded-sm">
                  New
                </span>
              )}
              {badge === "hot" && (
                <span className="bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 shadow-md shadow-amber-500/25 rounded-sm">
                  Hot
                </span>
              )}
            </div>

            {/* Zoom hint icon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openLightbox(activeIndex);
              }}
              className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#333] hover:bg-gradient-to-r hover:from-[#F59E0B] hover:to-[#D97706] hover:text-white transition-all z-10 shadow-md"
              aria-label="Open fullscreen gallery"
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </button>
          </div>

          {/* Prev / Next on main image */}
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveIndex((i) =>
                    i === 0 ? images.length - 1 : i - 1
                  )
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#333] hover:bg-gradient-to-r hover:from-[#F59E0B] hover:to-[#D97706] hover:text-white transition-all shadow-md z-10"
                aria-label="Previous image"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={() =>
                  setActiveIndex((i) =>
                    i === images.length - 1 ? 0 : i + 1
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#333] hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-600 hover:text-white transition-all shadow-md hover:shadow-amber-500/30 z-10"
                aria-label="Next image"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/80 hover:text-white z-[110]"
            aria-label="Close lightbox"
          >
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-6 text-white/60 text-[14px] tracking-wider z-[110]">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Main lightbox image */}
          <div
            className="relative w-[90vw] h-[80vh] max-w-[1000px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${productName} - ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              quality={95}
            />
          </div>

          {/* Lightbox nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxPrev();
                }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/30 flex items-center justify-center text-white hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-600 hover:border-amber-500 transition-all z-[110] shadow-md"
                aria-label="Previous"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxNext();
                }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/30 flex items-center justify-center text-white hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-600 hover:border-amber-500 transition-all z-[110] shadow-md"
                aria-label="Next"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}

          {/* Lightbox thumbnail strip */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-[110]">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(idx);
                }}
                className={`relative w-14 h-14 border-2 overflow-hidden transition-all ${
                  idx === lightboxIndex
                    ? "border-[#D97706] ring-2 ring-amber-400/50 opacity-100"
                    : "border-white/30 opacity-50 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
