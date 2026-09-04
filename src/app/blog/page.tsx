import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { blogPosts } from "@/data";

export default function BlogPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <SectionHeading
        subtitle="Insights & Stories"
        title="The Jewelry Journals"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="group bg-white border border-[#f0f0f0] overflow-hidden flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 bg-[#C8A165] text-white text-[11px] uppercase tracking-wider px-3 py-1 font-semibold">
                {post.category}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-[12px] text-[#999] mb-3">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>
                <h2 className="font-cormorant text-2xl font-bold text-[#1A1A1A] group-hover:text-[#C8A165] transition-colors mb-3 leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-[#666] text-[14px] leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-widest text-[#C8A165] font-bold"
              >
                Read Article →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
