import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Factory, Globe2, Handshake, Headset, Lightbulb, PackageCheck, PencilRuler, Phone } from "lucide-react";
import { getPage } from "@/lib/content";
import { legacyJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { GearLines } from "@/components/Gear";
import { FaqList, JsonLd, SectionHead } from "@/components/ui";
import { ContactBlock, Testimonials, iconFor } from "@/components/sections";
import hero from "../../public/images/16.webp";
import ciPump from "../../public/images/17.webp";
import aboutCollage from "../../public/images/about-us.webp";
import ce from "../../public/images/ce.webp";
import geac from "../../public/images/geac.webp";
import ricl from "../../public/images/ricl.webp";
import uaf from "../../public/images/uaf.webp";
import { BrochureButton } from "@/components/BrochureButton";
import { InquireButton } from "@/components/InquiryPopup";
import { CountUp } from "@/components/Motion";

export const metadata = pageMetadata("/");

const steps = [
  { t: "Design & Customization", icon: PencilRuler, d: "Begin with understanding customer requirements and application needs." },
  { t: "Manufacturing & Quality Control", icon: Factory, d: "Manufacture pumps using high-grade materials and state-of-the-art machinery." },
  { t: "Packaging & Timely Delivery", icon: PackageCheck, d: "Carefully package pumps to prevent any damage during transit." },
  { t: "Comprehensive After-Sales Support", icon: Headset, d: "Provide installation guidance, maintenance tips, and technical assistance." },
];

const why = [
  { t: "Innovation", icon: Lightbulb, d: "Our strong commitment to excellence ensures that we consistently meet clients’ evolving demands with utmost precision, superior reliability, and the latest technology, driving innovation and long-term success in the industry." },
  { t: "Superior Quality", icon: BadgeCheck, d: "We ensuring every product from our facility is meticulously crafted with precision, excellence and innovation to deliver and superior performance, reliability and durability in the most demanding environments." },
  { t: "Customer Focus", icon: Handshake, d: "Our success is built on strong, long customer relationships. We work closely with our valued clients to understand their unique requirements and provide fully customized solutions that exceed expectations." },
  { t: "Global Reach", icon: Globe2, d: "We serve many industries worldwide, also delivering highly reliable, efficient, and affordable solutions. Our commitment to quality has established us as a trusted and leading name in the rotary gear pump industry." },
];

const applications = ["Oil and Gas", "Chemical Processing", "Pharmaceuticals", "Food and Beverage", "Agriculture", "Paints and Dyes"];

export default function Home() {
  const page = getPage("/");
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface">
        <div className="wrap grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div className="relative z-10" data-reveal>
            <p className="font-display text-xl font-medium text-brand-ink">Built with Integrity, Delivered with Quality</p>
            <h1 className="mt-3 text-[2.5rem] leading-[1.05] sm:text-[3.2rem] lg:text-[3.7rem]">{page.h1}</h1>
            <p className="mt-6 max-w-xl text-lg">
              Cast Iron (CI) and Stainless Steel (SS) rotary gear pumps, manufactured in Ahmedabad and supplied across India. Reliable solution for various industries.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <InquireButton className="btn-primary">
                Inquire Now <ArrowRight className="size-5" aria-hidden />
              </InquireButton>
              <BrochureButton className="btn-ghost" label="Download Brochure" />
            </div>
            <a href={site.phones[0].href} className="mt-6 inline-flex items-center gap-2 font-display text-lg font-semibold text-steel hover:text-brand-ink">
              <Phone className="size-5 text-brand-ink" aria-hidden /> {site.phones[0].label}
            </a>
          </div>
          <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[560px]">
            <GearLines className="absolute -inset-[12%] text-brand/35" />
            <Image src={hero} alt="SS Rotary Gear Pump" priority sizes="(min-width: 1024px) 560px, 92vw" className="rz-float relative mix-blend-multiply" />
          </div>
        </div>
      </section>

      {/* About intro */}
      <section className="wrap grid gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Image src={aboutCollage} alt="Rotozest Industries" sizes="(min-width: 1024px) 480px, 92vw" className="mx-auto w-full max-w-[460px]" data-reveal />
        <div data-reveal style={{ "--d": "120ms" } as React.CSSProperties}>
          <SectionHead title="Rotary gear pumps built for real industrial work" />
          <div className="mt-6 space-y-4 text-[1.06rem]">
            <p>At Rotozest, we pride ourselves on being one of the leading manufacturers and suppliers of high-quality Cast Iron (CI) and Stainless Steel (SS) rotary gear pumps. With a legacy of excellence and a commitment to precision, we serve industries with durable, reliable, and efficient pump solutions that enhance productivity and performance.</p>
            <p>Founded with the vision of delivering top-notch pumping solutions, Rotozest is a name trusted by industries for its cutting-edge technology and robust products. Under the leadership of Hitesh Bhai Patel, Bharat Bhai Patel, and Raj Bhai Patel, we have consistently grown by offering innovative and efficient rotary gear pumps that cater to a variety of industrial applications.</p>
            <p>Our dedication to superior quality, customer-centric service, and technological innovation makes us a preferred choice in the market. Whether you require pumps for transferring viscous fluids, oil, or chemicals, we have the solution tailored to your needs.</p>
          </div>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6">
            {[
              ["525+", "Projects Done"],
              ["500+", "Satisfied Clients"],
              ["25+", "Staff Members"],
              ["100%", "After Sales Support"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="text-[0.95rem] text-muted">{l}</dt>
                <dd className="font-display text-3xl font-semibold text-steel">
                  <CountUp value={n} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Products */}
      <section className="bg-iron text-white">
        <div className="wrap py-20">
          <SectionHead title="Our Products" light />
          <div className="mt-12 grid gap-px overflow-hidden rounded-md bg-white/10 md:grid-cols-2">
            {[
              { img: hero, alt: "SS Rotary Gear Pump", title: "SS Rotary Gear Pumps", href: "/ss-rotary-gear-pump/", text: "Our Stainless Steel (SS) rotary gear pumps are corrosion-resistant, making them ideal for industries requiring hygiene and precision. These pumps are perfect for applications involving corrosive fluids, chemicals, and food-grade materials, ensuring longevity and reliability.", tags: ["Corrosion-resistant", "Food-grade", "Chemicals"] },
              { img: ciPump, alt: "CI Rotary Gear Pump Supplier", title: "CI Rotary Gear Pumps", href: "/ci-rotary-gear-pump/", text: "Known for their excellent performance and durability, our Cast Iron (CI) rotary gear pumps are designed for a wide range of applications. They provide efficient, reliable, and cost-effective solutions for industries handling oils, syrups, and viscous liquids.", tags: ["Oils & lubricants", "Viscous liquids", "Cost-effective"] },
            ].map((p) => (
              <article key={p.href} className="group flex flex-col bg-iron" data-reveal>
                <div className="flex h-64 items-center justify-center overflow-hidden bg-[#e9ecee] sm:h-80">
                  <Image src={p.img} alt={p.alt} sizes="(min-width: 768px) 320px, 70vw" className="h-full w-auto object-contain mix-blend-multiply" />
                </div>
                <div className="flex flex-col p-7">
                  <h3 className="text-[1.8rem] text-white">{p.title}</h3>
                  <p className="mt-3 text-white/75">{p.text}</p>
                  <ul className="mt-5 flex flex-wrap gap-2 text-[0.9rem] text-white/85">
                    {p.tags.map((t) => (
                      <li key={t} className="rounded-sm border border-white/20 px-2.5 py-1">{t}</li>
                    ))}
                  </ul>
                  <Link href={p.href} className="mt-6 inline-flex items-center gap-2 self-start font-display text-lg font-semibold text-brand hover:text-white">
                    Read More <ArrowRight className="size-5" aria-hidden />
                    <span className="sr-only">about {p.title}</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-white/70">Each pump we manufacture undergoes rigorous quality checks to ensure superior performance and durability, meeting the highest industry standards.</p>
        </div>
      </section>

      {/* Process */}
      <section className="wrap py-20">
        <SectionHead title="See How Does It Work" />
        <ol className="relative mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
          <span aria-hidden className="absolute left-[27px] top-2 bottom-2 w-px bg-line md:left-0 md:right-0 md:top-[27px] md:bottom-auto md:h-px md:w-auto" />
          {steps.map((s, i) => (
            <li key={s.t} className="relative grid content-start grid-cols-[56px_1fr] gap-4 md:grid-cols-1" data-reveal style={{ "--d": `${i * 110}ms` } as React.CSSProperties}>
              <span className="relative grid size-14 place-items-center rounded-full bg-brand text-white ring-8 ring-white">
                <s.icon className="size-6" strokeWidth={1.8} aria-hidden />
                <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-steel font-display text-[0.8rem] font-bold leading-none text-white">{i + 1}</span>
              </span>
              <div>
                <h3 className="text-[1.35rem]">{s.t}</h3>
                <p className="mt-2 text-muted">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Why choose */}
      <section className="border-y border-line bg-surface">
        <div className="wrap py-20">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <span className="eyebrow-rule mx-auto" aria-hidden />
            <h2 className="text-[2rem] sm:text-[2.5rem]">Why Choose Rotozest?</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((w, i) => (
              <div key={w.t} className="lift rounded-md border border-line bg-white p-7 hover:border-brand/50" data-reveal style={{ "--d": `${i * 100}ms` } as React.CSSProperties}>
                <span className="grid size-14 place-items-center rounded-md bg-brand/10 text-brand">
                  <w.icon className="size-8" strokeWidth={1.6} aria-hidden />
                </span>
                <h3 className="mt-5 text-[1.4rem]">{w.t}</h3>
                <p className="mt-3 text-[0.98rem] text-muted">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Applications */}
      <section className="wrap py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHead title="Applications" intro="Industries" />
          <Link href="/applications/" className="inline-flex items-center gap-2 font-display text-lg font-semibold text-brand-ink hover:text-steel">
            All 12 industries <ArrowRight className="size-5" aria-hidden />
          </Link>
        </div>
        <ul className="mt-10 grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 lg:grid-cols-6">
          {applications.map((a) => {
            const Icon = iconFor(a);
            return (
              <li key={a} className="lift border-b border-r border-line bg-white p-6" data-reveal>
                <Icon className="size-8 text-brand-ink" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-4 text-[1.2rem]">{a}</h3>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Certifications */}
      <section className="bg-surface">
        <div className="wrap grid gap-10 py-16 lg:grid-cols-[1fr_2fr] lg:items-center">
          <SectionHead title="International Certifications" />
          <div className="grid gap-8 sm:grid-cols-2">
            {[
              { t: "CE Certifications", imgs: [{ img: geac, alt: "GEAC" }, { img: ce, alt: "CE" }] },
              { t: "ISO Certifications", imgs: [{ img: ricl, alt: "RICL" }, { img: uaf, alt: "UAF" }] },
            ].map((g) => (
              <div key={g.t}>
                <h3 className="text-[1.25rem]">{g.t}</h3>
                <div className="mt-4 flex gap-4">
                  {g.imgs.map((c) => (
                    <div key={c.alt} className="rounded-md bg-white p-3">
                      <Image src={c.img} alt={c.alt} sizes="112px" className="size-24 object-contain sm:size-28" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactBlock />

      <section className="bg-surface">
        <div className="wrap grid gap-10 py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHead title="Frequently Asked Questions (FAQs)" />
          <FaqList items={page.faq} />
        </div>
      </section>

      <JsonLd data={[...legacyJsonLd("/"), websiteJsonLd()]} />
    </>
  );
}
