"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  FolderTree,
} from "lucide-react";
import { useAdminData } from "@/store/AdminDataContext";
import { useAdminToast } from "@/components/admin/AdminToast";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import SlideOverDrawer from "@/components/admin/SlideOverDrawer";
import StatusBadge from "@/components/admin/StatusBadge";
import { AdminCategory } from "@/types/admin";

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useAdminData();
  const { addToast } = useAdminToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deleteCategoryItem, setDeleteCategoryItem] = useState<AdminCategory | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formParentId, setFormParentId] = useState<string>("");
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(1);
  const [formIsActive, setFormIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Compute live product counts dynamically
  const categoriesWithLiveCounts = useMemo(() => {
    return categories.map((cat) => {
      const count = products.filter(
        (p) => p.category.toLowerCase() === cat.name.toLowerCase()
      ).length;
      return { ...cat, productCount: count };
    });
  }, [categories, products]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categoriesWithLiveCounts.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categoriesWithLiveCounts, searchQuery]);

  // Open Drawer for Create
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormImage("https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop");
    setFormParentId("");
    setFormDisplayOrder(categories.length + 1);
    setFormIsActive(true);
    setErrors({});
    setIsDrawerOpen(true);
  };

  // Open Drawer for Edit
  const handleOpenEdit = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDescription(cat.description || "");
    setFormImage(cat.image || "");
    setFormParentId(cat.parentId || "");
    setFormDisplayOrder(cat.displayOrder || 1);
    setFormIsActive(cat.isActive);
    setErrors({});
    setIsDrawerOpen(true);
  };

  // Name change auto slug
  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      setFormSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  // Validate and Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!formName.trim()) errs.name = "Category name is required.";
    if (!formSlug.trim()) errs.slug = "URL Slug is required.";
    if (!formImage.trim()) errs.image = "Cover image URL is required.";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (editingCategory) {
      await updateCategory(editingCategory.id, {
        name: formName.trim(),
        slug: formSlug.trim(),
        description: formDescription.trim(),
        image: formImage.trim(),
        parentId: formParentId || null,
        displayOrder: Number(formDisplayOrder),
        isActive: formIsActive,
      });
      addToast({
        title: "Category Updated",
        message: `"${formName}" has been updated in Firestore & Cloudinary.`,
        type: "success",
      });
    } else {
      await addCategory({
        name: formName.trim(),
        slug: formSlug.trim(),
        description: formDescription.trim(),
        image: formImage.trim(),
        parentId: formParentId || null,
        displayOrder: Number(formDisplayOrder),
        isActive: formIsActive,
      });
      addToast({
        title: "Category Created",
        message: `"${formName}" has been saved to Firestore & Cloudinary.`,
        type: "success",
      });
    }

    setIsDrawerOpen(false);
  };

  const handleDelete = async () => {
    if (deleteCategoryItem) {
      await deleteCategory(deleteCategoryItem.id);
      addToast({
        title: "Category Deleted",
        message: `"${deleteCategoryItem.name}" was removed from Firestore.`,
        type: "info",
      });
      setDeleteCategoryItem(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Collections & Categories</h1>
          <p className="text-sm text-stone-500">
            Structure your storefront navigation, parent hierarchies, and high-jewelry groupings.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Category
        </button>
      </div>

      {/* Search & Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex items-center gap-3">
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collections by title or slug key..."
            className="w-full bg-transparent text-sm text-stone-900 placeholder-stone-400 focus:outline-none"
          />
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex items-center justify-between">
          <span className="text-xs font-medium text-stone-500">Active Collections</span>
          <span className="text-lg font-bold text-stone-900">
            {categories.filter((c) => c.isActive).length} / {categories.length}
          </span>
        </div>
      </div>

      {/* Categories Table / Hierarchy View */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/80 text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                <th className="py-3 px-4">Display Order</th>
                <th className="py-3 px-4">Collection</th>
                <th className="py-3 px-4">Slug / Route</th>
                <th className="py-3 px-4">Parent Category</th>
                <th className="py-3 px-4">Catalog Count</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500 text-sm">
                    No categories found matching your query.
                  </td>
                </tr>
              ) : (
                filteredCategories
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((cat) => {
                    const parentCategory = categories.find((c) => c.id === cat.parentId);

                    return (
                      <tr key={cat.id} className="hover:bg-stone-50/70 transition-colors">
                        {/* Order */}
                        <td className="py-3.5 px-4 font-mono text-xs text-stone-500 font-bold">
                          #{cat.displayOrder}
                        </td>

                        {/* Image & Title */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                              <Image
                                src={cat.image}
                                alt={cat.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-stone-900">{cat.name}</p>
                              <p className="text-xs text-stone-400 line-clamp-1 max-w-xs">
                                {cat.description || "Fine jewelry collection"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Slug */}
                        <td className="py-3.5 px-4 font-mono text-xs text-stone-600">
                          /category/{cat.slug}
                        </td>

                        {/* Parent */}
                        <td className="py-3.5 px-4 text-xs text-stone-600">
                          {parentCategory ? (
                            <span className="inline-flex items-center gap-1 text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                              <FolderTree className="w-3 h-3 text-stone-400" />
                              {parentCategory.name}
                            </span>
                          ) : (
                            <span className="text-stone-400 italic">Root Level</span>
                          )}
                        </td>

                        {/* Product Count */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold">
                            {cat.productCount} pieces
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <StatusBadge status={cat.isActive ? "active" : "draft"} />
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(cat)}
                              className="p-1.5 text-stone-400 hover:text-amber-600 rounded hover:bg-stone-100 transition-colors"
                              title="Edit Collection"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteCategoryItem(cat)}
                              className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                              title="Delete Collection"
                            >
                              <Trash2 className="w-4 h-4" />
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
      </div>

      {/* Drawer: Add / Edit Category */}
      <SlideOverDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : "Create Jewelry Category"}
        description="Configure display labels, hero banners, parent hierarchy, and ordering."
        width="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Diamond Bracelets"
              className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                errors.name ? "border-red-400 bg-red-50/20" : "border-stone-200"
              }`}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value)}
              placeholder="diamond-bracelets"
              className={`w-full px-3.5 py-2 bg-stone-50 border rounded-lg text-sm font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                errors.slug ? "border-red-400 bg-red-50/20" : "border-stone-200"
              }`}
            />
            {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Parent Hierarchy
            </label>
            <select
              value={formParentId}
              onChange={(e) => setFormParentId(e.target.value)}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="">None (Top-Level Category)</option>
              {categories
                .filter((c) => !editingCategory || c.id !== editingCategory.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Cover Image URL <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                {formImage ? (
                  <Image src={formImage} alt="Cover preview" fill className="object-cover" unoptimized />
                ) : null}
              </div>
              <input
                type="url"
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className={`w-full px-3.5 py-2 bg-stone-50 border rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                  errors.image ? "border-red-400 bg-red-50/20" : "border-stone-200"
                }`}
              />
            </div>
            {errors.image && <p className="text-xs text-red-600 mt-1">{errors.image}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Short Description
            </label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Luxurious summary for storefront category header..."
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                min="1"
                value={formDisplayOrder}
                onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Status
              </label>
              <select
                value={formIsActive ? "active" : "draft"}
                onChange={(e) => setFormIsActive(e.target.value === "active")}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="active">Active</option>
                <option value="draft">Disabled / Draft</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-2 border border-stone-200 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold shadow-sm"
            >
              {editingCategory ? "Save Changes" : "Create Collection"}
            </button>
          </div>
        </form>
      </SlideOverDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteCategoryItem}
        title={`Delete "${deleteCategoryItem?.name}"?`}
        message={`Are you certain you want to delete this category? Any products assigned to this category will remain intact but may need reassignment.`}
        confirmText="Delete Category"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteCategoryItem(null)}
      />
    </div>
  );
}
