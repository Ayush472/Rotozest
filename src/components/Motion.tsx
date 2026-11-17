"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Adds `is-in` to every [data-reveal] element as it scrolls into view (once).
 * CSS in globals.css does the fade/rise; content is fully visible without JS
 * and with prefers-reduced-motion.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    const showAll = () => els.forEach((e) => e.classList.add("is-in"));
    if (!("IntersectionObserver" in window)) return showAll();
    // Whatever is already on screen shows straight away (no blank first paint).
    for (const e of els) if (e.getBoundingClientRect().top < window.innerHeight) e.classList.add("is-in");
    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        fired = true;
        for (const e of entries) if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((e) => io.observe(e));
    // Fail-safe: if the observer never reports (background tab, odd browser), never leave content hidden.
    const safety = window.setTimeout(() => !fired && showAll(), 2000);
    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, [pathname]);
  return null;
}

/** Number that counts up once when it scrolls into view, e.g. "525+" or "100%". */
export function CountUp({ value }: { value: string }) {
  const m = value.match(/^(\d+)(.*)$/);
  const target = m ? Number(m[1]) : 0;
  const suffix = m ? m[2] : value;
  const [n, setN] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!m || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0);
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 1400;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden>
        {n}
        {suffix}
      </span>
    </span>
  );
}
