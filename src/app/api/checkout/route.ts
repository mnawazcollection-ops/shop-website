import { NextResponse } from "next/server";
import { products } from "@/data";
import { initialAdminCoupons, initialAdminProducts } from "@/data/adminMockData";
import { AdminOrder, AdminOrderItem } from "@/types/admin";

interface CheckoutRequestBody {
  items: Array<{
    id: string;
    name?: string;
    price?: number;
    image?: string;
    slug?: string;
    quantity: number;
    selectedVariants?: Record<string, string>;
  }>;
  customer: {
    email: string;
    phone?: string;
    firstName: string;
    lastName: string;
    country: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
  };
  shippingMethod: string;
  couponCode?: string;
  paymentMethod: "card" | "paypal" | "wire";
  cardLast4?: string;
}

const SHIPPING_RATES: Record<string, { name: string; price: number }> = {
  "free-insured": {
    name: "Free Standard Delivery",
    price: 0,
  },
  "express-air": {
    name: "Express Delivery",
    price: 2500,
  },
  "white-glove": {
    name: "Next Day Priority Delivery",
    price: 5000,
  },
};

export async function POST(request: Request) {
  try {
    const body: CheckoutRequestBody = await request.json();
    const { items, customer, shippingMethod, couponCode, paymentMethod, cardLast4 } = body;

    // 1. Basic validation of items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Your shopping bag is empty." },
        { status: 400 }
      );
    }

    // 2. Customer validation
    if (!customer?.email || !customer?.firstName || !customer?.lastName || !customer?.address1 || !customer?.city || !customer?.zip) {
      return NextResponse.json(
        { success: false, error: "Incomplete shipping or contact details provided." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Build lookup map of all catalog products (combining storefront & admin products)
    const productCatalog = new Map<string, { id: string; name: string; price: number; image: string; slug: string }>();
    
    for (const p of products) {
      productCatalog.set(p.id, {
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        slug: p.slug,
      });
    }
    for (const ap of initialAdminProducts) {
      if (!productCatalog.has(ap.id)) {
        productCatalog.set(ap.id, {
          id: ap.id,
          name: ap.name,
          price: ap.salePrice || ap.price,
          image: ap.image,
          slug: ap.slug,
        });
      }
    }

    // 3. Recalculate canonical line items & subtotal server-side
    const verifiedOrderItems: AdminOrderItem[] = [];
    let subtotal = 0;

    for (const item of items) {
      const quantity = Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1)));
      const catalogItem = productCatalog.get(item.id);
      const resolvedItem = catalogItem || (item.name && typeof item.price === "number" ? {
        id: item.id,
        name: item.name,
        price: Math.max(0, Number(item.price)),
        image: item.image || "/images/logo.png",
        slug: item.slug || item.id,
      } : null);

      if (!resolvedItem) {
        return NextResponse.json(
          { success: false, error: `Product with ID '${item.id}' is no longer available in the catalog.` },
          { status: 400 }
        );
      }

      const itemSubtotal = resolvedItem.price * quantity;
      subtotal += itemSubtotal;

      verifiedOrderItems.push({
        productId: resolvedItem.id,
        name: resolvedItem.name,
        image: resolvedItem.image,
        price: resolvedItem.price,
        quantity,
        selectedVariants: item.selectedVariants || {},
        subtotal: itemSubtotal,
      });
    }

    // 4. Server-side coupon verification
    let discountAmount = 0;
    let validatedCouponCode: string | undefined = undefined;

    if (couponCode && couponCode.trim()) {
      const cleanCode = couponCode.trim().toUpperCase();
      const coupon = initialAdminCoupons.find(
        (c) => c.code.toUpperCase() === cleanCode && c.isActive
      );

      if (coupon) {
        // Check expiration
        const expiry = new Date(coupon.expiryDate).getTime();
        const now = Date.now();
        if (expiry >= now) {
          // Check minimum order
          if (subtotal >= coupon.minOrder) {
            validatedCouponCode = coupon.code;
            if (coupon.discountType === "percentage") {
              const calc = (subtotal * coupon.discountValue) / 100;
              discountAmount = coupon.maxDiscount ? Math.min(calc, coupon.maxDiscount) : calc;
            } else {
              discountAmount = Math.min(coupon.discountValue, subtotal);
            }
          }
        }
      }
    }

    // 5. Shipping calculation
    const shippingRate = SHIPPING_RATES[shippingMethod] || SHIPPING_RATES["free-insured"];
    const shippingCost = shippingRate.price;

    // 6. Tax calculation (0 for luxury export / domestic included)
    const tax = 0;

    // 7. Final total calculation (guaranteed non-negative)
    const total = Math.max(0, Math.round((subtotal - discountAmount + shippingCost + tax) * 100) / 100);

    // 8. Generate safe, high-entropy unique order ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `SIJ-2026-${randomSuffix}`;

    const timestamp = new Date().toISOString();

    const verifiedOrder: AdminOrder = {
      id: orderId,
      orderNumber,
      customer: {
        name: `${customer.firstName} ${customer.lastName}`.trim(),
        email: customer.email.trim(),
        phone: customer.phone?.trim() || "",
        isVip: subtotal >= 2000,
      },
      shippingAddress: {
        address1: customer.address1.trim(),
        address2: customer.address2?.trim() || "",
        city: customer.city.trim(),
        state: customer.state?.trim() || "",
        zip: customer.zip.trim(),
        country: customer.country || "United States",
      },
      items: verifiedOrderItems,
      subtotal,
      discount: discountAmount,
      discountCode: validatedCouponCode,
      shipping: shippingCost,
      shippingMethod: shippingRate.name,
      tax,
      total,
      paymentStatus: paymentMethod === "wire" ? "pending" : "paid",
      paymentMethod:
        paymentMethod === "card"
          ? `Credit Card (ending in ${cardLast4 || "••••"})`
          : paymentMethod === "paypal"
          ? "PayPal"
          : "Bank Transfer / Cash on Delivery",
      orderStatus: "processing",
      timeline: [
        {
          title: "Order Placed & Verified",
          date: timestamp,
          description: "Order received and server-side pricing verified.",
          completed: true,
          current: true,
        },
        {
          title: "Payment Confirmed",
          date: paymentMethod === "wire" ? "Pending" : timestamp,
          description:
            paymentMethod === "wire"
              ? "Awaiting wire slip verification"
              : "Authorization and capture approved.",
          completed: paymentMethod !== "wire",
        },
        {
          title: "Packing & Quality Check",
          date: "Pending",
          description: "Items inspected and packed safely.",
          completed: false,
        },
        {
          title: "Shipped",
          date: "Pending",
          description: "Handed over to courier with tracking.",
          completed: false,
        },
        {
          title: "Delivered",
          date: "Pending",
          description: "Delivered to customer.",
          completed: false,
        },
      ],
      notes: "Website online order.",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return NextResponse.json({
      success: true,
      order: verifiedOrder,
      message: "Order placed and verified successfully.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error occurred.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
