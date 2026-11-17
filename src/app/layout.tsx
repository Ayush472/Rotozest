import type { Metadata, Viewport } from "next";
import { Barlow_Semi_Condensed, Heebo } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GearLoader } from "@/components/GearLoader";
import { MobileActionBar } from "@/components/sections";
import { JsonLd } from "@/components/ui";
import { baseMetadata, organizationJsonLd } from "@/lib/seo";
import { tracking } from "@/lib/site";
import { InquiryPopup } from "@/components/InquiryPopup";
import { BackToTop } from "@/components/BackToTop";
import { RevealObserver } from "@/components/Motion";

const barlow = Barlow_Semi_Condensed({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-barlow", display: "swap" });
const heebo = Heebo({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-heebo", display: "swap" });

export const metadata: Metadata = baseMetadata;
export const viewport: Viewport = { themeColor: "#0e2a3b", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${barlow.variable} ${heebo.variable}`} suppressHydrationWarning>
      <body>
        <GearLoader />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Header />
        <main id="main" className="pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileActionBar />
        <InquiryPopup />
        <BackToTop />
        <RevealObserver />
        <JsonLd data={organizationJsonLd()} />
      </body>
      {tracking.gtmId ? <GoogleTagManager gtmId={tracking.gtmId} /> : null}
      {tracking.ga4Id ? <GoogleAnalytics gaId={tracking.ga4Id} /> : null}
    </html>
  );
}
