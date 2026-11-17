import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui";
import { ContactBlock } from "@/components/sections";

export const metadata = pageMetadata("/contact-us/");

export default function Page() {
  const page = getPage("/contact-us/");
  return (
    <>
      <PageHero h1={page.h1} crumbs={[{ name: "Home", path: "/" }, { name: "Contact Us", path: "/contact-us/" }]} />
      <ContactBlock />
    </>
  );
}
