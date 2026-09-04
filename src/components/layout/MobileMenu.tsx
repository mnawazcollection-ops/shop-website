"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/data";
import { useCart, useWishlist, useSearch } from "@/store/StoreContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { cartCount, setCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { setSearchOpen } = useSearch();

  const handleOpenSearch = () => {
    onClose();
    setSearchOpen(true);
  };

  const handleOpenCart = () => {
    onClose();
    setCartOpen(true);
  };

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
        className={`fixed top-0 left-0 h-full w-[320px] max-w-[85vw] bg-white z-[70] flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[70px] border-b border-[#f0f0f0] shrink-0">
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 shrink-0">
              <Image
                src="/images/logo.png"
                alt="Sir Ihsan Jewelry Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-cormorant text-[22px] font-bold tracking-[2px] uppercase text-[#1A1A1A]">
              Sir Ihsan
            </span>
          </Link>
          <button
            onClick={onClose}
            className="text-[#1A1A1A] hover:text-amber-600 transition-colors p-1"
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

        {/* Quick Search Bar in Menu */}
        <div className="p-4 border-b border-[#f5f5f5] shrink-0">
          <button
            onClick={handleOpenSearch}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-[#FAF7F4] border border-[#eee] text-[#888] text-[13px] hover:border-amber-500 hover:text-amber-600 transition-colors rounded-sm"
          >
            <span>Search jewelry...</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.label} className="border-b border-[#f5f5f5]">
              <div className="flex items-center justify-between">
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex-1 px-6 py-3.5 text-[14px] font-medium tracking-[1px] uppercase text-[#1A1A1A] hover:text-amber-600 transition-colors"
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
                    className="px-6 py-3.5 text-[#999] hover:text-amber-600 transition-colors"
                    aria-label="Expand submenu"
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
                      className="block px-10 py-2.5 text-[13px] text-[#666] hover:text-amber-600 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Additional mobile links */}
          <div className="px-6 py-4 space-y-2 text-[13px] text-[#666]">
            <Link
              href="/checkout"
              onClick={onClose}
              className="block py-1 hover:text-amber-600 uppercase tracking-wider text-[12px] font-semibold"
            >
              Express Checkout
            </Link>
            <div className="pt-2 border-t border-[#f0f0f0] text-[12px] text-[#888] space-y-1">
              <p>📞 +1 (234) 567-890</p>
              <p>✉️ concierge@sirihsan.com</p>
            </div>
          </div>
        </nav>

        {/* Bottom Actions Bar */}
        <div className="border-t border-[#f0f0f0] px-6 py-4 bg-white shrink-0">
          <div className="flex items-center justify-around">
            <Link
              href="/account"
              onClick={onClose}
              className="text-[#555] hover:text-amber-600 transition-colors p-2"
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
              onClick={onClose}
              className="text-[#555] hover:text-amber-600 transition-colors p-2 relative"
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
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 min-w-[16px] h-[16px] bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-md shadow-amber-500/40">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={handleOpenCart}
              className="text-[#555] hover:text-[#D97706] transition-colors p-2 relative"
              aria-label="Cart"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 min-w-[16px] h-[16px] bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-md shadow-amber-500/40">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

