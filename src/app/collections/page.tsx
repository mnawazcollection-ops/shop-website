import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";

const collections = [
  {
    title: "Bridal & Heritage",
    subtitle: "Eternal Promises",
    description:
      "Handcrafted wedding bands, diamond solitaires, and heirloom gold sets designed for your unforgettable moments.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=900&h=600&fit=crop",
    href: "/shop?category=gold-sets",
    count: "34 Pieces",
  },
  {
    title: "Everyday Elegance",
    subtitle: "Subtle Radiance",
    description:
      "Delicate chains, minimalist rings, and lightweight gold hoops engineered for daily grace and confidence.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&h=600&fit=crop",
    href: "/shop?category=necklaces",
    count: "28 Pieces",
  },
  {
    title: "Vintage Charm",
    subtitle: "Antique Artistry",
    description:
      "Filigree filigree motifs, vintage sapphire clusters, and royal estate inspirations steeped in history.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&h=600&fit=crop",
    href: "/shop?category=earrings",
    count: "22 Pieces",
  },
  {
    title: "Modern Luxe",
    subtitle: "Bold Statement",
    description:
      "Architectural shapes, geometric diamond settings, and statement bangles that redefine modern luxury.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&h=600&fit=crop",
    href: "/shop?category=bracelets",
    count: "19 Pieces",
  },
];

export default function CollectionsPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <SectionHeading
        subtitle="Curated Selections"
        title="Our Signature Collections"
      />

      <div className="space-y-16 mt-12">
        {collections.map((col, idx) => (
          <div
            key={col.title}
            className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 ${
              idx % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div className="w-full lg:w-1/2 relative h-[360px] md:h-[450px] overflow-hidden group">
              <Image
                src={col.image}
                alt={col.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Text */}
            <div className="w-full lg:w-1/2 max-w-lg">
              <span className="text-[12px] uppercase tracking-[3px] text-amber-600 font-bold">
                {col.subtitle} • {col.count}
              </span>
              <h2 className="font-cormorant text-3xl md:text-4xl font-bold text-[#1A1A1A] mt-2 mb-4">
                {col.title}
              </h2>
              <p className="text-[#666] leading-relaxed text-[15px] mb-8">
                {col.description}
              </p>
              <Link
                href={col.href}
                className="inline-flex items-center gap-3 bg-[#1A1A1A] text-white hover:bg-gradient-to-r hover:from-[#F59E0B] hover:to-[#D97706] px-8 py-3.5 text-[12px] uppercase tracking-wider font-bold transition-all shadow-sm hover:shadow-md rounded-sm"
              >
                <span>Explore Collection</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
