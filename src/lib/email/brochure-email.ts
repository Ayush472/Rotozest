import { SITE_URL, site } from "../site";
import { esc } from "../mail";

// Branded "here is your brochure" email. Table layout + inline styles so it
// renders in Gmail, Outlook and Apple Mail; images are JPG/PNG (not WebP).

const C = { blue: "#00A0E3", steel: "#0E2A3B", body: "#363636", muted: "#5B6770", surface: "#EEF3F6", line: "#D6E0E6" };
const font = "font-family:Arial,Helvetica,sans-serif";
const abs = (p: string) => SITE_URL + p;

const button = (href: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${C.blue}" style="border-radius:4px"><a href="${href}" style="display:inline-block;padding:14px 26px;${font};font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:4px">${label}</a></td></tr></table>`;

const product = (img: string, title: string, text: string, href: string) => `
<td class="col" width="50%" valign="top" style="padding:8px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${C.line};border-radius:6px">
    <tr><td bgcolor="#ECEFF1" align="center" style="padding:12px;border-radius:6px 6px 0 0"><img src="${abs(img)}" width="220" alt="${esc(title)}" style="display:block;width:100%;max-width:220px;height:auto;border:0"></td></tr>
    <tr><td style="padding:16px 16px 18px;${font}">
      <p style="margin:0 0 6px;font-size:18px;font-weight:bold;color:${C.steel}">${title}</p>
      <p style="margin:0 0 12px;font-size:14px;line-height:21px;color:${C.body}">${text}</p>
      <a href="${abs(href)}" style="font-size:14px;font-weight:bold;color:${C.blue};text-decoration:none">View product &rarr;</a>
    </td></tr>
  </table>
</td>`;

export function brochureEmail(name: string) {
  const hi = name ? `Hello ${esc(name.split(" ")[0])},` : "Hello,";
  const brochureUrl = abs(site.brochure);
  const industries = ["Oil and Gas", "Chemical Processing", "Pharmaceuticals", "Food and Beverage", "Agriculture", "Paints and Dyes", "Lubrication Systems", "Cosmetics", "Dairy", "Sugar", "Textile"];

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Your Rotozest brochure</title>
<style>@media (max-width:600px){.col{display:block!important;width:100%!important}.px{padding-left:20px!important;padding-right:20px!important}}</style></head>
<body style="margin:0;padding:0;background:${C.surface}">
<div style="display:none;max-height:0;overflow:hidden">Your Rotozest Industries brochure: SS and CI rotary gear pumps, made in Ahmedabad.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.surface}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden">

  <tr><td class="px" style="padding:28px 36px 20px;border-bottom:4px solid ${C.blue}">
    <a href="${SITE_URL}/"><img src="${abs("/email/rotozest-logo.png")}" width="170" alt="Rotozest Industries" style="display:block;border:0;width:170px;height:auto"></a>
  </td></tr>

  <tr><td class="px" style="padding:32px 36px 8px;${font}">
    <p style="margin:0 0 14px;font-size:16px;color:${C.body}">${hi}</p>
    <h1 style="margin:0 0 14px;font-size:26px;line-height:32px;color:${C.steel}">Thank you for your interest in Rotozest. Your brochure is attached.</h1>
    <p style="margin:0 0 22px;font-size:15px;line-height:24px;color:${C.body}">You can also open it any time with the button below. It covers our Stainless Steel (SS) and Cast Iron (CI) rotary gear pumps, models, sizes and the industries we serve.</p>
    ${button(brochureUrl, "Download the brochure (PDF)")}
  </td></tr>

  <tr><td class="px" style="padding:30px 36px 6px;${font}">
    <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:${C.blue}">About Rotozest Industries</p>
    <p style="margin:0;font-size:15px;line-height:24px;color:${C.body}">Rotozest is a manufacturer and supplier of high-quality Cast Iron (CI) and Stainless Steel (SS) rotary gear pumps, based in Ahmedabad, Gujarat, with supply across India. Every pump is built from high-grade materials and goes through rigorous quality checks before it leaves our facility.</p>
  </td></tr>

  <tr><td class="px" style="padding:18px 28px 6px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      ${product("/email/ss-rotary-gear-pump.jpg", "SS Rotary Gear Pump", "Corrosion-resistant and food-grade, for chemicals, pharmaceuticals, food and cosmetics.", "/ss-rotary-gear-pump/")}
      ${product("/email/ci-rotary-gear-pump.jpg", "CI Rotary Gear Pump", "Durable and cost-effective, for oils, lubricants, syrups and other viscous liquids.", "/ci-rotary-gear-pump/")}
    </tr></table>
  </td></tr>

  <tr><td class="px" style="padding:22px 36px 6px;${font}">
    <p style="margin:0 0 10px;font-size:13px;font-weight:bold;color:${C.blue}">Why industries choose Rotozest</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-size:15px;line-height:22px;color:${C.body}">
      ${[
        ["Design &amp; customization", "pumps built around your fluid, flow rate and pressure"],
        ["Quality control", "high-grade materials and testing on every pump"],
        ["Timely delivery", "careful packaging and dispatch across India"],
        ["After-sales support", "installation guidance, maintenance tips and technical help"],
      ]
        .map(([t, d]) => `<tr><td valign="top" style="padding:4px 10px 4px 0;color:${C.blue};font-weight:bold">&#10003;</td><td style="padding:4px 0"><strong style="color:${C.steel}">${t}</strong>: ${d}</td></tr>`)
        .join("")}
    </table>
  </td></tr>

  <tr><td class="px" style="padding:22px 36px 6px;${font}">
    <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:${C.blue}">Industries we serve</p>
    <p style="margin:0;font-size:14px;line-height:22px;color:${C.muted}">${industries.join(" &middot; ")}</p>
    <p style="margin:12px 0 0;font-size:14px;line-height:22px;color:${C.muted}">Certified: CE &middot; ISO (GEAC, RICL, UAF)</p>
  </td></tr>

  <tr><td class="px" style="padding:28px 36px 30px;${font}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.steel}" style="border-radius:6px"><tr><td style="padding:22px 24px;${font}">
      <p style="margin:0 0 6px;font-size:18px;font-weight:bold;color:#ffffff">Need help choosing a pump?</p>
      <p style="margin:0 0 16px;font-size:14px;line-height:22px;color:#c9d6de">Reply to this email with your fluid, flow rate and pressure, or call us. We usually reply the same working day.</p>
      <p style="margin:0;font-size:15px;line-height:26px">
        <a href="${site.phones[0].href}" style="color:#ffffff;text-decoration:none;font-weight:bold">${site.phones[0].label}</a>
        <span style="color:#5d7686">&nbsp;|&nbsp;</span>
        <a href="${site.whatsapp}" style="color:${C.blue};text-decoration:none;font-weight:bold">WhatsApp us</a>
        <span style="color:#5d7686">&nbsp;|&nbsp;</span>
        <a href="${SITE_URL}/contact-us/" style="color:${C.blue};text-decoration:none;font-weight:bold">Inquire Now</a>
      </p>
    </td></tr></table>
  </td></tr>

  <tr><td class="px" style="padding:20px 36px 28px;border-top:1px solid ${C.line};${font};font-size:12px;line-height:19px;color:${C.muted}">
    <strong style="color:${C.steel}">Rotozest Industries</strong><br>
    ${esc(site.address.oneLine)}<br>
    <a href="mailto:${site.email}" style="color:${C.muted}">${site.email}</a> &middot; ${site.phones.map((p) => p.label).join(" &middot; ")}<br>
    <a href="${SITE_URL}/" style="color:${C.muted}">www.rotozest.com</a> &middot; <a href="${site.social.instagram}" style="color:${C.muted}">Instagram</a> &middot; <a href="${site.social.facebook}" style="color:${C.muted}">Facebook</a><br><br>
    You received this email because you asked for our brochure on rotozest.com. We will not add you to a mailing list.
  </td></tr>

</table></td></tr></table></body></html>`;

  const text = `${hi.replace(/&#39;/g, "'")}

Thank you for your interest in Rotozest. Your brochure is attached.
Download it any time: ${brochureUrl}

About Rotozest Industries
Manufacturer and supplier of Cast Iron (CI) and Stainless Steel (SS) rotary gear pumps, based in Ahmedabad, Gujarat, with supply across India.

SS Rotary Gear Pump: ${abs("/ss-rotary-gear-pump/")}
CI Rotary Gear Pump: ${abs("/ci-rotary-gear-pump/")}

Inquire now: reply to this email or call ${site.phones[0].label}. WhatsApp: ${site.whatsapp}

Rotozest Industries
${site.address.oneLine}
${site.email} | ${site.phones.map((p) => p.label).join(" | ")}
www.rotozest.com`;

  return { subject: "Your Rotozest Industries brochure", html, text };
}
