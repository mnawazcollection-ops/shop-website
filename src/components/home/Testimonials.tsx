"use client";

import { useState } from "react";
import Image from "next/image";
import { testimonials } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-16 lg:py-24 bg-[#FAF7F4]">
      <div className="max-w-[1400px] mx-auto px-6">
        <SectionHeading
          subtitle="Testimonials"
          title="What Customers Say"
        />

        <div className="max-w-3xl mx-auto">
          {/* Active Testimonial */}
          <div className="text-center mb-10">
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: testimonials[activeIndex].rating }).map(
                (_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-[#C8A165]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                )
              )}
            </div>

            {/* Quote */}
            <p className="text-[17px] md:text-[19px] text-[#555] leading-relaxed italic mb-8 font-light">
              &ldquo;{testimonials[activeIndex].content}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden relative">
                <Image
                  src={testimonials[activeIndex].avatar}
                  alt={testimonials[activeIndex].name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="text-left">
                <h4 className="text-[15px] font-semibold text-[#1A1A1A]">
                  {testimonials[activeIndex].name}
                </h4>
                <p className="text-[13px] text-[#999]">
                  {testimonials[activeIndex].role}
                </p>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 h-2 bg-[#C8A165] rounded-full"
                    : "w-2 h-2 bg-[#ddd] rounded-full hover:bg-[#C8A165]"
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
