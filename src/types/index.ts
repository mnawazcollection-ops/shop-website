export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery?: string[];
  category: string;
  badge?: "new" | "sale" | "hot";
  rating?: number;
  reviewCount?: number;
  slug: string;
  sku?: string;
  tags?: string[];
  shortDescription?: string;
  description?: string;
  specifications?: Record<string, string>;
  variants?: ProductVariant[];
  inStock?: boolean;
}

export interface ProductVariant {
  type: "color" | "size" | "material";
  label: string;
  options: VariantOption[];
}

export interface VariantOption {
  value: string;
  label: string;
  colorHex?: string;
  priceModifier?: number;
  inStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
  productCount?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  slug: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified?: boolean;
}
