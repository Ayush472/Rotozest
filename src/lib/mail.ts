import { Resend } from "resend";
import { site } from "./site";

// Shared by /api/inquiry and /api/brochure.
// Env: RESEND_API_KEY, MAIL_FROM ("Rotozest Industries <info@rotozest.com>", domain verified in Resend), optional MAIL_TO.

const hits = new Map<string, number[]>();
/** Simple per-instance limit: max `n` requests per IP per 10 minutes. */
export function limited(req: Request, n = 5) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > n;
}

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
export const field = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? "").trim().slice(0, max);
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export const fail = (error: string, status = 400) => Response.json({ error }, { status });
/** Honeypot filled or form sent faster than a person can type. */
export const looksLikeBot = (fd: FormData, minMs = 2500) => !!field(fd, "website") || Number(field(fd, "elapsed")) < minMs;

export function mailer() {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!key || !from) return null;
  return { resend: new Resend(key), from, team: process.env.MAIL_TO || site.email };
}

export const notConfigured = () => fail(`This is not available right now. Please email ${site.email} or call ${site.phones[0].label}.`, 503);

/** Two-column table of form fields for team notification emails. */
export function fieldsTable(rows: [string, string][]) {
  return `<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#5b6770;vertical-align:top">${esc(k)}</td><td style="padding:6px 12px;white-space:pre-wrap">${esc(v || "-")}</td></tr>`)
    .join("")}</table>`;
}
