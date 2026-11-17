import { Droplets, Factory, FlaskConical, Fuel, Milk, Paintbrush, Pill, Shirt, Sparkles, Sprout, Stethoscope, Candy, Cog, UtensilsCrossed, Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { Award, BadgeCheck, Handshake, Leaf, Lightbulb, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { site } from "@/lib/site";
import { InquiryForm } from "./InquiryForm";
import { MapFacade } from "./MapFacade";
import { SectionHead } from "./ui";
import { InquireButton } from "./InquiryPopup";

export const industryIcons: Record<string, LucideIcon> = {
  "Oil and Gas": Fuel,
  "Chemical Processing": FlaskConical,
  Pharmaceuticals: Pill,
  "Food and Beverage": UtensilsCrossed,
  Agriculture: Sprout,
  "Paints and Dyes": Paintbrush,
  "Lubrication Systems": Droplets,
  "Cosmetics Industry": Sparkles,
  "Cosmetics and Personal Care": Sparkles,
  "Medical Industry": Stethoscope,
  "Dairy Industry": Milk,
  "Sugar Industry": Candy,
  "Textile Industry": Shirt,
};
export const iconFor = (t: string): LucideIcon => industryIcons[t] ?? Cog;

/** One distinct icon per core value (About + Careers). */
export const valueIcons: Record<string, LucideIcon> = {
  "Quality First": BadgeCheck,
  Innovation: Lightbulb,
  "Customer Focus": Handshake,
  Integrity: ShieldCheck,
  Sustainability: Leaf,
  Excellence: Award,
  Collaboration: Users,
};
export { Factory };

export const testimonials = [
  { name: "Akash Kharde", text: "I had an excellent experience with this company. They assisted me in purchasing pumps, providing top-quality products and outstanding service. The delivery was exceptionally fast. While their payment terms require advance payment, they are always available to take calls and promptly address any issues with the pumps." },
  { name: "Om Solanki", text: "I used a pump from that company and had a very good experience with their services. Highly recommend!" },
  { name: "Raviteja Padma", text: "I have ordered a gear pump & they are have best quality of product and having best service support" },
  { name: "Dhrumil Patel", text: "Rotozest industries excel at producing excellent products and great services." },
  { name: "Vedu Patel", text: "Best rotary gear pumps provide in the market" },
];

/** "Our Clients Say": one lead quote, the rest as a compact list (no carousel JS). */
export function Testimonials() {
  const [lead, ...rest] = testimonials;
  return (
    <section className="bg-surface">
      <div className="wrap grid gap-12 py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <SectionHead title="Our Clients Say" />
          <figure className="mt-8">
            <blockquote className="font-display text-[1.6rem] leading-snug text-steel sm:text-[1.9rem]">
              <span aria-hidden className="mr-1 text-brand">“</span>
              {lead.text}
            </blockquote>
            <figcaption className="mt-5 font-medium text-steel">
              {lead.name} <span className="text-muted">· ★★★★★</span>
            </figcaption>
          </figure>
        </div>
        <ul className="grid content-start gap-px self-end overflow-hidden rounded-md border border-line bg-line">
          {rest.map((t) => (
            <li key={t.name} className="bg-white p-6">
              <p className="text-steel">“{t.text}”</p>
              <p className="mt-2 text-[0.95rem] text-muted">
                {t.name} <span aria-label="5 out of 5 stars">★★★★★</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Inquiry form + address + map, used on home, contact and product pages. */
export function ContactBlock({ title = "Got Questions? Let’s Get In Touch!", intro, requirement, titleAs = "h2" }: { title?: string; intro?: string; requirement?: string; titleAs?: "h2" | "h3" }) {
  return (
    <section id="inquiry" className="wrap scroll-mt-28 py-20">
      <SectionHead title={title} as={titleAs} intro={intro ?? "If you have any questions about our products, don’t hesitate to reach out. We’re here to assist and will get back to you as soon as possible."} />
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div className="rounded-md border border-line p-6 sm:p-8">
          <InquiryForm requirement={requirement} />
        </div>
        <div className="grid gap-6">
          <ul className="grid gap-4 text-steel">
            {site.phones.map((p) => (
              <li key={p.href}>
                <a href={p.href} className="inline-flex items-center gap-3 font-display text-xl font-semibold hover:text-brand-ink">
                  <Phone className="size-5 text-brand-ink" aria-hidden /> {p.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-3 hover:text-brand-ink">
                <Mail className="size-5 text-brand-ink" aria-hidden /> {site.email}
              </a>
            </li>
            <li className="inline-flex gap-3">
              <MapPin className="mt-1 size-5 shrink-0 text-brand-ink" aria-hidden />
              <a href={site.mapLink} target="_blank" rel="noopener" className="hover:text-brand-ink">{site.address.oneLine}</a>
            </li>
            <li className="inline-flex items-center gap-3 text-muted">
              <Clock className="size-5 text-brand-ink" aria-hidden /> {site.hours}
            </li>
          </ul>
          <MapFacade />
        </div>
      </div>
    </section>
  );
}

/** Thumb-reach call / WhatsApp / inquire bar on phones. */
export function MobileActionBar() {
  return (
    <nav aria-label="Quick contact" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-line bg-white text-[0.95rem] font-medium text-steel md:hidden">
      <a href={site.phones[0].href} className="flex flex-col items-center gap-1 py-2.5">
        <Phone className="size-5 text-brand-ink" aria-hidden /> Call
      </a>
      <a href={site.whatsapp} target="_blank" rel="noopener" className="flex flex-col items-center gap-1 border-x border-line py-2.5">
        <MessageCircle className="size-5 text-brand-ink" aria-hidden /> WhatsApp
      </a>
      <InquireButton className="flex flex-col items-center gap-1 bg-brand py-2.5 font-display text-base font-semibold text-white">
        <Mail className="size-5" aria-hidden /> Inquire Now
      </InquireButton>
    </nav>
  );
}
