import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/store/StoreContext";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE, SEO_KEYWORDS, getRootSchemaGraph } from "@/lib/seo";

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

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Luxury 18K/21K/22K Gold & Diamond Jewelry Pakistan`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Pakistan's premier luxury jewelry atelier. Discover handcrafted 18K, 21K & 22K pure gold jewelry, certified natural diamonds, solitaire engagement rings, bridal sets, and bespoke high jewelry. Complimentary insured courier nationwide.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  generator: "Next.js",
  keywords: SEO_KEYWORDS,
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Luxury Fine Jewelry & Diamonds",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-PK": `${SITE_URL}`,
      "ur-PK": `${SITE_URL}`,
      "en-US": `${SITE_URL}`,
      "x-default": `${SITE_URL}`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Luxury Gold & Certified Diamond Atelier Pakistan`,
    description:
      "Handcrafted 18K/21K/22K gold jewelry, GIA-certified diamonds, bridal sets & bespoke solitaire engagement rings. Insured transit across Pakistan.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Luxury Haute Joaillerie Showcase`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Haute Joaillerie Pakistan`,
    description:
      "Handcrafted 18K/21K/22K gold jewelry, GIA-certified natural diamonds, and royal bridal collections.",
    images: [DEFAULT_OG_IMAGE],
    creator: "@mnawazjewelry",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  other: {
    "geo.region": "PK-PB",
    "geo.placename": "Lahore, Pakistan",
    "geo.position": "31.5204;74.3587",
    "ICBM": "31.5204, 74.3587",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rootJsonLd = getRootSchemaGraph();

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootJsonLd) }}
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
