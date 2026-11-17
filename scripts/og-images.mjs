// Build 1200×630 JPG link-preview images for every page (public/og/<slug>.jpg).
// Usage: node scripts/og-images.mjs
import fs from "node:fs";
import sharp from "sharp";

const W = 1200, H = 630;
const pages = fs.readdirSync("src/content/pages").filter((f) => f.endsWith(".json")).map((f) => JSON.parse(fs.readFileSync(`src/content/pages/${f}`, "utf8")));
const logo = fs.readFileSync("public/images/rotozest-logo-white.svg", "utf8").replace(/<svg /, `<svg width="300" height="81" `);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function wrap(text, max = 24) {
  const words = text.split(/\s+/), lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 4);
}

fs.mkdirSync("public/og", { recursive: true });
for (const p of pages) {
  if (p.path === "/how-to-make-a-simple-and-quick-firewood/") continue;
  const slug = p.path.replace(/^\/|\/$/g, "").replace(/\//g, "__") || "home";
  const photo = p.path.includes("ci-rotary") ? "public/images/17.webp" : "public/images/ss-rotary-gear-pump-600.webp";
  const lines = wrap(p.h1.replace(/^Welcome to Rotozest Your Trusted Partner in /, ""), p.h1.length > 60 ? 22 : 20);
  const size = lines.length > 3 ? 48 : 56;
  const text = lines.map((l, i) => `<text x="64" y="${250 + i * (size + 10)}" font-family="Arial Narrow, Arial, Helvetica, sans-serif" font-weight="700" font-size="${size}" fill="#ffffff">${esc(l)}</text>`).join("");
  const overlay = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="#0E2A3B"/>
    <rect x="700" y="0" width="500" height="${H}" fill="#E9ECEE"/>
    <rect x="64" y="560" width="64" height="6" fill="#00A0E3"/>
    ${text}
    <text x="148" y="568" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#9FB4C2">www.rotozest.com · Ahmedabad, India</text>
  </svg>`);
  const pump = await sharp(photo).resize(440, 440, { fit: "contain", background: "#E9ECEE" }).flatten({ background: "#E9ECEE" }).toBuffer();
  await sharp(overlay)
    .composite([{ input: Buffer.from(logo), left: 64, top: 64 }, { input: pump, left: 730, top: 95 }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`public/og/${slug}.jpg`);
}
console.log(fs.readdirSync("public/og").length, "og images");
