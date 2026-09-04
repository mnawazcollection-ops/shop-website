"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Package, FolderTree, ShoppingBag, Users, Settings, Tag, X, ArrowRight } from "lucide-react";
import { useAdminData } from "@/store/AdminDataContext";

interface AdminGlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminGlobalSearch({ isOpen, onClose }: AdminGlobalSearchProps) {
  const router = useRouter();
  const { products, categories, orders, customers } = useAdminData();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose(); // toggle if already open or handled outside
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matchedProducts = products
      .filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
      .slice(0, 4)
      .map((p) => ({
        id: p.id,
        title: p.name,
        subtitle: `${p.sku} • $${p.price} • ${p.category}`,
        type: "Product",
        icon: Package,
        href: `/admin/products/${p.id}/edit`,
      }));

    const matchedOrders = orders
      .filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map((o) => ({
        id: o.id,
        title: o.orderNumber,
        subtitle: `${o.customer.name} • $${o.total} • ${o.orderStatus.toUpperCase()}`,
        type: "Order",
        icon: ShoppingBag,
        href: `/admin/orders/${o.id}`,
      }));

    const matchedCustomers = customers
      .filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
      .slice(0, 3)
      .map((c) => ({
        id: c.id,
        title: c.name,
        subtitle: `${c.email} • ${c.tier} • ${c.totalOrders} Orders`,
        type: "Customer",
        icon: Users,
        href: `/admin/customers/${c.id}`,
      }));

    const matchedCategories = categories
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 2)
      .map((c) => ({
        id: c.id,
        title: c.name,
        subtitle: `${c.productCount} Products`,
        type: "Category",
        icon: FolderTree,
        href: `/admin/categories`,
      }));

    return [...matchedProducts, ...matchedOrders, ...matchedCustomers, ...matchedCategories];
  }, [query, products, orders, customers, categories]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9995] flex items-start justify-center p-4 sm:p-6 md:p-20 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, orders, clients, categories... (Esc to exit)"
            className="flex-1 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            ESC
          </span>
        </div>

        {/* Results Body */}
        <div className="max-h-[380px] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="p-6 text-center text-slate-400 text-[13px]">
              <p className="font-semibold text-slate-700">Quick Navigation</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                {[
                  { label: "Products", href: "/admin/products", icon: Package },
                  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
                  { label: "Inventory", href: "/admin/inventory", icon: Tag },
                  { label: "Clients", href: "/admin/customers", icon: Users },
                  { label: "Settings", href: "/admin/settings", icon: Settings },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      router.push(item.href);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800 text-[12px] font-medium text-slate-600 transition-all cursor-pointer"
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-[13px]">
              No results found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((r) => {
                const Icon = r.icon;
                return (
                  <div
                    key={`${r.type}-${r.id}`}
                    onClick={() => {
                      router.push(r.href);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100/80 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-md bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-slate-900 truncate group-hover:text-amber-700">
                          {r.title}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{r.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {r.type}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
