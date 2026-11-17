// Compare SEO-critical parts of the new site with the WordPress pages.
// Usage: node scripts/seo-diff.mjs [newBase=http://localhost:3100] [oldHtmlDir=scrape/html]
// Old pages come from the saved scrape (or pass "live" to fetch www.rotozest.com).
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const NEW = process.argv[2] || "http://localhost:3100";
const OLD = process.argv[3] || "scrape/html";
const urls = fs.readFileSync("docs/migration/urls.txt", "utf8").split("\n").map((s) => s.trim()).filter(Boolean)
  .filter((u) => u !== "/how-to-make-a-simple-and-quick-firewood/");
const fname = (u) => u.replace(/^\/|\/$/g, "").replace(/\//g, "__") || "home";
const norm = (s) => (s || "").replace(/\s+/g, " ").replace(/[’‘]/g, "'").replace(/&amp;/g, "&").trim();
// Intended changes (documented in docs/migration/README.md)
const ALLOWED_DESC = new Set(["/blog/", "/category/industry/"]);
const CHROME_HEADINGS = new Set(["How To Make A Simple And Quick Firewood", "Recent Posts", "Recent Comments", "Search", "Gallery", "Tags", "Our Products", "Certifications", "Reach Us", "Download Our Brochure Today!"]);

async function load(u, which) {
  if (which === "old" && OLD !== "live") return fs.readFileSync(path.join(OLD, fname(u) + ".html"), "utf8");
  const base = which === "old" ? "https://www.rotozest.com" : NEW;
  const r = await fetch(base + u, { redirect: "manual" });
  if (r.status !== 200) throw new Error(`${which} ${u} → HTTP ${r.status}`);
  return r.text();
}

function facts(html, which) {
  const $ = cheerio.load(html);
  const meta = (k) => norm($(`meta[name="${k}"]`).attr("content") ?? $(`meta[property="${k}"]`).attr("content") ?? "");
  const ld = $('script[type="application/ld+json"]').map((_, s) => { try { return JSON.parse($(s).text()); } catch { return null; } }).get().flatMap((x) => (x?.["@graph"] ?? (Array.isArray(x) ? x : [x])));
  const types = new Set(ld.filter(Boolean).map((x) => x["@type"]));
  const faqQs = new Set(ld.filter((x) => x?.["@type"] === "FAQPage").flatMap((x) => x.mainEntity.map((q) => norm(q.name))));
  const scope = which === "old" ? $("#pagetitle, #primary").not("#secondary") : $("main");
  if (which === "old") $("#secondary, .elementor-hidden-desktop, script, style, noscript").remove();
  else $("main script, main style").remove();
  const headings = new Set(scope.find("h1,h2,h3,h4,h5,h6").map((_, h) => norm($(h).text())).get().filter((h) => h && !CHROME_HEADINGS.has(h)));
  const words = norm(scope.text()).split(" ").length;
  return {
    title: norm($("title").first().text()), description: meta("description"), canonical: $('link[rel="canonical"]').attr("href") || "",
    robots: meta("robots"), ogTitle: meta("og:title"), verification: meta("google-site-verification"),
    h1: norm($("h1").first().text()), h1count: $("h1").length, headings, types, faqQs, words,
  };
}

let fails = 0;
const rows = [];
for (const u of urls) {
  const [o, n] = [facts(await load(u, "old"), "old"), facts(await load(u, "new"), "new")];
  const issues = [];
  for (const k of ["title", "canonical", "robots", "ogTitle", "h1", "verification"]) if (o[k] !== n[k]) issues.push(`${k}: "${o[k]}" → "${n[k]}"`);
  if (o.description !== n.description && !ALLOWED_DESC.has(u)) issues.push(`description changed`);
  if (n.h1count !== 1) issues.push(`h1 count ${n.h1count}`);
  for (const t of o.types) if (!n.types.has(t)) issues.push(`schema missing: ${t}`);
  for (const q of o.faqQs) if (!n.faqQs.has(q)) issues.push(`FAQ missing: ${q.slice(0, 60)}`);
  const lost = [...o.headings].filter((h) => !n.headings.has(h));
  if (lost.length) issues.push(`headings missing (${lost.length}): ${lost.slice(0, 6).join(" | ")}`);
  const ratio = n.words / o.words;
  rows.push(`${u.padEnd(62)} words ${String(o.words).padStart(5)}→${String(n.words).padEnd(5)} (${(ratio * 100).toFixed(0)}%) schema [${[...n.types].join(",")}] ${issues.length ? "✗" : "✓"}`);
  if (issues.length) { fails++; rows.push(...issues.map((i) => "    - " + i)); }
}
console.log(rows.join("\n"));
console.log(fails ? `\n${fails} page(s) with differences` : "\nAll pages match on SEO-critical fields.");
process.exitCode = fails ? 1 : 0;
