"use client";

import { Product } from "@/types";
import { AdminProduct } from "@/types/admin";
import { products as staticProducts, categories as staticCategories } from "@/data";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { fetchCollection } from "@/lib/firebase/firestoreService";

const ADMIN_STORAGE_KEY = "mnawaz_admin_products";
const FALLBACK_STORAGE_KEY = "sir_ihsan_admin_products";

/**
 * Converts an AdminProduct model into a Storefront Product model
 */
export function adminProductToStorefront(ap: AdminProduct): Product {
  const cleanSlug =
    ap.slug?.trim() ||
    ap.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const hasSale = typeof ap.salePrice === "number" && ap.salePrice > 0 && ap.salePrice < ap.price;

  return {
    id: ap.id,
    name: ap.name,
    price: hasSale ? (ap.salePrice as number) : ap.price,
    originalPrice: hasSale ? ap.price : undefined,
    image: ap.image || "/images/placeholder-jewelry.jpg",
    gallery: ap.gallery && ap.gallery.length > 0 ? ap.gallery : [ap.image || "/images/placeholder-jewelry.jpg"],
    category: ap.category || "Jewelry",
    badge: ap.badge || (ap.isNewArrival ? "new" : ap.isBestSeller ? "hot" : undefined),
    rating: 5,
    reviewCount: 1,
    slug: cleanSlug,
    sku: ap.sku || `SIJ-${ap.id}`,
    tags: ap.tags && ap.tags.length > 0 ? ap.tags : [ap.category || "Fine Jewelry"],
    shortDescription: ap.shortDescription || ap.description?.slice(0, 160) || "",
    description: ap.description || ap.shortDescription || "",
    inStock: ap.stock > 0 && ap.status !== "archived",
  };
}

/**
 * Combines stored admin products (LocalStorage + Cloud) with initial catalog products
 */
export function getCombinedProducts(): Product[] {
  if (typeof window === "undefined") {
    return staticProducts;
  }

  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY) || localStorage.getItem(FALLBACK_STORAGE_KEY);
    if (!raw) return staticProducts;

    const adminProducts: AdminProduct[] = JSON.parse(raw);
    if (!Array.isArray(adminProducts) || adminProducts.length === 0) {
      return staticProducts;
    }

    // Map active admin products to Storefront Product format
    const mappedAdmin: Product[] = adminProducts
      .filter((ap) => ap.status !== "archived")
      .map(adminProductToStorefront);

    // Keep track of IDs and slugs already represented by admin products
    const seenIds = new Set<string>();
    const seenSlugs = new Set<string>();
    const combined: Product[] = [];

    // Prepend admin products so newly created items appear at the very top of the store!
    for (const item of mappedAdmin) {
      combined.push(item);
      seenIds.add(item.id);
      seenSlugs.add(item.slug.toLowerCase());
    }

    // Add static products that haven't been overwritten or deleted
    for (const sp of staticProducts) {
      if (!seenIds.has(sp.id) && !seenSlugs.has(sp.slug.toLowerCase())) {
        combined.push(sp);
      }
    }

    return combined;
  } catch (err) {
    console.warn("Could not parse admin products from storage:", err);
    return staticProducts;
  }
}

/**
 * Background sync helper to pull any cloud products from Firebase Firestore
 */
export async function syncProductsFromFirebase(onUpdate?: (products: Product[]) => void) {
  if (!isFirebaseConfigured || typeof window === "undefined") return;

  try {
    const cloudItems = await fetchCollection<AdminProduct>("products");
    if (cloudItems && cloudItems.length > 0) {
      const existingRaw = localStorage.getItem(ADMIN_STORAGE_KEY) || localStorage.getItem(FALLBACK_STORAGE_KEY);
      const existing: AdminProduct[] = existingRaw ? JSON.parse(existingRaw) : [];

      const map = new Map<string, AdminProduct>();
      // Existing local first
      for (const item of existing) {
        map.set(item.id, item);
      }
      // Cloud updates overwrite/augment
      for (const cloud of cloudItems) {
        map.set(cloud.id, { ...map.get(cloud.id), ...cloud });
      }

      const merged = Array.from(map.values());
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(merged));

      const updatedCombined = getCombinedProducts();
      if (onUpdate) {
        onUpdate(updatedCombined);
      }
      window.dispatchEvent(new Event("mnawaz_products_updated"));
    }
  } catch (err) {
    console.warn("Firebase products sync skipped:", err);
  }
}
