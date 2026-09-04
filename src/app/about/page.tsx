import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import FeaturesRow from "@/components/home/FeaturesRow";

export default function AboutPage() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[380px] md:h-[450px] bg-[#1A1A1A] flex items-center justify-center text-center px-6">
        <div className="max-w-2xl text-white">
          <p className="text-[12px] uppercase tracking-[4px] text-[#C8A165] font-semibold mb-3">
            Since 2001
          </p>
          <h1 className="font-cormorant text-4xl md:text-6xl font-bold mb-4">
            The Art of Sir Ihsan
          </h1>
          <p className="text-white/70 text-[16px] leading-relaxed max-w-lg mx-auto">
            A heritage forged in devotion, uncompromising craftsmanship, and an enduring passion for fine jewelry.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <SectionHeading
              align="left"
              subtitle="Our Heritage"
              title="A Legacy of Handcrafted Brilliance"
            />
            <p className="text-[#666] leading-relaxed text-[15px] mb-6">
              Founded over two decades ago, Sir Ihsan began with a simple yet ambitious vision: to create heirloom jewelry that captures the sacred beauty of life’s most meaningful milestones.
            </p>
            <p className="text-[#666] leading-relaxed text-[15px] mb-6">
              Every ring, pendant, and bracelet begins its journey at the hands of master goldsmiths. From ethically sourced diamonds to 100% certified pure gold alloys, we refuse to compromise on quality or integrity.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#f0f0f0]">
              <div>
                <span className="font-cormorant text-3xl font-bold text-[#C8A165]">25+</span>
                <p className="text-[12px] uppercase tracking-wider text-[#888] mt-1">Years Mastery</p>
              </div>
              <div>
                <span className="font-cormorant text-3xl font-bold text-[#C8A165]">100%</span>
                <p className="text-[12px] uppercase tracking-wider text-[#888] mt-1">Conflict-Free</p>
              </div>
              <div>
                <span className="font-cormorant text-3xl font-bold text-[#C8A165]">10k+</span>
                <p className="text-[12px] uppercase tracking-wider text-[#888] mt-1">Bespoke Pieces</p>
              </div>
            </div>
          </div>

          <div className="relative h-[480px] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1600721391776-b5cd0e0048f9?w=900&h=800&fit=crop"
              alt="Crafting jewelry"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <FeaturesRow />
    </div>
  );
}
