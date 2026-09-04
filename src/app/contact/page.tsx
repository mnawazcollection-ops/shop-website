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
        <div className="bg-white border border-amber-100/60 p-8 lg:p-10 shadow-lg shadow-amber-500/5 rounded-sm">
          <h2 className="font-cormorant text-2xl font-bold text-[#1A1A1A] mb-6">
            Send Us a Message
          </h2>

          {submitted ? (
            <div className="p-8 text-center bg-gradient-to-b from-emerald-50/80 to-white border border-emerald-500/30 rounded-sm">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto shadow-md shadow-emerald-500/20 font-bold mb-3">
                ✓
              </div>
              <h3 className="font-cormorant text-2xl font-bold text-slate-900 mt-2 mb-2">Thank You</h3>
              <p className="text-slate-600 text-[14px] leading-relaxed max-w-md mx-auto">
                Your message has been received with priority. A master jewelry concierge will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[12px] uppercase tracking-wider text-slate-600 mb-1.5 font-semibold">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className="w-full border border-slate-200 px-4 py-3 text-[14px] rounded-sm focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12px] uppercase tracking-wider text-slate-600 mb-1.5 font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    className="w-full border border-slate-200 px-4 py-3 text-[14px] rounded-sm focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] uppercase tracking-wider text-slate-600 mb-1.5 font-semibold">
                  Subject / Inquiry Type
                </label>
                <select className="w-full border border-slate-200 px-4 py-3 text-[14px] rounded-sm focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 transition-all bg-white">
                  <option>Bespoke Custom Jewelry Consultation</option>
                  <option>Order & Shipping Inquiry</option>
                  <option>Ring Sizing & Care Guidance</option>
                  <option>Other Question</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] uppercase tracking-wider text-slate-600 mb-1.5 font-semibold">
                  Message
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="How can our master artisans assist you?"
                  className="w-full border border-slate-200 px-4 py-3 text-[14px] rounded-sm focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 transition-all"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] hover:from-[#FBBF24] hover:via-[#F59E0B] hover:to-[#D97706] text-white py-4 uppercase text-[12px] tracking-[2px] font-bold rounded-sm shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/35 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                Submit Inquiry
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & Flagship Boutique */}
        <div className="flex flex-col justify-between space-y-8">
          <div className="bg-gradient-to-b from-[#FAF7F4] to-white p-8 lg:p-10 border border-amber-100/70 shadow-sm rounded-sm">
            <h2 className="font-cormorant text-2xl font-bold text-[#1A1A1A] mb-6 flex items-center gap-2">
              <span>Flagship Boutique & Salon</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            </h2>

            <div className="space-y-6 text-[14px] text-slate-600">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 text-base shadow-sm">
                  📍
                </div>
                <div>
                  <strong className="block text-slate-900 font-bold mb-0.5">Address:</strong>
                  123 Luxury Avenue, Diamond District, New York, NY 10036
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-base shadow-sm">
                  📞
                </div>
                <div>
                  <strong className="block text-slate-900 font-bold mb-0.5">Direct Phone:</strong>
                  +1 (234) 567-890 / Toll Free: 1-800-SIR-IHSAN
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-base shadow-sm">
                  ✉️
                </div>
                <div>
                  <strong className="block text-slate-900 font-bold mb-0.5">Email:</strong>
                  concierge@sirhisan.com | support@sirhisan.com
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 text-base shadow-sm">
                  🕒
                </div>
                <div>
                  <strong className="block text-slate-900 font-bold mb-0.5">Operating Hours:</strong>
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
