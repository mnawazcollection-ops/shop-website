import Image from "next/image";
import Button from "@/components/ui/Button";

export default function PromoBanner() {
  return (
    <section className="relative h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=1920&h=600&fit=crop"
        alt="Discover beauty in graceful luxury"
        fill
        className="object-cover"
        sizes="100vw"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="max-w-2xl px-6">
          <p className="text-[12px] tracking-[4px] uppercase text-[#C8A165] mb-4 font-medium">
            Special Offer
          </p>
          <h2 className="font-cormorant text-3xl md:text-4xl lg:text-5xl xl:text-[56px] font-semibold text-white leading-tight mb-6">
            Discover Beauty In Graceful With Our Luxury
          </h2>
          <p className="text-[15px] text-white/70 mb-8 max-w-lg mx-auto leading-relaxed">
            Explore our exclusive collection of handcrafted jewelry pieces
            designed to elevate your style and celebrate life&apos;s precious
            moments.
          </p>
          <Button href="/shop" variant="primary" size="lg">
            Shop Collection
          </Button>
        </div>
      </div>
    </section>
  );
}
