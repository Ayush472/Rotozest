import Image from "next/image";
import Link from "next/link";
import { Download, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { GearSolid } from "./Gear";
import ce from "../../public/images/ce.webp";
import geac from "../../public/images/geac.webp";
import ricl from "../../public/images/ricl.webp";
import uaf from "../../public/images/uaf.webp";
import { BrochureButton } from "./BrochureButton";

const certs = [
  { img: ce, alt: "CE" },
  { img: geac, alt: "GEAC" },
  { img: ricl, alt: "RICL" },
  { img: uaf, alt: "UAF" },
];

export function BrochureBand() {
  return (
    <section className="bg-brand text-white">
      <div className="wrap flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <GearSolid className="hidden size-14 shrink-0 text-white/25 md:block" />
          <div>
            <p className="font-display text-lg text-white/80">Discover More</p>
            <h3 className="text-3xl text-white md:text-4xl">Download Our Brochure Today!</h3>
          </div>
        </div>
        <BrochureButton className="btn-light self-start md:self-auto" label="Download Brochure" />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-steel text-white/80">
      <BrochureBand />
      <div className="wrap grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Image src="/images/rotozest-logo-white.svg" alt="Rotozest Industries" width={180} height={49} unoptimized />
          <p className="mt-5 max-w-sm text-[0.98rem] leading-relaxed">
            Experience excellence with Rotozest Industries. Explore our premium products and services tailored to seamlessly meet your industrial needs. With a focus on innovation, quality, and reliability, we provide tailored solutions designed to enhance your operations and drive efficiency.
          </p>
        </div>
        <div>
          <h4 className="text-xl text-white">Our Products</h4>
          <ul className="mt-4 space-y-2">
            <li><Link className="hover:text-white" href="/ss-rotary-gear-pump/">SS Rotary Gear Pump</Link></li>
            <li><Link className="hover:text-white" href="/ci-rotary-gear-pump/">CI Rotary Gear Pump</Link></li>
            <li><Link className="hover:text-white" href="/applications/">Applications</Link></li>
            <li><Link className="hover:text-white" href="/blog/">Blog</Link></li>
            <li><Link className="hover:text-white" href="/careers/">Careers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl text-white">Certifications</h4>
          <ul className="mt-4 grid w-fit grid-cols-2 gap-3">
            {certs.map((c) => (
              <li key={c.alt} className="rounded-sm bg-white p-2">
                <Image src={c.img} alt={c.alt} sizes="64px" className="size-14 object-contain" />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xl text-white">Reach Us</h4>
          <ul className="mt-4 space-y-3">
            {site.phones.map((p) => (
              <li key={p.href}>
                <a href={p.href} className="inline-flex items-center gap-3 hover:text-white">
                  <Phone className="size-4 shrink-0 text-brand" aria-hidden /> {p.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-3 hover:text-white">
                <Mail className="size-4 shrink-0 text-brand" aria-hidden /> {site.email}
              </a>
            </li>
            <li>
              <a href={site.mapLink} target="_blank" rel="noopener" className="inline-flex gap-3 hover:text-white">
                <MapPin className="mt-1 size-4 shrink-0 text-brand" aria-hidden /> {site.address.oneLine}
              </a>
            </li>
          </ul>
          <div className="mt-5 flex gap-4 text-sm">
            <a href={site.social.facebook} target="_blank" rel="noopener" className="underline decoration-white/30 hover:text-white">Facebook</a>
            <a href={site.social.instagram} target="_blank" rel="noopener" className="underline decoration-white/30 hover:text-white">Instagram</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-2 py-5 text-sm text-white/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All Rights Reserved.</p>
          <p>Ahmedabad, Gujarat, India</p>
        </div>
      </div>
    </footer>
  );
}
