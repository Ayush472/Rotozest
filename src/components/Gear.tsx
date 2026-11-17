// The Rotozest gear: used for the page loader ("dial"), the hero drawing and button spinners.

function gearPath(teeth: number, rOuter: number, rRoot: number, cx = 50, cy = 50) {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  const tip = step * 0.22; // half-width of the tooth tip
  const base = step * 0.3; // half-width of the tooth base
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const p = (r: number, t: number) => `${(cx + r * Math.cos(t)).toFixed(2)} ${(cy + r * Math.sin(t)).toFixed(2)}`;
    pts.push(`${i === 0 ? "M" : "L"}${p(rRoot, a - base)}`, `L${p(rOuter, a - tip)}`, `L${p(rOuter, a + tip)}`, `L${p(rRoot, a + base)}`);
    pts.push(`A${rRoot} ${rRoot} 0 0 1 ${p(rRoot, a + step - base)}`);
  }
  return pts.join(" ") + "Z";
}

export const GEAR_D = gearPath(9, 48, 38);

/** Solid gear with a hole, as on the old site's loader. */
export function GearSolid({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>
      {title ? <title>{title}</title> : null}
      <path d={`${GEAR_D} M50 34 A16 16 0 1 0 50.01 34 Z`} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

/** Line drawing of two meshing gears, used large behind the hero product photo. */
export function GearLines({ className }: { className?: string }) {
  const big = gearPath(14, 48, 42);
  const small = gearPath(9, 48, 39);
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="0.6">
      <g className="rz-gear-slow" style={{ transformBox: "fill-box" }}>
        <path d={big} transform="translate(10 10) scale(1.4)" vectorEffect="non-scaling-stroke" />
        <circle cx="80" cy="80" r="22" vectorEffect="non-scaling-stroke" />
        <circle cx="80" cy="80" r="6" vectorEffect="non-scaling-stroke" />
      </g>
      <g className="rz-gear-slow" style={{ transformBox: "fill-box", animationDirection: "reverse", animationDuration: "40s" }}>
        <path d={small} transform="translate(128 76) scale(0.9)" vectorEffect="non-scaling-stroke" />
        <circle cx="173" cy="121" r="12" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}
