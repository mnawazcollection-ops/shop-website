"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  ShoppingBag,
  Users,
  Tag,
  Layers,
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAdminData } from "@/store/AdminDataContext";

interface AdminSidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export default function AdminSidebar({
  isMobileOpen,
  onMobileClose,
  isCollapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { orders, products } = useAdminData();

  const pendingOrdersCount = orders.filter((o) => o.orderStatus === "pending").length;
  const lowStockCount = products.filter((p) => p.stock <= p.lowStockThreshold).length;

  const navGroups: NavGroup[] = [
    {
      label: "Overview",
      items: [
        {
          label: "Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
          exact: true,
        },
      ],
    },
    {
      label: "Catalog Management",
      items: [
        {
          label: "Products",
          href: "/admin/products",
          icon: Package,
          badge: products.length.toString(),
        },
        {
          label: "Categories",
          href: "/admin/categories",
          icon: FolderTree,
        },
        {
          label: "Inventory Control",
          href: "/admin/inventory",
          icon: Boxes,
          badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
          badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        },
      ],
    },
    {
      label: "Sales & Clients",
      items: [
        {
          label: "Orders",
          href: "/admin/orders",
          icon: ShoppingBag,
          badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} New` : undefined,
          badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        },
        {
          label: "Clients & VIPs",
          href: "/admin/customers",
          icon: Users,
        },
        {
          label: "Coupons & Offers",
          href: "/admin/coupons",
          icon: Tag,
        },
      ],
    },
    {
      label: "Storefront CMS",
      items: [
        {
          label: "Banners & Content",
          href: "/admin/content",
          icon: Layers,
        },
        {
          label: "Client Reviews",
          href: "/admin/reviews",
          icon: Star,
        },
      ],
    },
    {
      label: "Administration",
      items: [
        {
          label: "Settings",
          href: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 shrink-0">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden group">
          <div className="relative w-9 h-9 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/15 border border-amber-400/30 overflow-hidden">
            <Image
              src="/images/logo.png"
              alt="Sir Ihsan Admin"
              fill
              className="object-contain p-0.5"
              priority
            />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h2 className="font-cormorant text-xl font-bold tracking-[2px] uppercase text-white truncate leading-none">
                Sir Ihsan
              </h2>
              <p className="text-[10px] tracking-[1.5px] uppercase font-semibold text-amber-500/90 mt-1">
                Atelier Admin
              </p>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden text-slate-400 hover:text-white p-1"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-[10px] uppercase font-bold tracking-[1.5px] text-slate-500 mb-2">
                {group.label}
              </p>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all group ${
                    isActive
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-amber-400" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="flex-1 truncate tracking-wide">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.badgeColor || "bg-slate-800 text-slate-300 border-slate-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Footer Action */}
      <div className="p-3 border-t border-slate-800/80 shrink-0 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 text-[12px] text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-800"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="truncate">View Public Storefront</span>}
        </Link>

        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex w-full items-center justify-center gap-2 py-2 text-[11px] uppercase tracking-wider font-semibold text-slate-500 hover:text-slate-300 hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-800"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onMobileClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl animate-in slide-in-from-left duration-250">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
