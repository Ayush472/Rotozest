import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download, Phone } from "lucide-react";
import { blogPosts, getPage, landingPages } from "@/lib/content";
import { faqJsonLd, hasType, legacyJsonLd, newImagePath, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { FaqList, Html, JsonLd, PageHero } from "@/components/ui";
import { ContactBlock } from "@/components/sections";
import { formatDate, PostList } from "@/components/PostList";
import ssThumb from "../../../public/images/ss-rotary-gear-pump-600.webp";
import ciThumb from "../../../public/images/17.webp";
import { BrochureButton } from "@/components/BrochureButton";
import { InquireButton } from "@/components/InquiryPopup";

// Blog posts and SEO landing pages: one template, exact WordPress body copy.
const all = [...blogPosts, ...landingPages] as readonly string[];
const slugToPath = (slug: string) => `/${slug}/`;

export const dynamicParams = false;
export function generateStaticParams() {
  return all.map((p) => ({ slug: p.replace(/\//g, "") }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return pageMetadata(slugToPath(slug));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = slugToPath(slug);
  if (!all.includes(path)) notFound();
  const page = getPage(path);
  const isPost = (blogPosts as readonly string[]).includes(path);
  const [before, after = ""] = page.html.split("<!--FAQ-->");
  const cover = isPost ? newImagePath(page.meta.ogImage) : null;
  const ld = legacyJsonLd(path);
  if (page.faq.length && !hasType(ld, "FAQPage")) ld.push(faqJsonLd(page.faq));
  const crumbs = isPost
    ? [{ name: "Home", path: "/" }, { name: "Blog", path: "/blog/" }, { name: page.h1, path }]
    : [{ name: "Home", path: "/" }, { name: page.h1, path }];

  return (
    <>
      <PageHero h1={page.h1} crumbs={crumbs}>
        {isPost ? (
          <p className="mt-5 text-white/75">
            <Link href="/category/industry/" className="text-white underline decoration-white/30">Industry</Link> · <time dateTime={page.meta.published ?? undefined}>{formatDate(page.meta.published)}</time>
            {page.meta.readTime ? ` · ${page.meta.readTime} read` : ""}
          </p>
        ) : (
          <div className="mt-7 flex flex-wrap gap-3">
            <InquireButton requirement={page.h1} className="btn bg-white text-steel hover:bg-brand hover:text-white">Inquire Now</InquireButton>
            <a href={site.phones[0].href} className="btn-light">
              <Phone className="size-5" aria-hidden /> {site.phones[0].label}
            </a>
          </div>
        )}
      </PageHero>

      <div className="wrap grid gap-14 py-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-20">
        <article>
          {cover ? <Image src={cover} alt={page.meta.ogImageAlt ?? page.h1} width={700} height={425} priority sizes="(min-width: 1024px) 720px, 92vw" className="mb-10 w-full max-w-[720px] rounded-md" /> : null}
          <Html html={before} className="prose-rz" />
          {page.faq.length ? (
            <div className="mt-8 max-w-[72ch]">
              <FaqList items={page.faq} />
            </div>
          ) : null}
          {after.trim() ? <Html html={after} className="prose-rz mt-8" /> : null}
        </article>

        <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start" aria-label="Our products">
          <p className="font-display text-xl font-semibold text-steel">Our Products</p>
          {[
            { href: "/ss-rotary-gear-pump/", t: "SS Rotary Gear Pump", img: ssThumb, alt: "SS Rotary Gear Pump" },
            { href: "/ci-rotary-gear-pump/", t: "CI Rotary Gear Pump", img: ciThumb, alt: "CI Rotary Gear Pump" },
          ].map((p) => (
            <Link key={p.href} href={p.href} className="group grid grid-cols-[96px_1fr] items-center gap-4 rounded-md border border-line p-3 hover:border-brand">
              <span className="rounded-sm bg-[#eceff1]">
                <Image src={p.img} alt="" sizes="96px" className="mix-blend-multiply" />
              </span>
              <span className="font-display text-lg font-semibold text-steel group-hover:text-brand-ink">
                {p.t} <ArrowRight className="inline size-4" aria-hidden />
              </span>
            </Link>
          ))}
          <div className="rounded-md bg-steel p-6 text-white">
            <p className="font-display text-xl font-semibold">Need a pump for your fluid?</p>
            <p className="mt-2 text-white/75">Tell us the fluid, flow rate and pressure. We reply the same working day.</p>
            <InquireButton requirement={page.h1} className="btn bg-white mt-5 w-full text-steel hover:bg-brand hover:text-white">Inquire Now</InquireButton>
            <BrochureButton className="mt-3 inline-flex items-center gap-2 text-white/85 underline decoration-white/30 hover:text-white" label="Download brochure" />
          </div>
        </aside>
      </div>

      {isPost ? (
        <section className="bg-surface">
          <div className="wrap py-16">
            <h2 className="text-[2rem]">Recent Posts</h2>
            <div className="mt-8">
              <PostList />
            </div>
          </div>
        </section>
      ) : null}

      <ContactBlock requirement={page.h1} />
      <JsonLd data={ld} />
    </>
  );
}
