"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Package,
} from "lucide-react";
import { useAdminAuth } from "@/store/AdminAuthContext";
import { useAdminToast } from "./AdminToast";

interface AdminHeaderProps {
  onMobileMenuToggle: () => void;
  onOpenSearch: () => void;
}

export default function AdminHeader({ onMobileMenuToggle, onOpenSearch }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdminAuth();
  const { info } = useAdminToast();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Compute breadcrumbs from pathname
  const pathSegments = pathname
    .split("/")
    .filter(Boolean)
    .slice(1); // omit 'admin'

  const notifications = [
    {
      id: "n1",
      title: "New Order Received",
      desc: "Order #SIJ-2026-94812 has been placed",
      time: "10 mins ago",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      id: "n2",
      title: "Low Stock Alert",
      desc: "Diamond Solitaire Ring has only 3 items left",
      time: "1 hour ago",
      icon: AlertTriangle,
      color: "text-amber-600 bg-amber-50",
    },
    {
      id: "n3",
      title: "New Review Waiting",
      desc: "A customer submitted a 5-star review for approval",
      time: "3 hours ago",
      icon: Package,
      color: "text-blue-600 bg-blue-50",
    },
  ];

  const handleLogout = () => {
    logout();
    info("Signed Out", "You have been logged out of the admin console.");
    router.push("/admin/login");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs w-full min-w-0">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb path */}
        <nav className="hidden sm:flex items-center gap-1.5 text-[12px] uppercase tracking-wider font-semibold text-slate-500">
          <Link href="/admin" className="hover:text-amber-700 transition-colors">
            Admin
          </Link>
          {pathSegments.map((segment, idx) => {
            const isLast = idx === pathSegments.length - 1;
            const formatted = segment.replace(/-/g, " ");
            const href = `/admin/${pathSegments.slice(0, idx + 1).join("/")}`;

            return (
              <React.Fragment key={segment}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                {isLast ? (
                  <span className="text-slate-900 font-bold capitalize">{formatted}</span>
                ) : (
                  <Link href={href} className="hover:text-amber-700 transition-colors capitalize">
                    {formatted}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right: Global Search, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 text-[12px] border border-slate-200/70 transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="hidden md:inline">Quick search...</span>
          <kbd className="hidden md:inline-block text-[10px] font-bold bg-white text-slate-400 px-1.5 py-0.5 rounded border border-slate-200">
            Ctrl+K
          </kbd>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <p className="text-[13px] font-bold text-slate-900">Notifications</p>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  3 unread
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className="p-3.5 hover:bg-slate-50/80 transition-colors flex items-start gap-3 cursor-pointer"
                      onClick={() => setIsNotificationsOpen(false)}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-slate-900 leading-snug">{n.title}</p>
                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-2 border-t border-slate-100 text-center">
                <Link
                  href="/admin/orders"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-[11px] uppercase tracking-wider font-bold text-amber-700 hover:text-amber-800"
                >
                  View All Activity →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <span className="w-px h-6 bg-slate-200"></span>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 text-white font-bold flex items-center justify-center text-xs shadow-sm overflow-hidden">
              {user?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name.charAt(0) || "A"
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[12px] font-bold text-slate-900 leading-none truncate max-w-[120px]">
                {user?.name || "Admin"}
              </p>
              <p className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider mt-0.5">
                {user?.role || "Super Admin"}
              </p>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-1.5rem)] bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-[13px] font-bold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                  <ShieldCheck className="w-3 h-3" />
                  {user?.role}
                </span>
              </div>

              <div className="py-1">
                <Link
                  href="/admin/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-[12px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Store Settings
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-2.5 px-4 py-2 text-[12px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Visit Storefront
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[12px] font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
