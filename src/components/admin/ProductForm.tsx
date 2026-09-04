"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  AlertCircle,
  HelpCircle,
  Layers,
  Sparkles,
  DollarSign,
  Tag,
  Box,
  Eye,
  GripVertical,
} from "lucide-react";
import { AdminProduct, AdminProductVariant } from "@/types/admin";
import { useAdminData } from "@/store/AdminDataContext";
import { useAdminToast } from "@/components/admin/AdminToast";

interface ProductFormProps {
  initialProduct?: AdminProduct;
  isEdit?: boolean;
}

export default function ProductForm({ initialProduct, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const { addProduct, updateProduct, categories } = useAdminData();
  const { addToast } = useAdminToast();

  // Basic Information
  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [sku, setSku] = useState(initialProduct?.sku || "");
  const [shortDescription, setShortDescription] = useState(initialProduct?.shortDescription || "");
  const [description, setDescription] = useState(initialProduct?.description || "");

  // Pricing
  const [price, setPrice] = useState<number | string>(initialProduct?.price ?? "");
  const [salePrice, setSalePrice] = useState<number | string>(initialProduct?.salePrice ?? "");
  const [costPrice, setCostPrice] = useState<number | string>(initialProduct?.costPrice ?? "");

  // Inventory
  const [stock, setStock] = useState<number | string>(initialProduct?.stock ?? 10);
  const [lowStockThreshold, setLowStockThreshold] = useState<number | string>(
    initialProduct?.lowStockThreshold ?? 5
  );
  const [allowBackorders, setAllowBackorders] = useState(initialProduct?.allowBackorders ?? false);

  // Categories & Tags
  const [category, setCategory] = useState(initialProduct?.category || (categories[0]?.name || "Rings"));
  const [subCategory, setSubCategory] = useState(initialProduct?.subCategory || "");
  const [tagsInput, setTagsInput] = useState(initialProduct?.tags ? initialProduct.tags.join(", ") : "");

  // Images
  const [mainImage, setMainImage] = useState(
    initialProduct?.image ||
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop"
  );
  const [gallery, setGallery] = useState<string[]>(
    initialProduct?.gallery && initialProduct.gallery.length > 0
      ? initialProduct.gallery
      : [
          "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
        ]
  );
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  // Product Variants
  const [hasVariants, setHasVariants] = useState(
    initialProduct?.variants && initialProduct.variants.length > 0 ? true : false
  );
  const [selectedMetals, setSelectedMetals] = useState<string[]>(["18K Yellow Gold", "18K White Gold"]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["6", "7", "8"]);

  // Merchandising & Status
  const [status, setStatus] = useState<"active" | "draft" | "archived">(initialProduct?.status || "active");
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured ?? false);
  const [isNewArrival, setIsNewArrival] = useState(initialProduct?.isNewArrival ?? true);
  const [isBestSeller, setIsBestSeller] = useState(initialProduct?.isBestSeller ?? false);
  const [badge, setBadge] = useState<"new" | "sale" | "hot" | undefined>(initialProduct?.badge);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit && (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""))) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  // Gallery Helpers
  const addGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setGallery([...gallery, newGalleryUrl.trim()]);
      setNewGalleryUrl("");
    }
  };

  const removeGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const moveGalleryImage = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= gallery.length) return;
    const newArr = [...gallery];
    const temp = newArr[index];
    newArr[index] = newArr[target];
    newArr[target] = temp;
    setGallery(newArr);
  };

  // Gross Margin Calculation
  const numPrice = Number(price) || 0;
  const numCost = Number(costPrice) || 0;
  const grossMargin = numPrice > 0 && numCost > 0 ? (((numPrice - numCost) / numPrice) * 100).toFixed(1) : null;

  // Validation
  const validate = () => {
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = "Product name is required.";
    if (!sku.trim()) err.sku = "Product SKU is required.";
    if (!price || Number(price) <= 0) err.price = "A valid retail price is required.";
    if (salePrice && Number(salePrice) >= Number(price)) {
      err.salePrice = "Sale price should be less than regular price.";
    }
    if (stock === "" || Number(stock) < 0) err.stock = "Stock quantity cannot be negative.";
    if (!mainImage.trim()) err.mainImage = "Main product image URL is required.";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast({
        title: "Validation Error",
        message: "Please complete all mandatory fields with valid values.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      // Build structured variants
      const constructedVariants: AdminProductVariant[] = [];
      if (hasVariants) {
        if (selectedMetals.length > 0) {
          constructedVariants.push({
            type: "metal",
            label: "Precious Metal",
            options: selectedMetals.map((m) => ({
              value: m.toLowerCase().replace(/\s+/g, "-"),
              label: m,
              priceModifier: m.includes("Platinum") ? 450 : m.includes("18K White") ? 150 : 0,
              inStock: true,
            })),
          });
        }
        if (selectedSizes.length > 0) {
          constructedVariants.push({
            type: "size",
            label: "Ring Size",
            options: selectedSizes.map((s) => ({
              value: s,
              label: `US ${s}`,
              inStock: true,
            })),
          });
        }
      }

      const productPayload = {
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        sku: sku.trim().toUpperCase(),
        category,
        subCategory: subCategory.trim() || undefined,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : undefined,
        costPrice: costPrice ? Number(costPrice) : undefined,
        stock: Number(stock),
        lowStockThreshold: Number(lowStockThreshold),
        image: mainImage.trim(),
        gallery: gallery.filter(Boolean),
        shortDescription: shortDescription.trim() || `${name} handcrafted with exceptional master artisanal detail.`,
        description:
          description.trim() ||
          `Sir Ihsan High Jewelry proudly introduces this masterwork. Flawlessly cut, hand-set in recycled precious metals with certified ethical provenance.`,
        tags: parsedTags.length > 0 ? parsedTags : ["Handmade", "18K Gold", "Fine Jewelry"],
        badge,
        status,
        isFeatured,
        isNewArrival,
        isBestSeller,
        allowBackorders,
        variants: constructedVariants.length > 0 ? constructedVariants : undefined,
      };

      if (isEdit && initialProduct) {
        updateProduct(initialProduct.id, productPayload);
        addToast({
          title: "Product Updated",
          message: `"${productPayload.name}" has been successfully updated.`,
          type: "success",
        });
      } else {
        const created = addProduct(productPayload);
        addToast({
          title: "Product Created",
          message: `"${created.name}" is now live in your catalog.`,
          type: "success",
        });
      }

      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      addToast({
        title: "Save Failed",
        message: "An unexpected error occurred while saving the product.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              {isEdit ? `Edit: ${initialProduct?.name}` : "Create New Masterwork"}
            </h1>
            <p className="text-sm text-stone-500">
              {isEdit
                ? "Update pricing, inventory, variants, and merchandising details."
                : "Add a prestigious fine jewelry piece to the catalog."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-lg text-sm font-medium transition-colors"
          >
            Discard
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {isEdit ? "Save Changes" : "Publish Masterwork"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5">
            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Tag className="w-4 h-4 text-amber-600" />
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Royal Solitaire Diamond Ring 18K"
                  className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all ${
                    errors.name ? "border-red-400 bg-red-50/20" : "border-stone-200"
                  }`}
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Slug / URL Key
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="royal-solitaire-diamond-ring"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">Direct URL on storefront: /product/{slug || "..."}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    SKU Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="SI-RNG-009"
                    className={`w-full px-3.5 py-2 bg-stone-50 border rounded-lg text-sm font-mono text-stone-800 uppercase focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                      errors.sku ? "border-red-400 bg-red-50/20" : "border-stone-200"
                    }`}
                  />
                  {errors.sku && <p className="text-xs text-red-600 mt-1">{errors.sku}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Short Description
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Masterpiece engagement ring with certified GIA oval diamond."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Full Description & Story
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed craftsmanship narrative, metal purity, certification, and styling advice..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-y"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Economics */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5">
            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <DollarSign className="w-4 h-4 text-amber-600" />
              Pricing & Economics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Regular Price ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="2450.00"
                    className={`w-full pl-7 pr-3 py-2 bg-stone-50 border rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                      errors.price ? "border-red-400 bg-red-50/20" : "border-stone-200"
                    }`}
                  />
                </div>
                {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Sale / Promo Price ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="Optional promo price"
                    className={`w-full pl-7 pr-3 py-2 bg-stone-50 border rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                      errors.salePrice ? "border-red-400 bg-red-50/20" : "border-stone-200"
                    }`}
                  />
                </div>
                {errors.salePrice && <p className="text-xs text-red-600 mt-1">{errors.salePrice}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Cost Price ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    placeholder="Workshop cost"
                    className="w-full pl-7 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">Internal only. Never shown to clients.</p>
              </div>
            </div>

            {grossMargin && (
              <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-lg flex items-center justify-between text-xs text-amber-900">
                <span className="font-medium">Estimated Gross Margin:</span>
                <span className="font-bold text-sm text-amber-700">{grossMargin}%</span>
              </div>
            )}
          </div>

          {/* Section 3: Inventory & Fulfillment */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5">
            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Box className="w-4 h-4 text-amber-600" />
              Inventory & Stock Management
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Current Stock Available <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                  className={`w-full px-3.5 py-2 bg-stone-50 border rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                    errors.stock ? "border-red-400 bg-red-50/20" : "border-stone-200"
                  }`}
                />
                {errors.stock && <p className="text-xs text-red-600 mt-1">{errors.stock}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Low-Stock Threshold Alert
                </label>
                <input
                  type="number"
                  min="1"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  placeholder="3"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <p className="text-[11px] text-stone-400 mt-1">Triggers warning when units fall below this.</p>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={allowBackorders}
                onChange={(e) => setAllowBackorders(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
              />
              <div>
                <span className="text-sm font-medium text-stone-800">Allow Made-to-Order / Backorders</span>
                <p className="text-xs text-stone-500">
                  Allow clients to purchase even when vault inventory reaches 0 (3-4 week atelier crafting cycle).
                </p>
              </div>
            </label>
          </div>

          {/* Section 4: Product Images & Media */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                Product Imagery & Gallery
              </h2>
              <span className="text-xs text-stone-500">{1 + gallery.length} media assets</span>
            </div>

            {/* Primary Cover Image */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Main Hero Image URL <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="relative w-28 h-28 shrink-0 rounded-lg border border-stone-200 bg-stone-50 overflow-hidden">
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt="Primary preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1 w-full space-y-2">
                  <input
                    type="url"
                    value={mainImage}
                    onChange={(e) => setMainImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className={`w-full px-3.5 py-2 bg-stone-50 border rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                      errors.mainImage ? "border-red-400 bg-red-50/20" : "border-stone-200"
                    }`}
                  />
                  <p className="text-xs text-stone-400">
                    High-resolution studio photography on neutral or luxury marble backgrounds recommended.
                  </p>
                </div>
              </div>
              {errors.mainImage && <p className="text-xs text-red-600 mt-1">{errors.mainImage}</p>}
            </div>

            {/* Gallery Images List */}
            <div className="pt-3 border-t border-stone-100 space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Additional Gallery Views
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {gallery.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-lg border border-stone-200 bg-stone-50 overflow-hidden aspect-square"
                  >
                    <Image
                      src={url}
                      alt={`Gallery view ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => moveGalleryImage(idx, "up")}
                          className="p-1 bg-white/90 text-stone-800 rounded hover:bg-white text-xs"
                          title="Move earlier"
                        >
                          ←
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {idx < gallery.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveGalleryImage(idx, "down")}
                          className="p-1 bg-white/90 text-stone-800 rounded hover:bg-white text-xs"
                          title="Move later"
                        >
                          →
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add new image placeholder */}
                <div className="border border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center p-3 text-center aspect-square bg-stone-50/50">
                  <input
                    type="text"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Image URL..."
                    className="w-full text-xs px-2 py-1 bg-white border border-stone-200 rounded mb-2"
                  />
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    disabled={!newGalleryUrl.trim()}
                    className="text-xs font-medium px-2 py-1 bg-stone-800 text-white rounded hover:bg-stone-900 disabled:opacity-40"
                  >
                    Add URL
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Jewelry Variants & Options */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  Jewelry Variants & Options
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Configure precious metals, ring sizes, and gemstones for custom ordering.
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasVariants}
                  onChange={(e) => setHasVariants(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
                />
                <span className="text-xs font-semibold text-stone-700">Enable Variants</span>
              </label>
            </div>

            {hasVariants && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                    Precious Metals Available
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "18K Yellow Gold",
                      "18K White Gold",
                      "18K Rose Gold",
                      "Platinum 950",
                      "925 Sterling Silver",
                    ].map((metal) => {
                      const isSelected = selectedMetals.includes(metal);
                      return (
                        <button
                          key={metal}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedMetals(selectedMetals.filter((m) => m !== metal));
                            } else {
                              setSelectedMetals([...selectedMetals, metal]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            isSelected
                              ? "bg-amber-50 border-amber-400 text-amber-900"
                              : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                          }`}
                        >
                          {isSelected ? `✓ ${metal}` : `+ ${metal}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                    Ring / Bracelet Sizes
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "One Size"].map((size) => {
                      const isSelected = selectedSizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedSizes(selectedSizes.filter((s) => s !== size));
                            } else {
                              setSelectedSizes([...selectedSizes, size]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            isSelected
                              ? "bg-amber-50 border-amber-400 text-amber-900"
                              : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                          }`}
                        >
                          {isSelected ? `✓ Size ${size}` : `Size ${size}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Organization, Status & Merchandising */}
        <div className="space-y-6">
          {/* Status Panel */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              Publication Status
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Visibility</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "draft" | "archived")}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="active">Active (Visible in Store)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Display Badge</label>
              <select
                value={badge || ""}
                onChange={(e) => setBadge((e.target.value as "new" | "sale" | "hot") || undefined)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="">No Badge</option>
                <option value="new">NEW ARRIVAL</option>
                <option value="sale">SPECIAL PROMO</option>
                <option value="hot">HOT / TRENDING</option>
              </select>
            </div>
          </div>

          {/* Categorization Panel */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              Categorization
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Primary Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Sub-Collection</label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="e.g. Engagement Rings, Solitaires"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Diamond, 18K, Solitaire, Luxury"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Merchandising & Highlights */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              Store Merchandising
            </h3>

            <label className="flex items-center gap-3 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
              />
              <span className="text-xs font-medium text-stone-800">Feature on Homepage</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
              />
              <span className="text-xs font-medium text-stone-800">Mark as New Arrival</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
              />
              <span className="text-xs font-medium text-stone-800">Mark as Best Seller</span>
            </label>
          </div>

          {/* Storefront Preview Card */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-950 rounded-xl p-5 text-white space-y-3">
            <div className="flex items-center justify-between text-xs text-amber-400 font-semibold uppercase tracking-wider">
              <span>Client Preview</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-stone-800 border border-stone-800">
              {mainImage ? (
                <Image src={mainImage} alt="Card preview" fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-500 text-xs">
                  No preview available
                </div>
              )}
            </div>

            <div className="pt-1">
              <p className="text-xs text-stone-400 uppercase tracking-widest">{category}</p>
              <h4 className="text-sm font-serif font-medium text-stone-100 truncate mt-0.5">
                {name || "Untitled Masterpiece"}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-semibold text-amber-400">
                  ${price ? Number(price).toLocaleString() : "0.00"}
                </span>
                {salePrice && (
                  <span className="text-xs text-stone-500 line-through">
                    ${Number(salePrice).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
