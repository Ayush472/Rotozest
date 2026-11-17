import { GearSolid } from "./Gear";

/**
 * The old site's spinning blue gear, kept as a brand moment.
 * CSS only: it fades out after ~0.8 s regardless of what else is loading,
 * never blocks clicks, shows once per browser session and is skipped
 * entirely with prefers-reduced-motion.
 */
export function GearLoader() {
  return (
    <>
      <script
        // Runs before paint: hide the loader on every page after the first in this session.
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.classList.add("js");try{if(sessionStorage.getItem("rz-seen"))document.documentElement.classList.add("rz-seen");else sessionStorage.setItem("rz-seen","1")}catch(e){}`,
        }}
      />
      <div className="rz-loader" aria-hidden>
        <GearSolid />
      </div>
    </>
  );
}
