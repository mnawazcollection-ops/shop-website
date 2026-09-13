"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Star,
} from "lucide-react";
import { useAdminData } from "@/store/AdminDataContext";
import { useAdminToast } from "@/components/admin/AdminToast";
import SlideOverDrawer from "@/components/admin/SlideOverDrawer";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { AdminBanner } from "@/types/admin";

export default function ContentManagementPage() {
  const {
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    products,
    updateProduct,
  } = useAdminData();
  const { addToast } = useAdminToast();

  const [activeTab, setActiveTab] = useState<"hero" | "promo" | "featured">("hero");

  // Banner Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AdminBanner | null>(null);
  const [deleteBannerItem, setDeleteBannerItem] = useState<AdminBanner | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formType, setFormType] = useState<"hero" | "promo">("hero");
  const [formImage, setFormImage] = useState("");
  const [formButtonText, setFormButtonText] = useState("Discover Collection");
  const [formButtonLink, setFormButtonLink] = useState("/shop");
  const [formOrder, setFormOrder] = useState(1);
  const [formIsActive, setFormIsActive] = useState(true);

  const heroBanners = banners.filter((b) => b.type === "hero");
  const promoBanners = banners.filter((b) => b.type === "promo");

  const handleOpenCreateBanner = (type: "hero" | "promo") => {
    setEditingBanner(null);
    setFormType(type);
    setFormTitle("");
    setFormSubtitle("");
    setFormImage(
      type === "hero"
        ? "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop"
    );
    setFormButtonText("Explore Creations");
    setFormButtonLink("/shop");
    setFormOrder(banners.length + 1);
    setFormIsActive(true);
    setIsDrawerOpen(true);
  };

  const handleOpenEditBanner = (b: AdminBanner) => {
    setEditingBanner(b);
    setFormType(b.type);
    setFormTitle(b.title);
    setFormSubtitle(b.subtitle);
    setFormImage(b.image);
    setFormButtonText(b.buttonText);
    setFormButtonLink(b.buttonLink);
    setFormOrder(b.displayOrder);
    setFormIsActive(b.isActive);
    setIsDrawerOpen(true);
  };

  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formImage.trim()) {
      addToast({
        title: "Validation Error",
        message: "Title and Image URL are required.",
        type: "error",
      });
      return;
    }

    const payload = {
      title: formTitle.trim(),
      subtitle: formSubtitle.trim(),
      type: formType,
      image: formImage.trim(),
      buttonText: formButtonText.trim(),
      buttonLink: formButtonLink.trim(),
      displayOrder: Number(formOrder),
      isActive: formIsActive,
    };

    if (editingBanner) {
      updateBanner(editingBanner.id, payload);
      addToast({
        title: "Banner Updated",
        message: "Homepage visual changes saved.",
        type: "success",
      });
    } else {
      addBanner(payload);
      addToast({
        title: "Banner Added",
        message: "New banner is now published.",
        type: "success",
      });
    }

    setIsDrawerOpen(false);
  };

  const handleDeleteBanner = () => {
    if (deleteBannerItem) {
      deleteBanner(deleteBannerItem.id);
      addToast({
        title: "Banner Removed",
        message: "Banner slide has been deleted.",
        type: "info",
      });
      setDeleteBannerItem(null);
    }
  };

  const toggleFeaturedProduct = (id: string, currentVal: boolean) => {
    updateProduct(id, { isFeatured: !currentVal });
    addToast({
      title: "Featured Product Updated",
      message: `Product ${!currentVal ? "added to" : "removed from"} homepage.`,
      type: "info",
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Website Banners & Highlights
          </h1>
          <p className="text-sm text-stone-500">
            Manage homepage sliders, promotional banners, and featured products.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-3.5 py-2 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-stone-500" />
          View Website
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab("hero")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "hero"
              ? "border-amber-600 text-amber-600"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          Homepage Sliders ({heroBanners.length})
        </button>

        <button
          onClick={() => setActiveTab("promo")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "promo"
              ? "border-amber-600 text-amber-600"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          Promo Banners ({promoBanners.length})
        </button>

        <button
          onClick={() => setActiveTab("featured")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "featured"
              ? "border-amber-600 text-amber-600"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          Featured on Homepage ({products.filter((p) => p.isFeatured).length} products)
        </button>
      </div>

      {/* TAB 1: HERO SLIDER */}
      {activeTab === "hero" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-stone-500">
              These images show as large slides at the top of your homepage.
            </p>
            <button
              onClick={() => handleOpenCreateBanner("hero")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Slider Image
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heroBanners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs flex flex-col"
              >
                <div className="relative h-44 w-full bg-stone-900">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover opacity-80"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono font-bold backdrop-blur-xs">
                      #{banner.displayOrder}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        banner.isActive ? "bg-emerald-500 text-white" : "bg-stone-600 text-stone-200"
                      }`}
                    >
                      {banner.isActive ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
                      {banner.subtitle}
                    </span>
                    <h3 className="text-base font-serif font-bold text-white truncate">{banner.title}</h3>
                  </div>
                </div>

                <div className="p-4 flex-1 flex items-center justify-between text-xs border-t border-stone-100 bg-stone-50/50">
                  <div className="space-y-0.5">
                    <p className="text-stone-700 font-medium">
                      CTA: <span className="font-bold text-stone-900">&quot;{banner.buttonText}&quot;</span>
                    </p>
                    <p className="text-stone-400 font-mono text-[11px]">{banner.buttonLink}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditBanner(banner)}
                      className="p-1.5 text-stone-400 hover:text-amber-600 rounded hover:bg-stone-100"
                      title="Edit Slide"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteBannerItem(banner)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-red-50"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROMO BANNERS */}
      {activeTab === "promo" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-stone-500">
              Promo banners appear across your homepage to highlight discounts or special collections.
            </p>
            <button
              onClick={() => handleOpenCreateBanner("promo")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Banner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promoBanners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs flex flex-col"
              >
                <div className="relative h-36 w-full bg-stone-900">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover opacity-80"
                    unoptimized
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        banner.isActive ? "bg-emerald-500 text-white" : "bg-stone-600 text-white"
                      }`}
                    >
                      {banner.isActive ? "Active" : "Draft"}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <p className="text-[10px] text-amber-300 font-semibold">{banner.subtitle}</p>
                    <p className="text-sm font-serif font-bold text-white truncate">{banner.title}</p>
                  </div>
                </div>

                <div className="p-3 flex items-center justify-between text-xs bg-stone-50/50">
                  <span className="font-mono text-stone-500 text-[11px] truncate max-w-[140px]">
                    {banner.buttonLink}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditBanner(banner)}
                      className="p-1 text-stone-400 hover:text-amber-600"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteBannerItem(banner)}
                      className="p-1 text-stone-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FEATURED PRODUCTS ON HOMEPAGE */}
      {activeTab === "featured" && (
        <div className="space-y-4">
          <p className="text-xs text-stone-500">
            Click the star button on any product to show or hide it on your homepage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className={`bg-white rounded-xl border p-4 shadow-xs transition-all flex flex-col justify-between ${
                  p.isFeatured ? "border-amber-400 ring-2 ring-amber-100" : "border-stone-200"
                }`}
              >
                <div>
                  <div className="relative aspect-square w-full rounded-lg bg-stone-100 overflow-hidden mb-3">
                    <Image src={p.image} alt={p.name} fill className="object-cover" unoptimized />
                    {p.isFeatured && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-bold">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-400 uppercase tracking-widest">{p.category}</span>
                  <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">{p.name}</h4>
                  <p className="text-xs font-bold text-amber-600 mt-1">Rs. {p.price.toLocaleString()}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFeaturedProduct(p.id, p.isFeatured)}
                  className={`mt-3 w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    p.isFeatured
                      ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${p.isFeatured ? "fill-amber-600 text-amber-600" : ""}`} />
                  {p.isFeatured ? "Shown on Homepage" : "Show on Homepage"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Banner Slide-Over Drawer */}
      <SlideOverDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingBanner ? "Edit Banner" : "Add New Banner"}
        description="Set banner photo, title, link, and where it appears."
        width="max-w-md"
      >
        <form onSubmit={handleBannerSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Banner Type
            </label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value as "hero" | "promo")}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none"
            >
              <option value="hero">Top Homepage Slider</option>
              <option value="promo">Promo Banner Card</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Elegant Gold Collection"
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Subtitle (Optional)
            </label>
            <input
              type="text"
              value={formSubtitle}
              onChange={(e) => setFormSubtitle(e.target.value)}
              placeholder="e.g. Handcrafted Jewelry"
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Background Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none"
            />
            {formImage && (
              <div className="relative h-24 rounded-lg overflow-hidden border border-stone-200 mt-2 bg-stone-100">
                <Image src={formImage} alt="Banner preview" fill className="object-cover" unoptimized />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={formButtonText}
                onChange={(e) => setFormButtonText(e.target.value)}
                placeholder="Explore Collection"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Button Link
              </label>
              <input
                type="text"
                value={formButtonLink}
                onChange={(e) => setFormButtonLink(e.target.value)}
                placeholder="/shop or /category/rings"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Display Order (1 = First)
              </label>
              <input
                type="number"
                min="1"
                value={formOrder}
                onChange={(e) => setFormOrder(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Status
              </label>
              <select
                value={formIsActive ? "active" : "draft"}
                onChange={(e) => setFormIsActive(e.target.value === "active")}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none"
              >
                <option value="active">Active (Visible on Store)</option>
                <option value="draft">Hidden</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-2 border border-stone-200 text-stone-700 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold"
            >
              {editingBanner ? "Save Banner" : "Create Banner"}
            </button>
          </div>
        </form>
      </SlideOverDrawer>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteBannerItem}
        title="Delete Banner?"
        message="Are you sure you want to delete this banner image from your homepage?"
        confirmText="Delete Banner"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDeleteBanner}
        onCancel={() => setDeleteBannerItem(null)}
      />
    </div>
  );
}
