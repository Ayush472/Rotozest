import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import type { Faq } from "@/lib/content";
import { breadcrumbJsonLd } from "@/lib/seo";
import { GearLines } from "./Gear";

/** JSON-LD blocks. Content is our own build-time data, serialized with < escaped. */
export function JsonLd({ data }: { data: unknown | unknown[] }) {
  const list = Array.isArray(data) ? data : [data];
  return (
    <>
      {list.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }} />
      ))}
    </>
  );
}

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, light }: { items: Crumb[]; light?: boolean }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className={light ? "text-white/75" : "text-muted"}>
        <ol className="flex flex-wrap items-center gap-1 text-[0.95rem]">
          {items.map((c, i) => (
            <li key={c.path} className="inline-flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-4 opacity-60" aria-hidden />}
              {i < items.length - 1 ? (
                <Link href={c.path} className={light ? "hover:text-white" : "hover:text-brand-ink"}>
                  {c.name}
                </Link>
              ) : (
                <span aria-current="page" className={light ? "text-white" : "text-steel"}>
                  {c.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(items)} />
    </>
  );
}

/** Title band for inner pages: the WordPress H1 stays the page H1. */
export function PageHero({ h1, crumbs, lead, children }: { h1: string; crumbs: Crumb[]; lead?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-steel text-white">
      <GearLines className="pointer-events-none absolute -right-24 -top-10 h-[130%] text-white/[0.07] md:right-0" />
      <div className="wrap relative py-12 md:py-16">
        <Breadcrumbs items={crumbs} light />
        <h1 className="mt-4 max-w-4xl text-[2.4rem] text-white sm:text-5xl md:text-[3.4rem]">{h1}</h1>
        {lead ? <p className="mt-4 max-w-2xl text-lg text-white/80">{lead}</p> : null}
        {children}
      </div>
    </section>
  );
}

export function SectionHead({ title, intro, as: As = "h2", light, id }: { title: string; intro?: string; as?: "h2" | "h3"; light?: boolean; id?: string }) {
  return (
    <div className="max-w-3xl">
      <span className="eyebrow-rule" aria-hidden />
      <As id={id} className={`text-[2rem] sm:text-[2.5rem] ${light ? "text-white" : ""}`}>
        {title}
      </As>
      {intro ? <p className={`mt-4 text-lg ${light ? "text-white/80" : "text-muted"}`}>{intro}</p> : null}
    </div>
  );
}

/** Trusted HTML imported from the WordPress pages at build time (src/content/pages). */
export function Html({ html, className }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** FAQ list with native <details>: every answer is in the HTML for search engines, no JS needed. */
export function FaqList({ items, headingLevel = "h3" }: { items: Faq[]; headingLevel?: "h3" | "h5" }) {
  const H = headingLevel;
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f, i) => (
        <details key={f.q} className="group" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
            <H className="text-[1.2rem] font-semibold sm:text-[1.3rem]">{f.q}</H>
            <Plus className="mt-1 size-5 shrink-0 text-brand-ink transition-transform group-open:rotate-45 motion-reduce:transition-none" aria-hidden />
          </summary>
          <Html html={f.a} className="prose-rz pb-6 text-body" />
        </details>
      ))}
    </div>
  );
}
