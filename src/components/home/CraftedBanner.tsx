import Image from "next/image";
import Button from "@/components/ui/Button";

export default function CraftedBanner() {
  return (
    <section className="py-0">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left — Image */}
        <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
          <Image
            src="https://images.unsplash.com/photo-1600721391776-b5cd0e0048f9?w=900&h=600&fit=crop"
            alt="Handcrafted luxury jewelry"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Right — Content */}
        <div className="bg-[#1A1A1A] flex items-center justify-center p-10 lg:p-16 xl:p-20">
          <div className="max-w-md">
            <p className="text-[12px] tracking-[4px] uppercase text-amber-400 mb-4 font-bold">
              Handcrafted Excellence
            </p>
            <h2 className="font-cormorant text-3xl md:text-4xl lg:text-[42px] font-semibold text-white leading-tight mb-6">
              Crafts Handcrafted Luxury Pieces
            </h2>
            <p className="text-[15px] text-white/60 leading-relaxed mb-8">
              Every piece in our collection is meticulously handcrafted by master
              artisans, combining traditional techniques with modern design
              sensibilities. We use only the finest materials to create jewelry
              that stands the test of time.
            </p>
            <div className="flex flex-wrap gap-8 mb-10">
              <div>
                <span className="font-cormorant text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 drop-shadow-sm">
                  25+
                </span>
                <p className="text-[12px] text-white/70 uppercase tracking-wider mt-1">
                  Years Experience
                </p>
              </div>
              <div>
                <span className="font-cormorant text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 drop-shadow-sm">
                  5K+
                </span>
                <p className="text-[12px] text-white/70 uppercase tracking-wider mt-1">
                  Happy Clients
                </p>
              </div>
              <div>
                <span className="font-cormorant text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 drop-shadow-sm">
                  100%
                </span>
                <p className="text-[12px] text-white/70 uppercase tracking-wider mt-1">
                  Certified Solid Gold
                </p>
              </div>
            </div>
            <Button href="/about" variant="outline" size="md">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
