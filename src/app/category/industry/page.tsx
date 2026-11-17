import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui";
import { PostList } from "@/components/PostList";

export const metadata = pageMetadata("/category/industry/");

export default function Page() {
  const page = getPage("/category/industry/");
  return (
    <>
      <PageHero h1={page.h1} crumbs={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog/" }, { name: "Industry", path: "/category/industry/" }]} />
      <section className="wrap py-16 lg:py-20">
        <PostList headingLevel="h2" />
      </section>
    </>
  );
}
