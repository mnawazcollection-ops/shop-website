/**
 * M. Nawaz Jewelry Collection - Advanced SEO Engine & Schema Generator
 * Optimized for Google Rich Results, Bing, Yahoo, Yandex, Apple Search & Social Sharing.
 */

export const SITE_NAME = "M. Nawaz Jewelry Collection";
export const SITE_TAGLINE = "Fine Jewelry & High Diamond Atelier";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mnawazcollection.com";
export const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=630&fit=crop&q=80";

export const SEO_KEYWORDS = [
  // Brand Keywords
  "M. Nawaz Jewelry Collection",
  "M Nawaz Jewellers",
  "M. Nawaz Atelier",
  "M. Nawaz Fine Jewelry",
  
  // High-Volume Commercial Keywords (Pakistan Focus)
  "Gold jewelry Pakistan",
  "Gold jewellery Pakistan",
  "Diamond rings Pakistan",
  "18K Gold sets Lahore",
  "21K Gold bridal sets Karachi",
  "22K Solid gold jewellery Islamabad",
  "Diamond engagement rings Pakistan",
  "Solitaire diamond rings Pakistan",
  "Bridal jewelry collection Pakistan",
  "Pakistani bridal jewellery sets",
  "Gold bangles Pakistan",
  "Tennis bracelet diamond Pakistan",
  "Sapphire rings Pakistan",
  "Emerald necklace Lahore",
  "Certified natural diamonds Pakistan",
  "GIA certified diamonds Pakistan",
  "IGI certified jewellery Pakistan",
  "Custom made jewelry Pakistan",
  "Bespoke jewellery Lahore",
  "Luxury gold store M. M. Alam Road",
  "Gulberg Lahore jewellery",
  "Gold price in Pakistan today",
  "Pure gold earrings Pakistan",
  "Gold chain necklace women Pakistan",
  "Platinum engagement rings Pakistan",
  "Wedding rings Pakistan",
  "Online jewelry shopping Pakistan",
  "Insured gold delivery Pakistan",
  "Cash on delivery jewelry Pakistan",
  
  // International Luxury Jewelry Terms
  "Fine jewelry atelier",
  "Handcrafted gold rings",
  "Solid 18K gold earrings",
  "Luxury diamond bracelets",
  "High jewelry collection",
  "Bespoke diamond masterworks",
  "Heritage filigree goldsmithing",
  "Artisan jewelry online",
  "Ethical gold fine jewelry",
  "Certified solitaire rings",
];

export const BUSINESS_INFO = {
  name: "M. Nawaz Jewelry Collection",
  legalName: "M. Nawaz Fine Jewelry & Diamond Atelier Ltd.",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  telephone: "+92 300 1234567",
  email: "concierge@mnawazcollection.com",
  currency: "PKR",
  priceRange: "PKR 25,000 - PKR 2,500,000",
  address: {
    street: "M. M. Alam Road, Gulberg III",
    city: "Lahore",
    region: "Punjab",
    postalCode: "54000",
    country: "PK",
  },
  geo: {
    latitude: 31.5204,
    longitude: 74.3587,
  },
  openingHours: [
    "Mo-Sa 11:00-21:00",
    "Su 14:00-20:00",
  ],
  socials: [
    "https://www.instagram.com/mnawazjewelry",
    "https://www.facebook.com/mnawazjewelry",
    "https://www.pinterest.com/mnawazjewelry",
  ],
};

/**
 * Generates Root Organization & JewelryStore Schema
 */
export function getRootSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["JewelryStore", "Store", "LocalBusiness"],
        "@id": `${SITE_URL}/#organization`,
        "name": BUSINESS_INFO.name,
        "legalName": BUSINESS_INFO.legalName,
        "url": SITE_URL,
        "logo": {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          "url": BUSINESS_INFO.logo,
          "contentUrl": BUSINESS_INFO.logo,
          "caption": BUSINESS_INFO.name,
        },
        "image": {
          "@id": `${SITE_URL}/#logo`,
        },
        "description": "Pakistan's premier luxury jewelry atelier. Crafting heirloom 18K, 21K, and 22K pure gold jewelry, certified natural diamonds, solitaire engagement rings, and bespoke bridal masterworks.",
        "telephone": BUSINESS_INFO.telephone,
        "email": BUSINESS_INFO.email,
        "priceRange": BUSINESS_INFO.priceRange,
        "currenciesAccepted": "PKR, USD, GBP, EUR",
        "paymentAccepted": "Cash on Delivery, Bank Wire Transfer, Credit Card, Debit Card",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": BUSINESS_INFO.address.street,
          "addressLocality": BUSINESS_INFO.address.city,
          "addressRegion": BUSINESS_INFO.address.region,
          "postalCode": BUSINESS_INFO.address.postalCode,
          "addressCountry": BUSINESS_INFO.address.country,
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": BUSINESS_INFO.geo.latitude,
          "longitude": BUSINESS_INFO.geo.longitude,
        },
        "hasMap": "https://maps.google.com/?q=Gulberg+III+Lahore+Pakistan",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "11:00",
            "closes": "21:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Sunday"],
            "opens": "14:00",
            "closes": "20:00",
          },
        ],
        "sameAs": BUSINESS_INFO.socials,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        "url": SITE_URL,
        "name": BUSINESS_INFO.name,
        "description": "Exquisite 18K/21K/22K Gold & Natural Diamond Fine Jewelry Atelier Pakistan",
        "publisher": {
          "@id": `${SITE_URL}/#organization`,
        },
        "inLanguage": ["en-PK", "ur-PK", "en-US"],
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

/**
 * Product Schema Generator for Google Rich Results
 */
export function getProductSchema(product: {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  gallery?: string[];
  description?: string;
  shortDescription?: string;
  sku?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
}) {
  const productUrl = `${SITE_URL}/product/${product.slug}`;
  const images = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image.startsWith("http") ? product.image : `${SITE_URL}${product.image}`];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    "name": product.name,
    "url": productUrl,
    "image": images,
    "description": product.shortDescription || product.description || `Handcrafted ${product.name} from M. Nawaz Jewelry Collection in solid ethical gold.`,
    "sku": product.sku || `MNJ-${product.id}`,
    "mpn": product.sku || `MNJ-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": BUSINESS_INFO.name,
    },
    "category": product.category || "Fine Jewelry",
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "PKR",
      "price": Math.round(product.price),
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": BUSINESS_INFO.name,
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "PKR",
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "PK",
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "DAY",
          },
        },
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "PK",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 30,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn",
      },
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 5,
      "reviewCount": product.reviewCount || 12,
      "bestRating": 5,
      "worstRating": 1,
    },
  };
}

/**
 * Breadcrumb Schema Generator
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * FAQ Schema Generator for Google Rich Snippets
 */
export function getFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}

/**
 * CollectionPage Schema Generator
 */
export function getCollectionSchema(collection: {
  name: string;
  url: string;
  description: string;
  itemCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${collection.url.startsWith("http") ? collection.url : `${SITE_URL}${collection.url}`}#collection`,
    "url": collection.url.startsWith("http") ? collection.url : `${SITE_URL}${collection.url}`,
    "name": collection.name,
    "description": collection.description,
    "isPartOf": {
      "@id": `${SITE_URL}/#website`,
    },
    ...(collection.itemCount ? { "numberOfItems": collection.itemCount } : {}),
  };
}

