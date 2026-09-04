"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

const slides = [
  {
    image: "/images/banners/hero-banner.jpg",
    subtitle: "New Collection 2026",
    title: "Charm For\nYour Everyday",
    description: "Discover exquisite handcrafted jewelry that celebrates your unique style",
    cta: "Shop Now",
    href: "/shop",
  },
  {
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1920&h=900&fit=crop",
    subtitle: "Exclusive Designs",
    title: "Elegance In\nEvery Detail",
    description: "Timeless pieces crafted with the finest precious metals and gemstones",
    cta: "Explore Collection",
    href: "/collections",
  },
  {
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1920&h=900&fit=crop",
    subtitle: "Bridal Collection",
    title: "Love Starts\nWith Gold",
    description: "Find the perfect symbol of your eternal commitment",
    cta: "View Bridal",
    href: "/collections/bridal",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((currentSlide + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] xl:h-[80vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className={`object-cover transition-transform duration-[8000ms] ${
              index === currentSlide ? "scale-110" : "scale-100"
            }`}
            priority={index === 0}
            sizes="100vw"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="max-w-[1400px] mx-auto px-6 w-full">
          <div className="max-w-xl">
            <p
              className={`text-[12px] md:text-[13px] tracking-[4px] uppercase text-[#C8A165] mb-4 font-medium transition-all duration-700 ${
                !isTransitioning
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              {slides[currentSlide].subtitle}
            </p>
            <h2
              className={`font-cormorant text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-5 whitespace-pre-line transition-all duration-700 ${
                !isTransitioning
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              {slides[currentSlide].title}
            </h2>
            <p
              className={`text-[15px] md:text-[16px] text-white/80 mb-8 max-w-md leading-relaxed transition-all duration-700 ${
                !isTransitioning
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              {slides[currentSlide].description}
            </p>
            <div
              className={`transition-all duration-700 ${
                !isTransitioning
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "800ms" }}
            >
              <Button
                href={slides[currentSlide].href}
                variant="primary"
                size="lg"
              >
                {slides[currentSlide].cta}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? "w-8 h-2 bg-[#C8A165] rounded-full"
                : "w-2 h-2 bg-white/50 rounded-full hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() =>
          goToSlide(
            currentSlide === 0 ? slides.length - 1 : currentSlide - 1
          )
        }
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/30 flex items-center justify-center text-white hover:bg-[#C8A165] hover:border-[#C8A165] transition-all duration-300 hidden md:flex"
        aria-label="Previous slide"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/30 flex items-center justify-center text-white hover:bg-[#C8A165] hover:border-[#C8A165] transition-all duration-300 hidden md:flex"
        aria-label="Next slide"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </section>
  );
}
