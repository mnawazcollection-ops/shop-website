import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data";

export default function CategoryCards() {
  const displayCategories = categories.slice(0, 3);

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {displayCategories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-xl hover:shadow-amber-500/15 transition-all duration-500 border border-amber-500/10 hover:border-amber-400/40"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.88] group-hover:brightness-95"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Vibrant Gradient Overlays depending on card index */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${
                    index === 0
                      ? "from-emerald-950/85 via-emerald-950/30 to-transparent"
                      : index === 1
                      ? "from-amber-950/85 via-amber-950/30 to-transparent"
                      : "from-blue-950/85 via-blue-950/30 to-transparent"
                  }`}
                />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <span
                  className={`inline-block text-[10px] tracking-[2.5px] uppercase font-bold px-2.5 py-0.5 rounded-full mb-2 border backdrop-blur-sm ${
                    index === 0
                      ? "text-emerald-300 bg-emerald-900/50 border-emerald-400/30"
                      : index === 1
                      ? "text-amber-300 bg-amber-900/50 border-amber-400/30"
                      : "text-blue-300 bg-blue-900/50 border-blue-400/30"
                  }`}
                >
                  {category.productCount}+ Artisan Pieces
                </span>
                <h3 className="font-cormorant text-2xl lg:text-[30px] font-bold text-white mb-2 drop-shadow-md">
                  {category.name}
                </h3>
                <span className="inline-flex items-center gap-2 text-[12px] tracking-[2px] uppercase text-amber-300 font-semibold group-hover:text-amber-200 transition-colors duration-300">
                  Explore Collection
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
