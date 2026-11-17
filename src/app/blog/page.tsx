import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageHero, SectionHead } from "@/components/ui";
import { PostList } from "@/components/PostList";

export const metadata = pageMetadata("/blog/");

export default function Page() {
  const page = getPage("/blog/");
  return (
    <>
      <PageHero h1={page.h1} crumbs={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog/" }]} lead="Recent Articles" />
      <section className="wrap py-16 lg:py-20">
        <SectionHead title="Read All Updates" />
        <div className="mt-10">
          <PostList />
        </div>
      </section>
    </>
  );
}
