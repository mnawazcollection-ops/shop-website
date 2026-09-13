"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit3,
  Copy,
  Trash2,
  Star,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Cloud,
  RefreshCw,
} from "lucide-react";
import { useAdminData } from "@/store/AdminDataContext";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminToast } from "@/components/admin/AdminToast";
import { AdminProduct } from "@/types/admin";
import { formatPrice } from "@/lib/currency";

export default function ProductsPage() {
  const {
    products,
    categories,
    deleteProduct,
    duplicateProduct,
    updateProduct,
    bulkDeleteProducts,
    bulkUpdateProductStatus,
    syncCatalogToCloud,
  } = useAdminData();
  const { addToast } = useAdminToast();
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedStock, setSelectedStock] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "stock-asc">("newest");

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Dialog State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        const matchesQuery =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());

        // Category filter
        const matchesCat = selectedCategory === "all" || p.category.toLowerCase() === selectedCategory.toLowerCase();

        // Status filter
        const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;

        // Stock filter
        let matchesStock = true;
        if (selectedStock === "in-stock") matchesStock = p.stock > p.lowStockThreshold;
        if (selectedStock === "low-stock") matchesStock = p.stock > 0 && p.stock <= p.lowStockThreshold;
        if (selectedStock === "out-of-stock") matchesStock = p.stock === 0;

        return matchesQuery && matchesCat && matchesStatus && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "stock-asc") return a.stock - b.stock;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, searchQuery, selectedCategory, selectedStatus, selectedStock, sortBy]);

  // Paginated Slices
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Bulk Selection Handlers
  const isAllSelected =
    paginatedProducts.length > 0 && paginatedProducts.every((p) => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(selectedIds.filter((id) => !paginatedProducts.some((p) => p.id === id)));
    } else {
      const pageIds = paginatedProducts.map((p) => p.id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Actions
  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteProduct(deleteId);
      setSelectedIds(selectedIds.filter((i) => i !== deleteId));
      setDeleteId(null);
      addToast({
        title: "Masterwork Removed",
        message: "The product was successfully removed from your catalog.",
        type: "info",
      });
    }
  };

  const handleBulkDeleteConfirm = () => {
    bulkDeleteProducts(selectedIds);
    addToast({
      title: "Bulk Deletion Complete",
      message: `${selectedIds.length} products were removed.`,
      type: "info",
    });
    setSelectedIds([]);
    setIsBulkDeleteDialogOpen(false);
  };

  const handleBulkStatusChange = (status: "active" | "draft" | "archived") => {
    bulkUpdateProductStatus(selectedIds, status);
    addToast({
      title: "Status Updated",
      message: `${selectedIds.length} products marked as ${status}.`,
      type: "success",
    });
    setSelectedIds([]);
  };

  const handleDuplicate = (id: string) => {
    const dupe = duplicateProduct(id);
    if (dupe) {
      addToast({
        title: "Product Duplicated",
        message: `Created duplicate "${dupe.name}".`,
        type: "success",
      });
    }
  };

  const toggleFeatured = (product: AdminProduct) => {
    updateProduct(product.id, { isFeatured: !product.isFeatured });
    addToast({
      title: "Featured Status Changed",
      message: `"${product.name}" ${!product.isFeatured ? "is now featured on homepage" : "removed from featured"}.`,
      type: "info",
    });
  };

  // CSV Export Helper
  const exportCSV = () => {
    const headers = ["ID", "Name", "SKU", "Category", "Price", "Stock", "Status"];
    const rows = filteredProducts.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      p.category,
      p.price,
      p.stock,
      p.status,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sir_ihsan_products_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({
      title: "CSV Exported",
      message: `Exported ${filteredProducts.length} items to CSV.`,
      type: "success",
    });
  };

  const handleCloudSync = async () => {
    setIsSyncingCloud(true);
    addToast({
      title: "Cloud Sync Initiated",
      message: "Syncing images to Cloudinary and catalog to Firebase Firestore...",
      type: "info",
    });

    const result = await syncCatalogToCloud();
    setIsSyncingCloud(false);

    if (result.success) {
      addToast({
        title: "Cloud Sync Complete",
        message: `All ${result.count} jewelry pieces synced with Firebase Firestore & Cloudinary CDN.`,
        type: "success",
      });
    } else {
      addToast({
        title: "Cloud Sync Warning",
        message: result.error || "Failed to complete full cloud sync.",
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Fine Jewelry Catalog</h1>
          <p className="text-sm text-stone-500">
            Manage your high-jewelry inventory, pricing, precious metal variants, and visibility.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <button
            onClick={handleCloudSync}
            disabled={isSyncingCloud}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 border border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-amber-900 text-sm font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50"
            title="Sync all products and images to Cloudinary & Firebase Firestore"
          >
            {isSyncingCloud ? (
              <RefreshCw className="w-4 h-4 text-amber-700 animate-spin" />
            ) : (
              <Cloud className="w-4 h-4 text-amber-700" />
            )}
            <span>{isSyncingCloud ? "Syncing..." : "Sync to Cloud"}</span>
          </button>

          <button
            onClick={exportCSV}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-sm font-medium rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-stone-500" />
            Export CSV
          </button>

          <Link
            href="/admin/products/new"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Masterwork
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by title, SKU, or gem..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active (Visible)</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={selectedStock}
              onChange={(e) => {
                setSelectedStock(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="all">Stock: All Levels</option>
              <option value="in-stock">In Stock (&gt;5)</option>
              <option value="low-stock">Low Stock (≤5)</option>
              <option value="out-of-stock">Vault Empty (0)</option>
            </select>
          </div>
        </div>

        {/* Secondary Bar: Active Counts & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-stone-800">{filteredProducts.length}</strong> jewelry pieces
            </span>
            {(searchQuery || selectedCategory !== "all" || selectedStatus !== "all" || selectedStock !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedStatus("all");
                  setSelectedStock("all");
                }}
                className="text-amber-600 hover:text-amber-700 underline font-medium ml-2"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "price-asc" | "price-desc" | "stock-asc")}
              className="bg-transparent text-stone-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="newest">Recently Crafted (Newest)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock-asc">Stock: Lowest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar (Appears when items are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-sm font-medium text-amber-950">items selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange("active")}
              className="px-3 py-1.5 bg-white border border-stone-300 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-50"
            >
              Set Active
            </button>
            <button
              onClick={() => handleBulkStatusChange("draft")}
              className="px-3 py-1.5 bg-white border border-stone-300 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-50"
            >
              Set Draft
            </button>
            <button
              onClick={() => setIsBulkDeleteDialogOpen(true)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-amber-800 hover:underline px-2"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Product Table Card */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[850px]">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/80 text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                <th className="py-3 px-4 w-10">
                  <button
                    onClick={toggleSelectAll}
                    className="text-stone-400 hover:text-stone-700 transition-colors"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Masterwork</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Vault Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                      <Search className="w-6 h-6" />
                    </div>
                    <p className="text-stone-700 font-semibold">No jewelry items found</p>
                    <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                      Try adjusting your search criteria or create a new fine jewelry piece.
                    </p>
                    <Link
                      href="/admin/products/new"
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700"
                    >
                      <Plus className="w-4 h-4" /> Add Product
                    </Link>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  const isLow = product.stock > 0 && product.stock <= product.lowStockThreshold;
                  const isOut = product.stock === 0;

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-stone-50/70 transition-colors ${
                        isSelected ? "bg-amber-50/40" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleSelectRow(product.id)}
                          className="text-stone-400 hover:text-stone-700 transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-amber-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Product Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="font-medium text-stone-900 hover:text-amber-600 transition-colors block line-clamp-1"
                            >
                              {product.name}
                            </Link>
                            <span className="text-[11px] text-stone-400 font-mono">
                              /product/{product.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-4 font-mono text-xs text-stone-600 uppercase font-semibold">
                        {product.sku}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-stone-700">
                        <span className="inline-block px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-xs">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-stone-900">
                            {formatPrice(product.price)}
                          </span>
                          {product.salePrice && (
                            <span className="text-[11px] text-stone-400 line-through">
                              {formatPrice(product.salePrice)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Vault Stock */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-semibold ${
                              isOut
                                ? "text-red-600"
                                : isLow
                                ? "text-amber-600"
                                : "text-stone-800"
                            }`}
                          >
                            {product.stock} units
                          </span>
                          {isLow && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                              LOW
                            </span>
                          )}
                          {isOut && (
                            <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold">
                              OUT
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={product.status} />
                      </td>

                      {/* Featured Star Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => toggleFeatured(product)}
                          className="p-1 rounded hover:bg-stone-100 transition-colors"
                          title={product.isFeatured ? "Remove from featured" : "Feature on homepage"}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              product.isFeatured
                                ? "fill-amber-400 text-amber-500"
                                : "text-stone-300 hover:text-stone-500"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Live on Storefront */}
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="p-1.5 text-stone-400 hover:text-stone-700 rounded hover:bg-stone-100 transition-colors"
                            title="Preview on Storefront"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {/* Edit */}
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-1.5 text-stone-400 hover:text-amber-600 rounded hover:bg-stone-100 transition-colors"
                            title="Edit Masterwork"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>

                          {/* Duplicate */}
                          <button
                            onClick={() => handleDuplicate(product.id)}
                            className="p-1.5 text-stone-400 hover:text-stone-700 rounded hover:bg-stone-100 transition-colors"
                            title="Duplicate Product"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {filteredProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-stone-200 text-xs text-stone-500">
            <div>
              Showing{" "}
              <strong className="text-stone-800">
                {(currentPage - 1) * itemsPerPage + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-stone-800">
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
              </strong>{" "}
              of <strong className="text-stone-800">{filteredProducts.length}</strong> items
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-7 h-7 rounded text-xs font-semibold transition-colors ${
                    currentPage === idx + 1
                      ? "bg-amber-600 text-white"
                      : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Fine Jewelry Masterwork"
        message="Are you certain you wish to remove this product from the catalog? This will delete all variant configurations and imagery associations."
        confirmText="Yes, Delete Product"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      {/* Bulk Delete Modal */}
      <ConfirmDialog
        isOpen={isBulkDeleteDialogOpen}
        title={`Delete ${selectedIds.length} Products?`}
        message="You are about to permanently remove multiple items from the jewelry catalog. This action cannot be undone."
        confirmText={`Delete ${selectedIds.length} Products`}
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleBulkDeleteConfirm}
        onCancel={() => setIsBulkDeleteDialogOpen(false)}
      />
    </div>
  );
}
