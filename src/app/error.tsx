"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error securely
    console.error("Storefront Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center bg-[#FAF7F4]">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-6 opacity-80">
        <Image
          src="/images/logo.png"
          alt="Sir Ihsan Jewelry"
          fill
          className="object-contain"
        />
      </div>

      <p className="text-[12px] font-semibold tracking-[0.3em] uppercase text-amber-700 mb-2">
        Boutique Interruption
      </p>

      <h1 className="font-cormorant text-3xl sm:text-5xl font-normal tracking-wide text-[#1A1A1A] mb-4">
        An Unexpected Moment Occurred
      </h1>

      <div className="w-16 h-[1px] bg-amber-600/40 mx-auto mb-6" />

      <p className="max-w-md text-[#666] text-sm sm:text-base leading-relaxed mb-8 font-light">
        We apologize for this brief disruption in your shopping experience. Our technical jewelers have been notified.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => reset()}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#1A1A1A] text-white text-[12px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-amber-600 hover:shadow-lg cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="w-full sm:w-auto px-8 py-3.5 border border-[#1A1A1A] text-[#1A1A1A] text-[12px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#1A1A1A] hover:text-white"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
