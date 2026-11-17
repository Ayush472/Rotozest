import Link from "next/link";
import { GearSolid } from "@/components/Gear";

export const metadata = { title: "Page not found | Rotozest Industries", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="wrap grid min-h-[60vh] place-content-center py-20 text-center">
      <GearSolid className="mx-auto size-16 text-brand" />
      <h1 className="mt-6 text-5xl">Page not found</h1>
      <p className="mt-4 text-lg text-muted">The page you are looking for has moved or no longer exists.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">Go to home</Link>
        <Link href="/ss-rotary-gear-pump/" className="btn-ghost">SS Rotary Gear Pump</Link>
        <Link href="/ci-rotary-gear-pump/" className="btn-ghost">CI Rotary Gear Pump</Link>
      </div>
    </section>
  );
}
