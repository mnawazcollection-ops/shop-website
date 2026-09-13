import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-20 text-center bg-[#FCFAF8]">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-6 opacity-80">
        <Image
          src="/images/logo.png"
          alt="M. Nawaz Jewelry Collection"
          fill
          className="object-contain"
        />
      </div>

      <p className="text-[12px] font-semibold tracking-[0.3em] uppercase text-amber-600 mb-3">
        Error 404
      </p>

      <h1 className="font-cormorant text-4xl sm:text-6xl font-normal tracking-wide text-[#1A1A1A] mb-4">
        Page Not Found
      </h1>

      <div className="w-16 h-[1px] bg-amber-600/40 mx-auto mb-6" />

      <p className="max-w-md text-[#666] text-sm sm:text-base leading-relaxed mb-10 font-light">
        The page or jewelry item you are looking for does not exist or may have been moved.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/shop"
          className="w-full sm:w-auto px-8 py-3.5 bg-[#1A1A1A] text-white text-[12px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-amber-600 hover:shadow-lg"
        >
          Explore All Jewelry
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto px-8 py-3.5 border border-[#1A1A1A] text-[#1A1A1A] text-[12px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#1A1A1A] hover:text-white"
        >
          Go to Homepage
        </Link>
      </div>

      <div className="mt-16 pt-8 border-t border-[#eee] flex flex-wrap justify-center gap-6 text-[11px] uppercase tracking-widest text-[#888]">
        <Link href="/collections" className="hover:text-amber-600 transition-colors">
          Collections
        </Link>
        <span>•</span>
        <Link href="/category/rings" className="hover:text-amber-600 transition-colors">
          Rings
        </Link>
        <span>•</span>
        <Link href="/category/necklaces" className="hover:text-amber-600 transition-colors">
          Necklaces
        </Link>
        <span>•</span>
        <Link href="/contact" className="hover:text-amber-600 transition-colors">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
