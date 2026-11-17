"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { Rotate3d } from "lucide-react";
import { GearSolid } from "./Gear";

/**
 * Product photo that turns into an interactive 3D pump on request.
 * The photo stays the LCP element; three.js (~150 KB gz) loads only after the click.
 */
export function Pump3D({ poster, alt }: { poster: StaticImageData; alt: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const cleanup = useRef<(() => void) | null>(null);
  const alive = useRef(true);

  // Dispose the WebGL scene only when the component unmounts.
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      cleanup.current?.();
      cleanup.current = null;
    };
  }, []);

  async function load() {
    if (state === "loading" || state === "ready") return;
    setState("loading");
    try {
      const { mountPump } = await import("./pump3d/scene");
      const dispose = await mountPump(box.current!, { reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches });
      if (!alive.current) return dispose();
      cleanup.current = dispose;
      setState("ready");
      (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "view_3d" });
    } catch {
      setState("error");
    }
  }

  return (
    <div className="relative aspect-square overflow-hidden rounded-md bg-[#eceff1]">
      <div ref={box} className={`absolute inset-0 ${state === "ready" ? "cursor-grab active:cursor-grabbing" : ""}`} aria-label={state === "ready" ? `${alt}, interactive 3D model` : undefined} role={state === "ready" ? "img" : undefined} />
      {state !== "ready" ? <Image src={poster} alt={alt} priority sizes="(min-width: 1024px) 560px, 92vw" className="absolute inset-0 size-full object-contain mix-blend-multiply" /> : null}
      {state === "ready" ? (
        <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[0.9rem] text-muted"><span className="pointer-coarse:hidden">Drag to rotate · scroll to zoom</span><span className="hidden pointer-coarse:inline">Swipe sideways to rotate · pinch to zoom</span></p>
      ) : (
        <button
          type="button"
          onClick={load}
          disabled={state === "loading"}
          className="btn-primary absolute bottom-4 left-1/2 -translate-x-1/2 text-base"
        >
          {state === "loading" ? <GearSolid className="rz-spin size-5" /> : <Rotate3d className="size-5" aria-hidden />}
          {state === "loading" ? "Loading 3D…" : state === "error" ? "3D not supported here" : "View in 3D"}
        </button>
      )}
    </div>
  );
}
