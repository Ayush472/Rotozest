import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, Download } from "lucide-react";
import { nav, site } from "@/lib/site";
import { MobileMenu } from "./MobileMenu";
import { BrochureButton } from "./BrochureButton";

export function Header() {
  return (
    // No backdrop-filter on the header: it would trap the fixed mobile menu inside the header box.
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="hidden border-b border-line bg-steel text-[0.9rem] text-white/85 md:block">
        <div className="wrap flex h-9 items-center justify-between">
          <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-white">
            <Mail className="size-4" aria-hidden /> {site.email}
          </a>
          <div className="flex items-center gap-5">
            {site.phones.map((p) => (
              <a key={p.href} href={p.href} className="inline-flex items-center gap-2 hover:text-white">
                <Phone className="size-4" aria-hidden /> {p.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="wrap flex h-16 items-center justify-between gap-6 md:h-[76px]">
        <Link href="/" className="shrink-0" aria-label="Rotozest Industries home">
          {/* vector logo traced from the registered-mark PNG: sharp at any size, 7 KB */}
          <Image src="/images/rotozest-logo.svg" alt="Rotozest Industries" width={180} height={49} priority unoptimized className="h-auto w-[150px] md:w-[180px]" />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 font-display text-[1.05rem] font-medium text-steel">
            {nav.map((item) =>
              "children" in item ? (
                <li key={item.label} className="group relative">
                  <Link href={item.href} className="block px-3 py-2 hover:text-brand-ink">
                    {item.label}
                  </Link>
                  <ul className="invisible absolute left-0 top-full w-72 border border-line bg-white py-2 opacity-0 transition motion-reduce:transition-none group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block px-4 py-2 hover:bg-surface hover:text-brand-ink">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={item.href} className="block px-3 py-2 hover:text-brand-ink">
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <BrochureButton className="btn-primary hidden min-h-11 text-base sm:inline-flex" label="Download" />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
