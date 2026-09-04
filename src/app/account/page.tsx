"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <SectionHeading
        subtitle="VIP Client Portal"
        title={isLogin ? "Welcome Back" : "Create an Account"}
      />

      <div className="max-w-md mx-auto bg-white border border-[#f0f0f0] p-8 lg:p-10 shadow-sm mt-8">
        <div className="flex border-b border-[#f0f0f0] mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 pb-3 text-center text-[13px] uppercase tracking-wider font-semibold border-b-2 transition-all ${
              isLogin
                ? "border-[#C8A165] text-[#1A1A1A]"
                : "border-transparent text-[#999]"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 pb-3 text-center text-[13px] uppercase tracking-wider font-semibold border-b-2 transition-all ${
              !isLogin
                ? "border-[#C8A165] text-[#1A1A1A]"
                : "border-transparent text-[#999]"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); alert("Logged in successfully!"); }} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-[12px] uppercase tracking-wider text-[#666] mb-1 font-medium">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full border border-[#ddd] px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#C8A165]"
                placeholder="Jane Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-[12px] uppercase tracking-wider text-[#666] mb-1 font-medium">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full border border-[#ddd] px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#C8A165]"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label className="block text-[12px] uppercase tracking-wider text-[#666] mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full border border-[#ddd] px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#C8A165]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1A1A1A] hover:bg-[#C8A165] text-white py-3.5 uppercase text-[12px] tracking-[2px] font-semibold transition-colors duration-300 mt-6"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
