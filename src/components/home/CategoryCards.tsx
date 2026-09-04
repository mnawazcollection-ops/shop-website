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
              href={`/shop?category=${category.slug}`}
              className="group relative overflow-hidden bg-[#F8F6F3]"
            >
              <div
                className={`relative ${
                  index === 0
                    ? "aspect-[4/3]"
                    : index === 1
                    ? "aspect-[4/3]"
                    : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-[11px] tracking-[3px] uppercase text-[#C8A165] mb-1 font-medium">
                  {category.productCount}+ Products
                </p>
                <h3 className="font-cormorant text-2xl lg:text-[28px] font-semibold text-white mb-3">
                  {category.name}
                </h3>
                <span className="inline-flex items-center gap-2 text-[12px] tracking-[2px] uppercase text-white font-medium group-hover:text-[#C8A165] transition-colors duration-300">
                  Shop Now
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
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
