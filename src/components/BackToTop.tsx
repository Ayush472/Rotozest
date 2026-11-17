"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Round "back to top" arrow, shown after scrolling down one screen. Sits above the phone action bar. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      className={`fixed bottom-20 right-4 z-30 grid size-12 place-items-center rounded-full bg-brand text-white transition-opacity hover:bg-brand-deep md:bottom-6 md:right-6 ${show ? "opacity-100" : "pointer-events-none opacity-0"}`}
      tabIndex={show ? 0 : -1}
    >
      <ArrowUp className="size-6" />
    </button>
  );
}
