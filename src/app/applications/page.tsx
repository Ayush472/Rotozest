import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { childrenOf, getPage, sectionize } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageHero, SectionHead } from "@/components/ui";
import { ContactBlock, iconFor } from "@/components/sections";

export const metadata = pageMetadata("/applications/");

export default function Page() {
  const page = getPage("/applications/");
  const items = childrenOf(sectionize(page.html), "Our Applications Industries");
  return (
    <>
      <PageHero h1={page.h1} crumbs={[{ name: "Home", path: "/" }, { name: "Applications", path: "/applications/" }]} />
      <section className="wrap py-16 lg:py-20">
        <SectionHead title="Our Applications Industries" />
        <ul className="mt-12 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => {
            const Icon = iconFor(a.title);
            return (
              <li key={a.title} className="border-b border-r border-line p-7">
                <Icon className="size-9 text-brand-ink" strokeWidth={1.5} aria-hidden />
                <h2 className="mt-5 text-[1.5rem]">{a.title}</h2>
                <p className="mt-2 text-muted">{a.text}</p>
              </li>
            );
          })}
        </ul>
        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 font-display text-lg font-semibold">
          <Link href="/ss-rotary-gear-pump/" className="inline-flex items-center gap-2 text-brand-ink hover:text-steel">
            SS Rotary Gear Pump <ArrowRight className="size-5" aria-hidden />
          </Link>
          <Link href="/ci-rotary-gear-pump/" className="inline-flex items-center gap-2 text-brand-ink hover:text-steel">
            CI Rotary Gear Pump <ArrowRight className="size-5" aria-hidden />
          </Link>
        </div>
      </section>
      <ContactBlock />
    </>
  );
}
