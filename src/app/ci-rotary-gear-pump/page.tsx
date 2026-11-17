import { ProductPage } from "@/components/ProductPage";
import { pageMetadata } from "@/lib/seo";
import ci from "../../../public/images/17.webp";

export const metadata = pageMetadata("/ci-rotary-gear-pump/");

export default function Page() {
  return (
    <ProductPage
      path="/ci-rotary-gear-pump/"
      name="CI Rotary Gear Pump"
      tagline="Reliable and Efficient Pumping Solutions"
      introTitle="CI (Cast Iron) Rotary Gear Pump"
      whatTitle="What is a CI Rotary Gear Pump?"
      whyTitle="Why Choose Rotozest CI Rotary Gear Pumps?"
      inquiryTitle="CI Rotary Gear Pump Inquiry"
      images={[{ img: ci, alt: "CI Rotary Gear Pump" }]}
    />
  );
}
