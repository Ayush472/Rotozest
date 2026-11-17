"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { site } from "@/lib/site";

/** Google Map that only loads its ~1 MB of scripts when someone asks for it. */
export function MapFacade() {
  const [on, setOn] = useState(false);
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-line bg-surface md:aspect-auto md:h-full md:min-h-[380px]">
      {on ? (
        <iframe src={site.mapEmbed} title="Rotozest Industries on Google Maps" className="absolute inset-0 size-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <button type="button" onClick={() => setOn(true)} className="absolute inset-0 grid place-items-center p-6 text-center">
          <span
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <span className="relative grid justify-items-center gap-3">
            <MapPin className="size-10 text-brand-ink" aria-hidden />
            <span className="max-w-xs text-steel">{site.address.oneLine}</span>
            <span className="btn-ghost min-h-10 text-base">Show on Google Maps</span>
          </span>
        </button>
      )}
    </div>
  );
}
