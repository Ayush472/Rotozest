import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rotary Gear Pump, Rotary Pump, Gear Pump | Rotozest Industries",
  description:
    "Rotozest Industries  is a leading Manufacturer and Supplier of Rotary Gear Pump, Gear Pump, Rotary Pump, and Rotary Gear Pumps in India.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta
        name="description"
        content="Rotozest Industries - High-quality rotary gear pumps for industrial, pharmaceutical, and food applications."
      />
      <meta
        name="keywords"
        content="Rotary gear pump, Stainless steel pump, Self-priming pump, Positive displacement pump, Industrial pumps, SS-316 pump, Viscous liquid pump, Food product pump, Pharmaceutical pump, Chemical pump"
      />
      <meta name="author" content="Rotozest Industries" />
      <meta property="og:type" content="website" />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
