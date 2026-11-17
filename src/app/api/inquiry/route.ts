import { Resend } from "resend";
import { site } from "@/lib/site";

// Inquiry + careers forms → email to info@rotozest.com via Resend.
// Env: RESEND_API_KEY, MAIL_FROM (e.g. "Rotozest Website <website@rotozest.com>", domain verified in Resend),
// optional MAIL_TO (defaults to info@rotozest.com).

export const runtime = "nodejs";

const MAX_FILE = 5 * 1024 * 1024;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const str = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? "").trim().slice(0, max);
const bad = (error: string, status = 400) => Response.json({ error }, { status });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return bad("Too many messages. Please call us instead.", 429);

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return bad("Invalid form.");
  }
  // Bots: honeypot filled, or submitted faster than a person can type.
  if (str(fd, "website") || Number(str(fd, "elapsed")) < 2500) return Response.json({ ok: true });

  const kind = str(fd, "kind") === "careers" ? "careers" : "inquiry";
  const email = str(fd, "your-email", 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Please enter a valid email address.");

  const fields: [string, string][] =
    kind === "inquiry"
      ? [["Name", str(fd, "your-name", 120)], ["Email", email], ["Phone", str(fd, "your-number", 40)], ["Requirement", str(fd, "your-subject", 200)], ["Message", str(fd, "your-message", 5000)]]
      : [["First name", str(fd, "your-firstname", 80)], ["Last name", str(fd, "your-lastname", 80)], ["Email", email], ["Phone", str(fd, "your-number", 40)], ["Address", str(fd, "your-address", 300)], ["City", str(fd, "your-city", 80)], ["State", str(fd, "your-state", 80)]];
  if (fields.some(([, v]) => !v)) return bad("Please fill in every field.");

  const attachments: { filename: string; content: Buffer }[] = [];
  if (kind === "careers") {
    const file = fd.get("file-445");
    if (!(file instanceof File) || file.size === 0) return bad("Please attach your CV.");
    if (file.size > MAX_FILE) return bad("CV must be 5 MB or smaller.");
    if (!/\.(pdf|docx?)$/i.test(file.name)) return bad("CV must be a PDF or Word file.");
    attachments.push({ filename: file.name.replace(/[^\w.\- ]/g, "_"), content: Buffer.from(await file.arrayBuffer()) });
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!key || !from) {
    console.error("[inquiry] RESEND_API_KEY or MAIL_FROM not set");
    return bad(`Our form is not available right now. Please email ${site.email} or call ${site.phones[0].label}.`, 503);
  }

  const page = str(fd, "page", 200);
  const name = kind === "inquiry" ? fields[0][1] : `${fields[0][1]} ${fields[1][1]}`;
  const subject = kind === "inquiry" ? `Website inquiry: ${fields[3][1]} (${name})` : `Job application: ${name}`;
  const rows = fields.map(([k, v]) => `<tr><td style="padding:6px 12px;color:#5b6770;vertical-align:top">${k}</td><td style="padding:6px 12px;white-space:pre-wrap">${esc(v)}</td></tr>`).join("");
  const html = `<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows}<tr><td style="padding:6px 12px;color:#5b6770">Page</td><td style="padding:6px 12px">${esc(page)}</td></tr></table>`;
  const text = fields.map(([k, v]) => `${k}: ${v}`).join("\n") + `\nPage: ${page}`;

  const resend = new Resend(key);
  const { error } = await resend.emails.send({ from, to: process.env.MAIL_TO || site.email, replyTo: email, subject, html, text, attachments });
  if (error) {
    console.error("[inquiry] resend error", error);
    return bad(`Could not send right now. Please email ${site.email}.`, 502);
  }
  return Response.json({ ok: true });
}
