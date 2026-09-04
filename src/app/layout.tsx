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
  title: "Sir Ihsan | Luxury Handcrafted Jewelry",
  description:
    "Discover exquisite handcrafted gold, diamond, and precious gemstone jewelry at Sir Ihsan. Timeless elegance and artisan craftsmanship.",
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
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAF7F4] text-[#1A1A1A]">
        <StoreProvider>
          <StorefrontShell>{children}</StorefrontShell>
        </StoreProvider>
      </body>
    </html>
  );
}
