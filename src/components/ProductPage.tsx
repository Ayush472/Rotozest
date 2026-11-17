import Image, { type StaticImageData } from "next/image";
import { Download, Check } from "lucide-react";
import { bodyHtml, childrenOf, getPage, pick, sectionize, uniqueByTitle } from "@/lib/content";
import { legacyJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { FaqList, Html, JsonLd, PageHero, SectionHead } from "./ui";
import { ContactBlock, iconFor } from "./sections";
import { GearLines } from "./Gear";
import { Pump3D } from "./Pump3D";
import { BrochureButton } from "./BrochureButton";
import { InquireButton } from "./InquiryPopup";

type Props = {
  path: "/ss-rotary-gear-pump/" | "/ci-rotary-gear-pump/";
  name: string; // breadcrumb label
  tagline: string;
  introTitle: string;
  whatTitle: string;
  whyTitle: string;
  images: { img: StaticImageData; alt: string }[];
  inquiryTitle: string;
  model3d?: boolean; // show the interactive 3D pump on the main photo
};

/** SS and CI product pages: WordPress wording, new layout. */
export function ProductPage(p: Props) {
  const page = getPage(p.path);
  const s = sectionize(page.html);
  const intro = pick(s, p.introTitle);
  const introP = intro.html.match(/<p>[\s\S]*?<\/p>/)?.[0] ?? `<p>${intro.text}</p>`;
  const what = pick(s, p.whatTitle);
  const features = uniqueByTitle(childrenOf(s, "Key Features", { until: "Applications" })).filter((f) => f.text);
  const appsIntro = pick(s, "Applications");
  const apps = childrenOf(s, "Applications", { until: p.whyTitle });
  const why = childrenOf(s, p.whyTitle, { until: "Frequently Asked Questions (FAQs)" });

  return (
    <>
      <PageHero h1={page.h1} crumbs={[{ name: "Home", path: "/" }, { name: p.name, path: p.path }]} lead={p.tagline} />

      <section className="wrap grid gap-12 py-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:py-20">
        <div className="relative">
          <GearLines className="absolute -inset-6 text-brand/25" />
          <div className="relative grid grid-cols-2 gap-3">
            {p.images.map((im, i) => (
              i === 0 && p.model3d ? (
                <div key={im.alt} className="col-span-2">
                  <Pump3D poster={im.img} alt={im.alt} />
                </div>
              ) : (
                <div key={im.alt} className={`overflow-hidden rounded-md bg-[#eceff1] ${i === 0 ? "col-span-2" : ""}`}>
                  <Image src={im.img} alt={im.alt} priority={i === 0} sizes={i === 0 ? "(min-width: 1024px) 560px, 92vw" : "(min-width: 1024px) 280px, 46vw"} className="mx-auto mix-blend-multiply" />
                </div>
              )
            ))}
          </div>
        </div>
        <div>
          <SectionHead title={intro.title} />
          <Html html={introP} className="prose-rz mt-5" />
          <div className="mt-8 flex flex-wrap gap-3">
            <InquireButton requirement={p.name} className="btn-primary">Inquire Now</InquireButton>
            <BrochureButton className="btn-ghost" label="Download Brochure" />
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="wrap grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHead title={what.title} />
          <Html html={bodyHtml(what)} className="prose-rz" />
        </div>
      </section>

      <section className="wrap py-20">
        <SectionHead title="Key Features" />
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="border-t-2 border-brand pt-5">
              <h2 className="text-[1.45rem]">{f.title}</h2>
              <Html html={bodyHtml(f)} className="mt-3 text-muted [&_p+p]:mt-3" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-iron text-white">
        <div className="wrap grid gap-12 py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHead title="Applications" light />
            <Html html={bodyHtml(appsIntro)} className="mt-4 text-lg text-white/75" />
          </div>
          <ul className="grid gap-px overflow-hidden rounded-md bg-white/10 sm:grid-cols-2">
            {apps.map((a) => {
              const Icon = iconFor(a.title);
              return (
                <li key={a.title} className="bg-iron p-6">
                  <Icon className="size-7 text-brand" strokeWidth={1.5} aria-hidden />
                  <h3 className="mt-3 text-[1.3rem] text-white">{a.title}</h3>
                  <p className="mt-2 text-white/70">{a.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="wrap py-20">
        <SectionHead title={p.whyTitle} />
        <ul className="mt-10 grid gap-8 md:grid-cols-3">
          {why.map((w) => (
            <li key={w.title} className="flex gap-4">
              <Check className="mt-1 size-6 shrink-0 text-brand-ink" aria-hidden />
              <div>
                <h3 className="text-[1.3rem]">{w.title}</h3>
                <p className="mt-2 text-muted">{w.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-surface">
        <div className="wrap grid gap-10 py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHead title="Frequently Asked Questions (FAQs)" />
          <FaqList items={page.faq} />
        </div>
      </section>

      <ContactBlock title={p.inquiryTitle} requirement={p.name} />
      <JsonLd data={legacyJsonLd(p.path)} />
    </>
  );
}
