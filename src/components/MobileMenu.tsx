"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone, Download } from "lucide-react";
import { nav, site } from "@/lib/site";
import { BrochureButton } from "./BrochureButton";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="grid size-11 place-items-center rounded-sm text-steel hover:bg-surface"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>
      {open && (
        <div id="mobile-nav" className="fixed inset-x-0 bottom-0 top-[65px] z-50 overflow-y-auto border-t border-line bg-white md:top-[113px]">
          <nav aria-label="Mobile" className="wrap py-4">
            <ul className="divide-y divide-line font-display text-xl text-steel">
              {nav.flatMap((item) =>
                "children" in item
                  ? item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block py-4">
                          {c.label}
                        </Link>
                      </li>
                    ))
                  : [
                      <li key={item.href}>
                        <Link href={item.href} className="block py-4">
                          {item.label}
                        </Link>
                      </li>,
                    ],
              )}
            </ul>
            <div className="mt-6 grid gap-3">
              <BrochureButton className="btn-primary" label="Download Brochure" />
              {site.phones.map((p) => (
                <a key={p.href} href={p.href} className="btn-ghost">
                  <Phone className="size-5" aria-hidden /> {p.label}
                </a>
              ))}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
