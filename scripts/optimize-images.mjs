// Re-encode the scraped WordPress originals into public/images/ and build the
// 301 map from every old /wp-content/uploads/* URL to its new file.
// Usage: node scripts/optimize-images.mjs  (reads scrape/images, docs/migration/images.json)
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "scrape/images/wp-content/uploads";
const OUT = "public/images";
const MAX = 1600;

// Theme demo stock photos (not Rotozest's) are not carried over.
const SKIP = /^0\d_(projects|blog|breadcrumb)|^454464|^22\.jpg|^environmental-pollution/;
// Icons are replaced by one SVG icon set in the new design.
const ICONS = new Set(["agriculture", "badge", "chemical", "cosmetic-industry", "customer-centricity", "food-and-beverage", "global-marketing", "innovation", "integration", "lubrication", "oil-and-gas", "pharmaceutical", "save-the-world", "security", "shield-1", "veracity", "worker", "custom-1", "manufacturing", "support", "transport"]);

const slug = (name) => name.toLowerCase().replace(/\.[a-z]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
// "innovation-r1fvn5l1vw....png" (elementor thumb) and "ci-rotary-gear-pump-300x300.png" → base name
const baseOf = (file) => slug(file.replace(/-r[a-z0-9]{36,}(?=\.)/, "").replace(/-\d+x\d+(?=\.)/, ""));

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
}

fs.mkdirSync(OUT, { recursive: true });
const originals = walk(SRC).filter((p) => !/\.pdf$/.test(p) && !p.includes("/thumbs/") && !/-\d+x\d+\.\w+$/.test(p));
const made = {};
for (const p of originals) {
  const file = path.basename(p);
  if (SKIP.test(file)) continue;
  const base = baseOf(file);
  if (ICONS.has(base)) { made[base] = "icon"; continue; }
  const dest = path.join(OUT, `${base}.webp`);
  const img = sharp(p);
  const meta = await img.metadata();
  await img.resize({ width: Math.min(MAX, meta.width), withoutEnlargement: true }).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(dest);
  const out = await sharp(dest).metadata();
  made[base] = { src: `/images/${base}.webp`, width: out.width, height: out.height, from: p.replace("scrape/images", ""), kb: Math.round(fs.statSync(dest).size / 1024), origKb: Math.round(fs.statSync(p).size / 1024) };
}
// logo PNG kept as-is for schema.org and email clients
fs.copyFileSync(`${SRC}/2022/05/logo.png`, `${OUT}/rotozest-logo.png`);
fs.copyFileSync(`${SRC}/2025/01/favicon.png`, `src/app/icon.png`);
await sharp(`${SRC}/2025/01/favicon.png`).resize(180, 180).flatten({ background: "#ffffff" }).png().toFile("src/app/apple-icon.png");

// 301 map for every image URL Google may have indexed
const images = JSON.parse(fs.readFileSync("docs/migration/images.json", "utf8"));
const redirects = [];
for (const { src } of images) {
  const u = new URL(src);
  if (!u.pathname.startsWith("/wp-content/uploads/") || u.pathname.endsWith(".pdf")) continue;
  const base = baseOf(path.basename(u.pathname));
  const m = made[base];
  redirects.push({ source: u.pathname, destination: m && m !== "icon" ? m.src : "/" });
}
fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync("src/data/image-redirects.json", JSON.stringify(redirects, null, 1));
fs.writeFileSync("src/data/images.json", JSON.stringify(Object.fromEntries(Object.entries(made).filter(([, v]) => v !== "icon")), null, 1));
const kept = Object.values(made).filter((v) => v !== "icon");
console.log(`${kept.length} images written, ${kept.reduce((a, b) => a + b.kb, 0)} KB (was ${kept.reduce((a, b) => a + b.origKb, 0)} KB); ${redirects.length} redirects`);
