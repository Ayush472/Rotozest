import { ProductPage } from "@/components/ProductPage";
import { pageMetadata } from "@/lib/seo";
import ss from "../../../public/images/ss-rotary-gear-pump.webp";
import ssAlt from "../../../public/images/stainless-steel-rotary-gear-pump.webp";
import ss11 from "../../../public/images/11.webp";

export const metadata = pageMetadata("/ss-rotary-gear-pump/");

export default function Page() {
  return (
    <ProductPage
      path="/ss-rotary-gear-pump/"
      name="SS Rotary Gear Pump Manufacturer"
      tagline="Precision and Durability for Corrosive Fluid Handling"
      introTitle="SS (Stainless Steel) Rotary Gear Pump"
      whatTitle="What is an SS Rotary Gear Pump?"
      whyTitle="Why Choose Rotozest SS Rotary Gear Pumps?"
      inquiryTitle="SS Rotary Gear Pump Inquiry"
      model3d
      images={[
        { img: ss, alt: "SS Rotary Gear Pump" },
        { img: ssAlt, alt: "Stainless Steel Rotary Gear Pump" },
        { img: ss11, alt: "SS Rotary Gear Pump Suppliers" },
      ]}
    />
  );
}
