import Image from "next/image";
import Link from "next/link";
import { blogPosts, getPage } from "@/lib/content";
import { newImagePath } from "@/lib/seo";

export const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Kolkata" }) : "";

/** Posts newest first, with cover images and dates from WordPress. */
export function PostList({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  const posts = blogPosts.map((p) => getPage(p)).sort((a, b) => (b.meta.published ?? "").localeCompare(a.meta.published ?? ""));
  return (
    <ul className="grid gap-10 md:grid-cols-3">
      {posts.map((p) => {
        const cover = newImagePath(p.meta.ogImage);
        return (
          <li key={p.path} className="group flex flex-col">
            <Link href={p.path} className="block overflow-hidden rounded-md bg-surface">
              {cover ? <Image src={cover} alt={p.meta.ogImageAlt ?? p.h1} width={700} height={425} sizes="(min-width: 768px) 360px, 92vw" className="aspect-[700/425] w-full object-cover" /> : null}
            </Link>
            <p className="mt-4 text-[0.92rem] text-muted">
              <Link href="/category/industry/" className="font-medium text-brand-ink hover:underline">Industry</Link> · <time dateTime={p.meta.published ?? undefined}>{formatDate(p.meta.published)}</time>
              {p.meta.readTime ? ` · ${p.meta.readTime} read` : ""}
            </p>
            <H className="mt-2 text-[1.45rem]">
              <Link href={p.path} className="hover:text-brand-ink">{p.h1}</Link>
            </H>
            <p className="mt-2 text-muted">{p.meta.description}</p>
            <Link href={p.path} className="mt-4 font-display font-semibold text-brand-ink hover:text-steel">
              Read more<span className="sr-only">: {p.h1}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
