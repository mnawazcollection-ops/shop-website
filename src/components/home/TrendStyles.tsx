import Image from "next/image";
import Link from "next/link";

const trendItems = [
  {
    title: "See Trend\nStyles",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=700&fit=crop",
    href: "/collections",
    span: "col-span-1 row-span-2",
  },
  {
    title: "Diamonds",
    subtitle: "New Arrivals",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=350&fit=crop",
    href: "/shop?category=diamonds",
    span: "col-span-1 row-span-1",
  },
  {
    title: "Gold Sets",
    subtitle: "Popular",
    image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&h=350&fit=crop",
    href: "/shop?category=gold-sets",
    span: "col-span-1 row-span-1",
  },
  {
    title: "Earrings",
    subtitle: "Best Seller",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=350&fit=crop",
    href: "/shop?category=earrings",
    span: "col-span-1 row-span-1",
  },
  {
    title: "Bracelets",
    subtitle: "Trending",
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&h=350&fit=crop",
    href: "/shop?category=bracelets",
    span: "col-span-1 row-span-1",
  },
];

export default function TrendStyles() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[220px]">
          {/* Large left card */}
          <Link
            href={trendItems[0].href}
            className="group relative overflow-hidden md:row-span-2"
          >
            <Image
              src={trendItems[0].image}
              alt={trendItems[0].title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="font-cormorant text-2xl lg:text-3xl font-semibold text-white whitespace-pre-line leading-tight">
                {trendItems[0].title}
              </h3>
              <span className="inline-flex items-center gap-2 text-[12px] tracking-[2px] uppercase text-[#C8A165] font-medium mt-3">
                Explore
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

          {/* 4 smaller cards */}
          {trendItems.slice(1).map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group relative overflow-hidden"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-5">
                {item.subtitle && (
                  <p className="text-[10px] tracking-[2px] uppercase text-[#C8A165] mb-1 font-medium">
                    {item.subtitle}
                  </p>
                )}
                <h3 className="font-cormorant text-xl font-semibold text-white">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
