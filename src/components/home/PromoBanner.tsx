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
          <span className="inline-block text-[11px] tracking-[4px] uppercase bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white font-bold px-5 py-1.5 rounded-full mb-5 shadow-lg shadow-amber-500/30 border border-amber-300/30">
            ✦ Bespoke Haute Joaillerie ✦
          </span>
          <h2 className="font-cormorant text-3xl md:text-4xl lg:text-5xl xl:text-[56px] font-bold text-white leading-tight mb-5 drop-shadow-md">
            Discover Radiant Beauty In Pure Handcrafted Gold
          </h2>
          <p className="text-[15px] text-white/90 mb-8 max-w-lg mx-auto leading-relaxed drop-shadow-sm">
            Explore our exclusive collection of master-sculpted jewelry pieces designed with ethically sourced precious gemstones to illuminate life&apos;s grandest milestones.
          </p>
          <Button href="/shop" variant="primary" size="lg">
            Shop The Collection
          </Button>
        </div>
      </div>
    </section>
  );
}
