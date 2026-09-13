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
      "Yes, every masterwork in our atelier is hallmarked for metal purity (18K, 21K, and 22K solid gold) and accompanied by official GIA and IGI laboratory certificates confirming 100% natural, ethically sourced diamonds.",
  },
  {
    question: "Do you deliver jewelry across Pakistan and internationally?",
    answer:
      "Yes, we provide fully insured, tamper-evident armored courier delivery across all cities in Pakistan (including Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, and Peshawar) as well as worldwide delivery.",
  },
  {
    question: "Can I pay Cash on Delivery (COD) for fine jewelry in Pakistan?",
    answer:
      "Yes, we offer Cash on Delivery (COD) and private vault VIP delivery across major metropolitan centers in Pakistan, in addition to direct bank wire transfers and major debit/credit cards.",
  },
  {
    question: "Where is the M. Nawaz Jewelry Collection flagship atelier located?",
    answer:
      "Our flagship bridal salon and atelier is situated on M. M. Alam Road, Gulberg III, Lahore, Pakistan, welcoming clients Monday through Saturday for bespoke appointments.",
  },
  {
    question: "Do you offer custom made bridal jewelry and solitaire engagement rings?",
    answer:
      "Absolutely. Our master goldsmiths specialize in bespoke engagement rings, custom heirloom bridal suites, gemstone sourcing, and personalized hallmark engravings.",
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
