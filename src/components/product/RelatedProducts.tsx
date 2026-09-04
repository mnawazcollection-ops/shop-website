import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/types";

interface RelatedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export default function RelatedProducts({
  products,
  title = "You May Also Like",
  subtitle = "Related Products",
}: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16 lg:mt-24 pt-12 lg:pt-16 border-t border-[#eee]">
      <div className="text-center mb-10">
        <p className="text-[12px] tracking-[3px] uppercase text-[#C8A165] font-medium mb-2">
          {subtitle}
        </p>
        <h2 className="font-cormorant text-[28px] md:text-[34px] font-bold text-[#1A1A1A]">
          {title}
        </h2>
        <div className="flex justify-center mt-3">
          <div className="w-12 h-[1px] bg-[#C8A165]" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
