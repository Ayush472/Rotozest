import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rotary Gear Pump, Rotary Pump, Gear Pump | Rotozest Industries",
  description: "Rotozest Industries  is a leading Manufacturer and Supplier of Rotary Gear Pump, Gear Pump, Rotary Pump, and Rotary Gear Pumps in India.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
