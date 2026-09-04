"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <SectionHeading
        subtitle="Concierge Support"
        title="Get in Touch with Our Specialists"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-12">
        {/* Contact Form */}
        <div className="bg-white border border-[#f0f0f0] p-8 lg:p-10 shadow-sm">
          <h2 className="font-cormorant text-2xl font-bold text-[#1A1A1A] mb-6">
            Send Us a Message
          </h2>

          {submitted ? (
            <div className="p-8 text-center bg-[#faf8f5] border border-[#C8A165]/30">
              <span className="text-3xl text-[#C8A165]">✓</span>
              <h3 className="font-cormorant text-2xl font-bold mt-3 mb-2">Thank You</h3>
              <p className="text-[#666] text-[14px]">
                Your message has been received. A jewelry consultant will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[12px] uppercase tracking-wider text-[#666] mb-1.5 font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className="w-full border border-[#ddd] px-4 py-3 text-[14px] focus:outline-none focus:border-[#C8A165]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] uppercase tracking-wider text-[#666] mb-1.5 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    className="w-full border border-[#ddd] px-4 py-3 text-[14px] focus:outline-none focus:border-[#C8A165]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] uppercase tracking-wider text-[#666] mb-1.5 font-medium">
                  Subject / Inquiry Type
                </label>
                <select className="w-full border border-[#ddd] px-4 py-3 text-[14px] focus:outline-none focus:border-[#C8A165]">
                  <option>Bespoke Custom Jewelry Consultation</option>
                  <option>Order & Shipping Inquiry</option>
                  <option>Ring Sizing & Care Guidance</option>
                  <option>Other Question</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] uppercase tracking-wider text-[#666] mb-1.5 font-medium">
                  Message
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="How can we assist you?"
                  className="w-full border border-[#ddd] px-4 py-3 text-[14px] focus:outline-none focus:border-[#C8A165]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1A1A1A] hover:bg-[#C8A165] text-white py-4 uppercase text-[12px] tracking-[2px] font-semibold transition-colors duration-300"
              >
                Submit Inquiry
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & Flagship Boutique */}
        <div className="flex flex-col justify-between space-y-8">
          <div className="bg-[#FAF7F4] p-8 lg:p-10 border border-[#f0ece5]">
            <h2 className="font-cormorant text-2xl font-bold text-[#1A1A1A] mb-6">
              Flagship Boutique & Salon
            </h2>

            <div className="space-y-6 text-[14px] text-[#555]">
              <div className="flex items-start gap-4">
                <span className="text-[#C8A165] text-lg">📍</span>
                <div>
                  <strong className="block text-[#1A1A1A]">Address:</strong>
                  123 Luxury Avenue, Diamond District, New York, NY 10036
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-[#C8A165] text-lg">📞</span>
                <div>
                  <strong className="block text-[#1A1A1A]">Direct Phone:</strong>
                  +1 (234) 567-890 / Toll Free: 1-800-SIR-IHSAN
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-[#C8A165] text-lg">✉️</span>
                <div>
                  <strong className="block text-[#1A1A1A]">Email:</strong>
                  concierge@sirhisan.com | support@sirhisan.com
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-[#C8A165] text-lg">🕒</span>
                <div>
                  <strong className="block text-[#1A1A1A]">Operating Hours:</strong>
                  Monday – Saturday: 10:00 AM – 8:00 PM EST<br />
                  Sunday: Private Appointments Only
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
