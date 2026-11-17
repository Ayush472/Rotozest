import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rotozest Industries",
    short_name: "Rotozest",
    description: "SS and CI rotary gear pump manufacturer in Ahmedabad, India.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0e2a3b",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
