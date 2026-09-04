import HeroSlider from "@/components/home/HeroSlider";
import FeaturesRow from "@/components/home/FeaturesRow";
import CategoryCards from "@/components/home/CategoryCards";
import TrendingProducts from "@/components/home/TrendingProducts";
import CraftedBanner from "@/components/home/CraftedBanner";
import TrendStyles from "@/components/home/TrendStyles";
import PromoBanner from "@/components/home/PromoBanner";
import Testimonials from "@/components/home/Testimonials";
import BlogSection from "@/components/home/BlogSection";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSlider />
      <FeaturesRow />
      <CategoryCards />
      <TrendingProducts />
      <CraftedBanner />
      <TrendStyles />
      <PromoBanner />
      <Testimonials />
      <BlogSection />
    </div>
  );
}
