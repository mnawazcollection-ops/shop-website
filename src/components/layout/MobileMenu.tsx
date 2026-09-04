"use client";

import { useState } from "react";
import Link from "next/link";
import { navItems } from "@/data";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[320px] bg-white z-[70] transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[70px] border-b border-[#f0f0f0]">
          <span className="font-cormorant text-[22px] font-bold tracking-[2px] uppercase">
            Sir Ihsan
          </span>
          <button
            onClick={onClose}
            className="text-[#1A1A1A] hover:text-[#C8A165] transition-colors"
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="py-4 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => (
            <div key={item.label} className="border-b border-[#f5f5f5]">
              <div className="flex items-center justify-between">
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex-1 px-6 py-3.5 text-[14px] font-medium tracking-[1px] uppercase text-[#1A1A1A] hover:text-[#C8A165] transition-colors"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <button
                    onClick={() =>
                      setExpandedItem(
                        expandedItem === item.label ? null : item.label
                      )
                    }
                    className="px-6 py-3.5 text-[#999] hover:text-[#C8A165] transition-colors"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedItem === item.label ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Sub Items */}
              {item.children && expandedItem === item.label && (
                <div className="bg-[#faf8f5] pb-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      onClick={onClose}
                      className="block px-10 py-2.5 text-[13px] text-[#666] hover:text-[#C8A165] transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-[#f0f0f0] px-6 py-4 bg-white">
          <div className="flex items-center justify-center gap-6">
            <Link
              href="/account"
              className="text-[#555] hover:text-[#C8A165] transition-colors"
              aria-label="Account"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>
            <Link
              href="/wishlist"
              className="text-[#555] hover:text-[#C8A165] transition-colors"
              aria-label="Wishlist"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </Link>
            <button
              className="text-[#555] hover:text-[#C8A165] transition-colors"
              aria-label="Search"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
