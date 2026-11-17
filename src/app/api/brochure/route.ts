import { brochureEmail } from "@/lib/email/brochure-email";
import { fail, field, fieldsTable, isEmail, limited, looksLikeBot, mailer, notConfigured } from "@/lib/mail";
import { SITE_URL, site } from "@/lib/site";

// Brochure request: email the visitor the branded brochure email (PDF attached)
// and tell the team about the new lead.
export const runtime = "nodejs";

// Resend fetches the attachment from this public URL (serverless functions don't bundle /public).
const BROCHURE_URL = (process.env.BROCHURE_URL || SITE_URL + site.brochure).trim();

export async function POST(req: Request) {
  if (limited(req, 4)) return fail("Too many requests. Please try again in a few minutes.", 429);
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return fail("Invalid form.");
  }
  if (looksLikeBot(fd, 1500)) return Response.json({ ok: true });

  const email = field(fd, "email", 200);
  if (!isEmail(email)) return fail("Please enter a valid email address.");
  const name = field(fd, "name", 120);
  const phone = field(fd, "phone", 40);
  const company = field(fd, "company", 160);
  const page = field(fd, "page", 200);

  const m = mailer();
  if (!m) return notConfigured();

  const mail = brochureEmail(name);
  const sent = await m.resend.emails.send({
    from: m.from,
    to: email,
    replyTo: site.email,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    attachments: [{ filename: "Rotozest-Industries-Brochure.pdf", path: BROCHURE_URL }],
  });
  if (sent.error) {
    console.error("[brochure] resend error", sent.error);
    return fail(`We could not send the email. Please write to ${site.email}.`, 502);
  }

  // Lead notification for the team (failure here should not fail the visitor's request).
  const lead = await m.resend.emails.send({
    from: m.from,
    to: m.team,
    replyTo: email,
    subject: `Brochure download: ${name || email}${company ? ` (${company})` : ""}`,
    html: `<p style="font-family:Arial,sans-serif">Someone downloaded the brochure on rotozest.com.</p>${fieldsTable([["Name", name], ["Email", email], ["Phone", phone], ["Company", company], ["Page", page]])}`,
    text: `Brochure download\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nPage: ${page}`,
  });
  if (lead.error) console.error("[brochure] team notify failed", lead.error);

  return Response.json({ ok: true });
}
