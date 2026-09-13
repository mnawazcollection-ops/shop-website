"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  AlertTriangle,
  Plus,
  Minus,
  Check,
  ArrowRight,
} from "lucide-react";
import { useAdminData } from "@/store/AdminDataContext";
import { useAdminToast } from "@/components/admin/AdminToast";

export default function InventoryPage() {
  const { products, updateStock, quickStockAdjust } = useAdminData();
  const { addToast } = useAdminToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState<"all" | "low" | "out" | "normal">("all");

  // Local draft states for inline stock changes before saving
  const [editingStocks, setEditingStocks] = useState<Record<string, number>>({});

  // Filtered products
  const inventoryItems = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const isLow = p.stock > 0 && p.stock <= p.lowStockThreshold;
      const isOut = p.stock === 0;
      const isNormal = p.stock > p.lowStockThreshold;

      if (filterLevel === "low") return matchesSearch && isLow;
      if (filterLevel === "out") return matchesSearch && isOut;
      if (filterLevel === "normal") return matchesSearch && isNormal;
      return matchesSearch;
    });
  }, [products, searchQuery, filterLevel]);

  // Urgent counts
  const lowCount = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outCount = products.filter((p) => p.stock === 0).length;
  const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);

  const handleStockInputChange = (productId: string, val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    setEditingStocks((prev) => ({ ...prev, [productId]: num }));
  };

  const handleQuickAdjust = (productId: string, delta: number) => {
    quickStockAdjust(productId, delta);
    addToast({
      title: "Stock Changed",
      message: `Changed stock by ${delta > 0 ? `+${delta}` : delta} item(s).`,
      type: "info",
    });
  };

  const handleSaveStock = (productId: string) => {
    if (editingStocks[productId] !== undefined) {
      updateStock(productId, editingStocks[productId]);
      const copy = { ...editingStocks };
      delete copy[productId];
      setEditingStocks(copy);
      addToast({
        title: "Stock Saved",
        message: "Product stock updated successfully.",
        type: "success",
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Stock Levels</h1>
          <p className="text-sm text-stone-500">
            Check and update how many items you have in stock.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Top Warning Banner if any critical low-stocks */}
      {(lowCount > 0 || outCount > 0) && (
        <div className="bg-amber-50/90 border border-amber-300/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-200/80 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <p className="font-bold text-stone-900">
                Warning: {lowCount + outCount} items need to be restocked
              </p>
              <p className="text-stone-600 mt-0.5">
                {outCount} items are completely out of stock; {lowCount} items are running low.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterLevel("low")}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg"
            >
              Low Stock ({lowCount})
            </button>
            <button
              onClick={() => setFilterLevel("out")}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
            >
              Out of Stock ({outCount})
            </button>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Total Items in Stock</span>
          <p className="text-xl font-bold text-stone-900 mt-1">{totalUnits} items</p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Total Products</span>
          <p className="text-xl font-bold text-stone-900 mt-1">{products.length} products</p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-xs text-amber-700 font-medium">Low Stock Warning</span>
          <p className="text-xl font-bold text-amber-600 mt-1">{lowCount} items</p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-xs text-red-700 font-medium">Out of Stock (0 Items)</span>
          <p className="text-xl font-bold text-red-600 mt-1">{outCount} items</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name or code..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterLevel("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterLevel === "all"
                ? "bg-stone-900 text-white"
                : "border border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setFilterLevel("low")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterLevel === "low"
                ? "bg-amber-600 text-white"
                : "border border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
          >
            Low Stock ({lowCount})
          </button>
          <button
            onClick={() => setFilterLevel("out")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterLevel === "out"
                ? "bg-red-600 text-white"
                : "border border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
          >
            Out of Stock ({outCount})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/80 text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Code / SKU</th>
                <th className="py-3 px-4 text-center">Alert Below</th>
                <th className="py-3 px-4 text-center">In Stock</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4">Quick +/-</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {inventoryItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-stone-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                inventoryItems.map((p) => {
                  const isLow = p.stock > 0 && p.stock <= p.lowStockThreshold;
                  const isOut = p.stock === 0;
                  const currentDraft = editingStocks[p.id] !== undefined ? editingStocks[p.id] : p.stock;
                  const isDirty = editingStocks[p.id] !== undefined && editingStocks[p.id] !== p.stock;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-stone-50/70 transition-colors ${
                        isOut ? "bg-red-50/20" : isLow ? "bg-amber-50/20" : ""
                      }`}
                    >
                      {/* Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                            <Image src={p.image} alt={p.name} fill className="object-cover" unoptimized />
                          </div>
                          <div>
                            <Link
                              href={`/admin/products/${p.id}/edit`}
                              className="font-medium text-stone-900 hover:text-amber-600 transition-colors block line-clamp-1"
                            >
                              {p.name}
                            </Link>
                            <span className="text-xs text-stone-400">{p.category}</span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-stone-600 uppercase">
                        {p.sku}
                      </td>

                      {/* Threshold */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs text-stone-500">
                        {p.lowStockThreshold} items
                      </td>

                      {/* Stock Input & Stepper */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={currentDraft}
                            onChange={(e) => handleStockInputChange(p.id, e.target.value)}
                            className={`w-16 px-2 py-1 text-center font-bold font-mono text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                              isDirty
                                ? "border-amber-500 bg-amber-50/40 text-amber-900"
                                : isOut
                                ? "border-red-300 text-red-700 bg-red-50/30"
                                : isLow
                                ? "border-amber-300 text-amber-700 bg-amber-50/30"
                                : "border-stone-200 text-stone-800 bg-stone-50"
                            }`}
                          />
                          {isDirty && (
                            <button
                              onClick={() => handleSaveStock(p.id)}
                              className="p-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold"
                              title="Save Stock"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-bold">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                            In Stock
                          </span>
                        )}
                      </td>

                      {/* Quick Adjust Buttons */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleQuickAdjust(p.id, -1)}
                            disabled={p.stock <= 0}
                            className="p-1 border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 rounded text-xs disabled:opacity-30"
                            title="Decrease 1"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(p.id, 1)}
                            className="p-1 border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 rounded text-xs"
                            title="Increase 1"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(p.id, 5)}
                            className="px-2 py-0.5 border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 rounded text-[11px] font-bold"
                            title="Add 5"
                          >
                            +5
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-amber-600"
                        >
                          Edit Product <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
