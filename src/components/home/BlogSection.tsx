import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";

export default function BlogSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <SectionHeading subtitle="Latest News" title="The Journals" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group"
            >
              {/* Image */}
              <div className="relative overflow-hidden mb-5 aspect-[3/2]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Category Badge */}
                <span className="absolute top-4 left-4 bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] text-white text-[10px] tracking-wider uppercase px-3 py-1 font-bold shadow-md shadow-amber-500/25 rounded-sm">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[12px] text-[#999]">{post.date}</span>
                  <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                  <span className="text-[12px] text-amber-700 font-medium">
                    By {post.author}
                  </span>
                </div>
                <h3 className="font-cormorant text-xl lg:text-[22px] font-semibold text-[#1A1A1A] group-hover:text-amber-600 transition-colors duration-200 mb-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-[14px] text-[#888] leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-[12px] tracking-[1.5px] uppercase text-amber-600 font-bold mt-4 group-hover:gap-3 group-hover:text-amber-700 transition-all duration-300">
                  Read More
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
