import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/store/StoreContext";
import StorefrontShell from "@/components/layout/StorefrontShell";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "M. Nawaz Jewelry Collection | Luxury Handcrafted Jewelry",
  description:
    "Discover exquisite handcrafted gold, diamond, and precious gemstone jewelry at M. Nawaz Jewelry Collection. Timeless elegance and artisan craftsmanship.",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "JewelryStore",
        "@id": "https://mnawaz-jewelry.com/#organization",
        "name": "M. Nawaz Jewelry Collection",
        "url": "https://mnawaz-jewelry.com",
        "logo": "https://mnawaz-jewelry.com/images/logo.png",
        "image": "https://mnawaz-jewelry.com/images/logo.png",
        "description": "Exquisite handcrafted gold, diamond, and precious gemstone jewelry by master artisans.",
        "telephone": "+1-800-555-MNJC",
        "priceRange": "$$$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "450 Luxury Avenue, Suite 1200",
          "addressLocality": "New York",
          "addressRegion": "NY",
          "postalCode": "10022",
          "addressCountry": "US"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://mnawaz-jewelry.com/#website",
        "url": "https://mnawaz-jewelry.com",
        "name": "M. Nawaz Jewelry Collection",
        "publisher": {
          "@id": "https://mnawaz-jewelry.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://mnawaz-jewelry.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#FAF7F4] text-[#1A1A1A]">
        <StoreProvider>
          <StorefrontShell>{children}</StorefrontShell>
        </StoreProvider>
      </body>
    </html>
  );
}
