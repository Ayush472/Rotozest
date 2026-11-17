import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";

export type PageMeta = {
  title: string;
  description: string | null;
  canonical: string;
  robots: string | null;
  ogType: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogImageAlt: string | null;
  twitterCard: string | null;
  published: string | null;
  modified: string | null;
  section: string | null;
  readTime: string | null;
};
export type Faq = { q: string; a: string };
export type PageData = {
  path: string;
  meta: PageMeta;
  h1: string;
  html: string;
  faq: Faq[];
  jsonld: unknown[];
  images: { src: string; alt: string; width: number; height: number }[];
};

const DIR = path.join(process.cwd(), "src/content/pages");
const cache = new Map<string, PageData>();

/** Page content scraped from WordPress, by URL path (e.g. "/about-us/"). */
export function getPage(urlPath: string): PageData {
  const key = urlPath.replace(/^\/|\/$/g, "").replace(/\//g, "__") || "home";
  if (!cache.has(key)) cache.set(key, JSON.parse(fs.readFileSync(path.join(DIR, `${key}.json`), "utf8")));
  return cache.get(key)!;
}

export type Section = { level: number; title: string; html: string; text: string };

/**
 * Split imported HTML into heading-led sections so a page can lay them out
 * while keeping the exact WordPress wording. Text before the first heading
 * becomes a section with level 0.
 */
export function sectionize(html: string): Section[] {
  const $ = cheerio.load(`<main>${html}</main>`, null, false);
  const out: Section[] = [];
  let cur: { level: number; title: string; nodes: AnyNode[] } = { level: 0, title: "", nodes: [] };
  const flush = () => {
    const inner = cur.nodes.map((n) => $.html(n)).join("").trim();
    const text = cheerio.load(`<i>${inner}</i>`)("i").text().replace(/\s+/g, " ").trim();
    if (cur.title || text) out.push({ level: cur.level, title: cur.title, html: inner, text });
  };
  $("main")
    .contents()
    .each((_, n) => {
      if (n.type === "tag" && /^h[2-6]$/.test(n.name)) {
        flush();
        cur = { level: Number(n.name[1]), title: $(n).text().replace(/\s+/g, " ").trim(), nodes: [] };
      } else if (n.type === "comment") {
        // keep <!--FAQ--> position marker out of section bodies
      } else {
        cur.nodes.push(n);
      }
    });
  flush();
  return out;
}

/** Find a section by exact heading text (throws at build time if WordPress copy is missing). */
export function pick(sections: Section[], title: string): Section {
  const s = sections.find((x) => x.title === title);
  if (!s) throw new Error(`Section "${title}" not found`);
  return s;
}

/** Sections that follow the heading `from`, up to the next heading at the same or higher level. */
export function childrenOf(sections: Section[], from: string, opts: { until?: string } = {}): Section[] {
  const i = sections.findIndex((x) => x.title === from);
  if (i < 0) throw new Error(`Section "${from}" not found`);
  const res: Section[] = [];
  for (const s of sections.slice(i + 1)) {
    if (opts.until && s.title === opts.until) break;
    res.push(s);
  }
  return res;
}

/** Plain paragraph HTML for a section (falls back to wrapping loose text in <p>). */
export function bodyHtml(s: Section): string {
  return /^\s*</.test(s.html) ? s.html : `<p>${s.text}</p>`;
}

/** Remove duplicated sections that Elementor printed twice for desktop/mobile. */
export function uniqueByTitle(list: Section[]): Section[] {
  const seen = new Map<string, Section>();
  for (const s of list) {
    const prev = seen.get(s.title);
    if (!prev || s.text.length > prev.text.length) seen.set(s.title, s);
  }
  return [...seen.values()];
}

export function plain(html: string): string {
  return cheerio.load(`<i>${html}</i>`)("i").text().replace(/\s+/g, " ").trim();
}

export const blogPosts = [
  "/gear-pump-for-oil-transfer-complete-guide/",
  "/best-rotary-gear-pump-manufacturer-for-viscous-liquids-india/",
  "/benefits-of-using-ss-rotary-gear-pumps-in-chemical-industry/",
] as const;

export const landingPages = [
  "/chemical-transfer-pumps/",
  "/liquid-tomato-paste-transfer-pump/",
  "/fuel-oil-transfer-gear-pumps-manufacturer/",
  "/positive-displacement-gear-pump-manufacturer/",
  "/fluid-tech-systems-rotary-gear-pumps/",
  "/ss-rotary-gear-pump-manufacturer-mumbai/",
  "/external-rotary-gear-pump-manufacturer-india/",
] as const;
