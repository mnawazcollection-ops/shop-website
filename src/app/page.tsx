import HeroSlider from "@/components/home/HeroSlider";
import FeaturesRow from "@/components/home/FeaturesRow";
import CategoryCards from "@/components/home/CategoryCards";
import TrendingProducts from "@/components/home/TrendingProducts";
import CraftedBanner from "@/components/home/CraftedBanner";
import TrendStyles from "@/components/home/TrendStyles";
import PromoBanner from "@/components/home/PromoBanner";
import Testimonials from "@/components/home/Testimonials";
import BlogSection from "@/components/home/BlogSection";
import JsonLd from "@/components/seo/JsonLd";
import { getFaqSchema } from "@/lib/seo";

const HOME_FAQS = [
  {
    question: "Does M. Nawaz Jewelry Collection provide certified pure gold and natural diamonds?",
    answer:
      "Yes, every jewelry piece is stamped for gold purity (18K, 21K, and 22K solid gold) and comes with official certificate confirming 100% natural, certified diamonds.",
  },
  {
    question: "Do you deliver jewelry across Pakistan and internationally?",
    answer:
      "Yes, we provide safe and insured courier delivery across all cities in Pakistan (including Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, and Peshawar) as well as worldwide delivery.",
  },
  {
    question: "Can I pay Cash on Delivery (COD) for fine jewelry in Pakistan?",
    answer:
      "Yes, we offer Cash on Delivery (COD) across Pakistan, in addition to direct bank transfer and credit/debit cards.",
  },
  {
    question: "Where is the M. Nawaz Jewelry Collection flagship showroom located?",
    answer:
      "Our main showroom is located on M. M. Alam Road, Gulberg III, Lahore, Pakistan, open Monday through Saturday for visits and appointments.",
  },
  {
    question: "Do you offer custom made bridal jewelry and engagement rings?",
    answer:
      "Yes, our jewelers specialize in custom engagement rings, complete bridal sets, gemstone selection, and personalized engravings.",
  },
];

export default function Home() {
  const faqSchema = getFaqSchema(HOME_FAQS);

  return (
    <div className="flex flex-col w-full">
      <JsonLd data={faqSchema} />
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
