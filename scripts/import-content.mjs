// Turn the scraped WordPress HTML into clean content JSON (exact wording kept).
// Usage: node scripts/import-content.mjs <dir-with-raw-html>
// Output: src/content/pages/<slug>.json  { path, meta, h1, html, faq[], jsonld[], images[] }
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const RAW = process.argv[2] || "scrape/html";
const BASE = "https://www.rotozest.com";
const urls = fs.readFileSync("docs/migration/urls.txt", "utf8").split("\n").map((s) => s.trim()).filter(Boolean);
const imgMap = JSON.parse(fs.readFileSync("src/data/image-redirects.json", "utf8"));
const imgByPath = Object.fromEntries(imgMap.map((r) => [r.source, r.destination]));
const imgMeta = JSON.parse(fs.readFileSync("src/data/images.json", "utf8"));
const metaBySrc = Object.fromEntries(Object.values(imgMeta).map((m) => [m.src, m]));

const fname = (u) => u.replace(/^\/|\/$/g, "").replace(/\//g, "__") || "home";
const clean = (t) => (t || "").replace(/\s+/g, " ").trim();
const decode = (s) => cheerio.load(`<i>${s}</i>`)("i").text();

fs.mkdirSync("src/content/pages", { recursive: true });
for (const u of urls) {
  const html = fs.readFileSync(path.join(RAW, fname(u) + ".html"), "utf8");
  const $ = cheerio.load(html);
  const m = (k) => $(`meta[name="${k}"]`).attr("content") ?? $(`meta[property="${k}"]`).attr("content") ?? null;
  const meta = {
    title: clean($("title").text()),
    description: m("description"),
    canonical: $('link[rel="canonical"]').attr("href") || BASE + u,
    robots: m("robots"),
    ogType: m("og:type"),
    ogTitle: m("og:title"),
    ogDescription: m("og:description"),
    ogImage: m("og:image"),
    ogImageAlt: m("og:image:alt"),
    twitterCard: m("twitter:card"),
    published: m("article:published_time"),
    modified: m("article:modified_time") || m("og:updated_time"),
    section: m("article:section"),
    readTime: $('meta[name="twitter:data2"]').attr("content") || null,
  };
  const jsonld = $('script[type="application/ld+json"]').map((_, s) => { try { return JSON.parse($(s).text()); } catch { return null; } }).get().filter(Boolean);
  const h1 = clean($("h1").first().text());

  // Content root: page builder content, or the post body for blog posts.
  let root = $("#primary .entry-content").first();
  if (!root.length) root = $("#primary").first();
  root.find("script,style,noscript,form,.wpcf7,iframe,#secondary,.elementor-hidden-desktop,.ct-breadcrumb,.entry-meta,.post-navigation,.comments-area,#comments,.entry-tags,.entry-social-share,.ct-blog-meta,.screen-reader-text,svg,.elementor-widget-spacer,.elementor-widget-divider").remove();
  root.find("h1").remove();

  // FAQ accordions → structured list, marker left in place.
  const faq = [];
  root.find(".ct-accordion, .elementor-accordion, .elementor-toggle").each((_, acc) => {
    $(acc).find(".ct-accordion-item, .elementor-accordion-item, .elementor-toggle-item").each((_, it) => {
      const q = clean($(it).find(".ct-ac-title-text, .elementor-tab-title a, .elementor-toggle-title").first().text() || $(it).find(".ct-ac-title, .elementor-tab-title").first().text());
      const a = $(it).find(".ct-ac-content, .elementor-tab-content").first();
      if (q) faq.push({ q, a: a.html()?.trim() || "" });
    });
    $(acc).replaceWith("<!--FAQ-->");
  });

  // Images: lazy data-src → new optimized file.
  const images = [];
  root.find("img").each((_, el) => {
    const $el = $(el);
    const raw = $el.attr("data-src") || $el.attr("src") || "";
    const p = raw.startsWith("http") ? new URL(raw).pathname : raw;
    const dest = imgByPath[p];
    if (!dest || dest === "/") return void $el.remove();
    const im = metaBySrc[dest];
    const attrs = { src: dest, alt: $el.attr("alt") || "", width: im?.width, height: im?.height };
    images.push(attrs);
    $el.replaceWith(`<img src="${attrs.src}" alt="${attrs.alt.replace(/"/g, "&quot;")}" width="${attrs.width}" height="${attrs.height}" loading="lazy" decoding="async">`);
  });

  // Links: absolute site links → relative.
  root.find("a").each((_, el) => {
    const $el = $(el);
    let href = $el.attr("href") || "";
    if (href.startsWith(BASE)) href = href.slice(BASE.length) || "/";
    if (href.startsWith("https://rotozest.com")) href = href.slice("https://rotozest.com".length) || "/";
    if (!href || href === "#") return void $el.replaceWith($el.html() || "");
    const keep = { href };
    if (/^https?:/.test(href)) Object.assign(keep, { rel: "noopener", target: "_blank" });
    $el.replaceWith(`<a ${Object.entries(keep).map(([k, v]) => `${k}="${v}"`).join(" ")}>${$el.html()}</a>`);
  });

  // Drop presentational wrappers and attributes.
  for (let i = 0; i < 12; i++) root.find("div,span,section,article,figure:not(:has(img)),font,center,header").each((_, el) => { $(el).replaceWith($(el).contents()); });
  root.find("*").each((_, el) => {
    const keep = el.name === "a" ? ["href", "rel", "target"] : el.name === "img" ? ["src", "alt", "width", "height", "loading", "decoding"] : el.name === "td" || el.name === "th" ? ["colspan", "rowspan"] : [];
    for (const a of Object.keys(el.attribs || {})) if (!keep.includes(a)) $(el).removeAttr(a);
  });
  root.find("p,h2,h3,h4,h5,h6,li,strong,em,b").each((_, el) => { if (!clean($(el).text()) && !$(el).find("img").length) $(el).remove(); });
  root.find("br").each((_, el) => { const p = $(el).parent(); if (p.is("h2,h3,h4,h5,h6") || !el.next || !el.prev) $(el).remove(); });

  let body = (root.html() || "")
    .replace(/<!--(?!FAQ)[\s\S]*?-->/g, "")
    .replace(/ /g, " ")
    .replace(/>\s+</g, "><")
    .replace(/(<\/(p|h\d|ul|ol|table|img)>)/g, "$1\n")
    .trim();
  // Remove headings that are the shared site chrome (brochure band, footer).
  body = body.replace(/<h3>Download Our Brochure Today!<\/h3>[\s\S]*$/, "").trim();

  // Dedupe identical consecutive blocks (Elementor desktop/tablet copies).
  const lines = body.split("\n"); const out = [];
  for (const l of lines) if (!out.length || out[out.length - 1] !== l) out.push(l);
  body = out.join("\n");

  const page = { path: u, meta, h1, html: body, faq, jsonld, images };
  fs.writeFileSync(`src/content/pages/${fname(u)}.json`, JSON.stringify(page, null, 1));
  const words = cheerio.load(body).text().split(/\s+/).filter(Boolean).length;
  console.log(`${u.padEnd(64)} words=${String(words).padStart(5)} faq=${faq.length} imgs=${images.length}`);
}
void decode;
