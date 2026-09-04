export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "Super Admin" | "Store Manager" | "Jewelry Specialist";
  avatar?: string;
  createdAt: string;
}

export interface AdminProductVariant {
  type: "metal" | "size" | "gemstone" | "carat";
  label: string;
  options: Array<{
    value: string;
    label: string;
    priceModifier?: number;
    inStock?: boolean;
    sku?: string;
  }>;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  subCategory?: string;
  price: number;
  salePrice?: number;
  costPrice?: number;
  stock: number;
  lowStockThreshold: number;
  image: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  tags: string[];
  badge?: "new" | "sale" | "hot";
  status: "active" | "draft" | "archived";
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  allowBackorders: boolean;
  variants?: AdminProductVariant[];
  specifications?: Record<string, string>;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  parentId?: string | null;
  displayOrder: number;
  isActive: boolean;
  productCount: number;
  createdAt: string;
}

export interface AdminOrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedVariants?: Record<string, string>;
  subtotal: number;
}

export interface AdminOrderTimelineEvent {
  title: string;
  date: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    isVip?: boolean;
  };
  shippingAddress: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: AdminOrderItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  shipping: number;
  shippingMethod: string;
  tax: number;
  total: number;
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  paymentMethod: string;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  timeline: AdminOrderTimelineEvent[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  tier: "VIP Collector" | "Gold Tier" | "Private Client" | "Standard Client";
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: "active" | "disabled";
  joinedDate: string;
  address: {
    street: string;
    city: string;
    country: string;
    zip: string;
  };
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminBanner {
  id: string;
  title: string;
  subtitle: string;
  type: "hero" | "promo";
  image: string;
  buttonText: string;
  buttonLink: string;
  displayOrder: number;
  isActive: boolean;
}

export interface AdminReview {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
}

export interface AdminSettings {
  storeName: string;
  tagline: string;
  logoUrl: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  taxInclusive: boolean;
  freeShippingThreshold: number;
  standardShippingRate: number;
  expressShippingRate: number;
  whiteGloveShippingRate: number;
  orderPrefix: string;
  lowStockNotification: boolean;
  orderEmailNotification: boolean;
  firebaseConnected: boolean;
  firebaseProjectId: string;
}
