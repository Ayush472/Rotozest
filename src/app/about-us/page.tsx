import Image from "next/image";
import { childrenOf, getPage, pick, sectionize } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Html, PageHero, SectionHead } from "@/components/ui";
import { Testimonials, valueIcons } from "@/components/sections";
import { ScrollItem, ScrollRow } from "@/components/ScrollRow";
import i16 from "../../../public/images/16.webp";
import i11 from "../../../public/images/11.webp";
import i12 from "../../../public/images/12-1.webp";
import i13 from "../../../public/images/13.webp";
import i14 from "../../../public/images/14.webp";
import i15 from "../../../public/images/15.webp";
import i17 from "../../../public/images/17.webp";

export const metadata = pageMetadata("/about-us/");


const gallery = [
  { img: i16, alt: "SS Rotary Gear Pump" },
  { img: i11, alt: "SS Rotary Gear Pump Suppliers" },
  { img: i12, alt: "SS Rotary Gear Pump Dealer" },
  { img: i13, alt: "SS Rotary Gear Pump Supplier" },
  { img: i14, alt: "SS Rotary Gear Pump Manufacturer" },
  { img: i15, alt: "Stainless Steel Rotary Gear Pump" },
  { img: i17, alt: "CI Rotary Gear Pump Supplier" },
];

function ValueIcon({ title, className }: { title: string; className?: string }) {
  const Icon = valueIcons[title];
  return Icon ? <Icon className={className} strokeWidth={1.6} aria-hidden /> : null;
}

export default function Page() {
  const page = getPage("/about-us/");
  const s = sectionize(page.html);
  const lead = pick(s, "Precision, Innovation, Reliability");
  const expertise = pick(s, "Our Expertise");
  const vision = pick(s, "Vision");
  const mission = pick(s, "Mission");
  const values = childrenOf(s, "Our Core Value", { until: "Why Choose Rotozest?" });
  const why = childrenOf(s, "Why Choose Rotozest?", { until: "Our Clients Say" });

  return (
    <>
      <PageHero h1={page.h1} crumbs={[{ name: "Home", path: "/" }, { name: "About Us", path: "/about-us/" }]} />

      <section className="wrap grid gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div>
          <SectionHead title={lead.title} />
          {/* text only: the WordPress section also held the photo gallery, shown as a strip further down */}
          <Html html={(lead.html.match(/<p>[\s\S]*?<\/p>/g) ?? []).join("")} className="prose-rz mt-6 text-lg" />
        </div>
        <div className="mx-auto w-full max-w-[420px] self-start rounded-md bg-[#eceff1]">
          <Image src={gallery[0].img} alt={gallery[0].alt} priority sizes="(min-width: 1024px) 420px, 92vw" className="mx-auto mix-blend-multiply" />
        </div>
      </section>

      <section className="bg-surface">
        <div className="wrap grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHead title={expertise.title} />
          <Html html={expertise.html} className="prose-rz" />
        </div>
      </section>

      <section className="wrap grid gap-px overflow-hidden py-16 md:grid-cols-2 md:gap-12 lg:py-20">
        {[vision, mission].map((v) => (
          <div key={v.title} className="border-l-4 border-brand pl-6">
            <h3 className="text-[2rem]">{v.title}</h3>
            <Html html={v.html} className="prose-rz mt-4" />
          </div>
        ))}
      </section>

      <section className="bg-steel text-white">
        <div className="wrap py-20">
          <SectionHead title="Our Core Value" light />
          <ScrollRow label="Our core values" light>
            {values.map((v) => (
              <ScrollItem key={v.title} className="rounded-md border border-white/15 p-6">
                <ValueIcon title={v.title} className="size-8 text-brand" />
                <h3 className="mt-4 text-[1.35rem] text-white">{v.title}</h3>
                <p className="mt-2 text-[0.98rem] text-white/70">{v.text}</p>
              </ScrollItem>
            ))}
          </ScrollRow>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="wrap grid gap-12 py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHead title="Why Choose Rotozest?" />
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {why.map((w) => (
              <div key={w.title} className="border-t-2 border-brand pt-5">
                <h3 className="text-[1.4rem]">{w.title}</h3>
                <p className="mt-3 text-muted">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap py-16">
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-7">
          {gallery.map((g) => (
            <li key={g.alt} className="rounded-md bg-[#eceff1]">
              <Image src={g.img} alt={g.alt} sizes="(min-width: 640px) 160px, 30vw" className="mix-blend-multiply" />
            </li>
          ))}
        </ul>
      </section>

      <Testimonials />
    </>
  );
}
