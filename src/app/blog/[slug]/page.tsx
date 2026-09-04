import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data";
import Button from "@/components/ui/Button";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
        <h1 className="font-cormorant text-3xl font-bold mb-4">Article Not Found</h1>
        <Button href="/blog" variant="primary">Return to Journals</Button>
      </div>
    );
  }

  return (
    <article className="max-w-[900px] mx-auto px-6 py-12">
      <nav className="text-[13px] text-[#888] mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-[#C8A165]">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-[#C8A165]">Journals</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">{post.title}</span>
      </nav>

      <span className="text-[12px] uppercase tracking-[3px] text-[#C8A165] font-semibold">
        {post.category}
      </span>
      <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-[#1A1A1A] mt-2 mb-4 leading-tight">
        {post.title}
      </h1>

      <div className="flex items-center gap-4 text-[13px] text-[#888] pb-6 border-b border-[#f0f0f0] mb-8">
        <span>By {post.author}</span>
        <span>•</span>
        <span>Published on {post.date}</span>
      </div>

      <div className="relative aspect-[16/9] mb-10 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="text-[#444] leading-relaxed text-[16px] space-y-6 font-light">
        <p className="text-lg leading-relaxed text-[#222] font-normal italic">
          &ldquo;{post.excerpt}&rdquo;
        </p>
        <p>
          Fine jewelry has always occupied a rare intersection between exquisite artistic expression and permanent material value. Selecting or maintaining jewelry requires understanding the delicate interplay between precious carats, metals, cut geometries, and master settings.
        </p>
        <p>
          Whether considering 18K solid yellow gold, rose gold nuances, or certified brilliant-cut solitaires, the key lies in balance and provenance. At Sir Ihsan, every piece is sculpted to tell an enduring personal story.
        </p>
      </div>

      <div className="mt-12 pt-8 border-t border-[#f0f0f0]">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[13px] uppercase tracking-wider text-[#1A1A1A] hover:text-[#C8A165] font-semibold"
        >
          ← Back to All Articles
        </Link>
      </div>
    </article>
  );
}
