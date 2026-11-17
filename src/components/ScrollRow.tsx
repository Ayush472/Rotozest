"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTOPLAY_MS = 3500;

/**
 * Carousel for the "Our Core Value" cards: slides on its own every few seconds and loops,
 * pauses on hover / touch / keyboard focus, no visible scrollbar. Swipe on touch, arrows on
 * desktop. No auto-movement with prefers-reduced-motion. Built on CSS scroll-snap, no library.
 */
export function ScrollRow({ label, light, children }: { label: string; light?: boolean; children: React.ReactNode }) {
  const list = useRef<HTMLUListElement>(null);
  const paused = useRef(false);

  const step = () => {
    const card = list.current?.querySelector("li");
    return (card?.clientWidth ?? 300) + 16;
  };
  const smooth = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth") as ScrollBehavior;

  const go = (dir: 1 | -1) => {
    const el = list.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const atStart = el.scrollLeft <= 4;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: smooth() });
    else if (dir === -1 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: smooth() });
    else el.scrollBy({ left: dir * step(), behavior: smooth() });
  };

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = list.current;
    if (!el) return;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const id = window.setInterval(() => {
      if (!paused.current && visible && document.visibilityState === "visible") go(1);
    }, AUTOPLAY_MS);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pause = () => (paused.current = true);
  const resume = () => (paused.current = false);
  const btn = `grid size-11 place-items-center rounded-full border transition-colors ${light ? "border-white/30 text-white hover:bg-white hover:text-steel" : "border-line text-steel hover:bg-steel hover:text-white"}`;

  return (
    <div className="mt-10" onMouseEnter={pause} onMouseLeave={resume} onFocus={pause} onBlur={resume} onTouchStart={pause} onTouchEnd={() => setTimeout(resume, 4000)}>
      <div className="mb-5 flex justify-end gap-2">
        <button type="button" className={btn} onClick={() => go(-1)} aria-label={`Previous: ${label}`}>
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" className={btn} onClick={() => go(1)} aria-label={`Next: ${label}`}>
          <ChevronRight className="size-5" />
        </button>
      </div>
      <ul
        ref={list}
        tabIndex={0}
        aria-label={label}
        aria-roledescription="carousel"
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] focus-visible:outline-offset-4 sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
    </div>
  );
}

/** One card in a ScrollRow. */
export function ScrollItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <li className={`w-[80%] shrink-0 snap-start transition-transform duration-300 sm:w-[300px] ${className}`}>{children}</li>;
}
