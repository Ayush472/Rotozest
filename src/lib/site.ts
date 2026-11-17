// Single source for business facts, navigation and third-party toggles.
// Tracking switches are documented in docs/decisions.md.

export const SITE_URL = "https://www.rotozest.com";

export const site = {
  name: "Rotozest Industries",
  shortName: "Rotozest",
  email: "info@rotozest.com",
  phones: [
    { label: "+91 99740 17583", href: "tel:+919974017583" },
    { label: "+91 99740 17582", href: "tel:+919974017582" },
  ],
  whatsapp: "https://wa.me/919974017583",
  address: {
    street: "Shed A/19 Parth Estate, Nr. Muktanand Society, Canal Road, Jamfalwadi, Ramol",
    city: "Ahmedabad",
    region: "Gujarat",
    postalCode: "382449",
    country: "IN",
    oneLine: "Shed A/19 Parth Estate, Nr. Muktanand Society, Canal Road, Jamfalwadi, Ramol, Ahmedabad - 382449.",
  },
  geo: { lat: 22.994436409038048, lng: 72.63903971349282 },
  hours: "Mon–Fri, 9:00 am – 7:00 pm",
  mapLink: "https://maps.app.goo.gl/nCuzCyAH6anXUjVZA",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.891078265951!2d72.64465807531283!3d22.991032479195894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e875e3eeb29ab%3A0x3165aaf70cc5bb7e!2sRotozest%20industries!5e0!3m2!1sen!2sin!4v1737703404949!5m2!1sen!2sin",
  social: {
    facebook: "https://www.facebook.com/rotozest.industries",
    instagram: "https://www.instagram.com/rotozest_industries_746/",
  },
  brochure: "/wp-content/uploads/2025/06/rotozest-brochure.pdf",
  logo: "/images/rotozest-logo.png",
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about-us/", label: "About Us" },
  {
    href: "/ss-rotary-gear-pump/",
    label: "Products",
    children: [
      { href: "/ss-rotary-gear-pump/", label: "SS Rotary Gear Pump Manufacturer" },
      { href: "/ci-rotary-gear-pump/", label: "CI Rotary Gear Pump" },
    ],
  },
  { href: "/applications/", label: "Applications" },
  { href: "/careers/", label: "Careers" },
  { href: "/blog/", label: "Blog" },
  { href: "/contact-us/", label: "Contact Us" },
] as const;

// Third-party scripts. Same IDs as the WordPress site so analytics history continues.
// Hotjar, Microsoft Clarity and Apollo are loaded by the GTM container, not here.
export const tracking = {
  gtmId: "GTM-55ZFLFT4" as string | null,
  ga4Id: "G-GLK4YTC4EE" as string | null,
  // Google Search Console HTML-tag verification (keep: removing it can unverify the property).
  googleSiteVerification: "f7oXrm8neJKLtApXqnSvCDKCZgVooLRixanrmHh-zp4",
};
