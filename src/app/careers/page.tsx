import { childrenOf, getPage, pick, sectionize } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { Html, PageHero, SectionHead } from "@/components/ui";
import { CareersForm } from "@/components/CareersForm";
import { ScrollItem, ScrollRow } from "@/components/ScrollRow";
import { valueIcons } from "@/components/sections";

export const metadata = pageMetadata("/careers/");

export default function Page() {
  const page = getPage("/careers/");
  const s = sectionize(page.html);
  const join = pick(s, "Join Our Team");
  const growth = childrenOf(s, "Why Choose Us For Your Growth?", { until: "Our Core Value" });
  const values = childrenOf(s, "Our Core Value", { until: "Apply For Job" });
  return (
    <>
      <PageHero h1={page.h1} crumbs={[{ name: "Home", path: "/" }, { name: "Careers", path: "/careers/" }]} />
      <section className="wrap grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:py-20">
        <SectionHead title={join.title} />
        <Html html={join.html} className="prose-rz text-lg" />
      </section>

      <section className="bg-surface">
        <div className="wrap py-20">
          <SectionHead title="Why Choose Us For Your Growth?" />
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {growth.map((g) => (
              <div key={g.title} className="border-t-2 border-brand pt-5">
                <h2 className="text-[1.5rem]">{g.title}</h2>
                <p className="mt-2 text-muted">{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap py-20">
        <SectionHead title="Our Core Value" />
        <ScrollRow label="Our core values">
          {values.map((v) => (
            <ScrollItem key={v.title} className="rounded-md border border-line border-t-2 border-t-brand p-6">
              {(() => {
                const Icon = valueIcons[v.title];
                return Icon ? <Icon className="mb-4 size-8 text-brand" strokeWidth={1.6} aria-hidden /> : null;
              })()}
              <h3 className="text-[1.4rem]">{v.title}</h3>
              <p className="mt-2 text-muted">{v.text}</p>
            </ScrollItem>
          ))}
        </ScrollRow>
      </section>

      <section id="apply" className="bg-surface">
        <div className="wrap grid gap-10 py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHead title="Apply For Job" />
            <p className="mt-4 text-muted">
              Send your details and CV. You can also email <a className="font-medium text-brand-ink underline" href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </div>
          <div className="rounded-md border border-line bg-white p-6 sm:p-8">
            <CareersForm />
          </div>
        </div>
      </section>
    </>
  );
}
