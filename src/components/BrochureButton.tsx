"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Download, X } from "lucide-react";
import { site } from "@/lib/site";
import { GearSolid } from "./Gear";

const input = "w-full rounded-sm border border-line bg-white px-4 py-3 text-body focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

/**
 * "Download Brochure" asks for an email first, then the server sends the
 * branded brochure email (PDF attached) and notifies the team.
 */
export function BrochureButton({ className, label = "Download Brochure", icon = true }: { className?: string; label?: string; icon?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opened = useRef(0);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const d = dialog.current;
    const onClick = (e: MouseEvent) => e.target === d && d?.close();
    d?.addEventListener("click", onClick);
    return () => d?.removeEventListener("click", onClick);
  }, []);

  function open() {
    opened.current = Date.now();
    if (state !== "sent") setState("idle");
    dialog.current?.showModal();
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("elapsed", String(Date.now() - opened.current));
    fd.set("page", window.location.pathname);
    setEmail(String(fd.get("email")));
    setState("sending");
    try {
      const res = await fetch("/api/brochure/", { method: "POST", body: fd });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setState("sent");
      (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "brochure_request" });
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }

  return (
    <>
      <button type="button" onClick={open} className={className}>
        {icon ? <Download className="size-5" aria-hidden /> : null}
        {label}
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="brochure-title"
        className="m-auto w-[min(92vw,460px)] rounded-md border border-line p-0 text-body outline-none backdrop:bg-steel/60"
      >
        <div className="relative p-6 sm:p-8">
          <button type="button" onClick={() => dialog.current?.close()} className="absolute right-3 top-3 grid size-10 place-items-center rounded-sm text-muted hover:bg-surface" aria-label="Close">
            <X className="size-5" />
          </button>
          {state === "sent" ? (
            <div role="status">
              <CheckCircle2 className="size-10 text-brand" aria-hidden />
              <p id="brochure-title" className="mt-4 font-display text-2xl font-semibold text-steel">Check your inbox</p>
              <p className="mt-2">
                We have sent the Rotozest brochure to <strong className="text-steel">{email}</strong>. It can take a minute to arrive, and it may land in Promotions or Spam.
              </p>
              <a href={site.brochure} target="_blank" rel="noopener" className="mt-5 inline-flex font-medium text-brand underline">
                Open the brochure now
              </a>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4">
              <div>
                <p id="brochure-title" className="pr-8 font-display text-2xl font-semibold text-steel">Get our brochure by email</p>
                <p className="mt-1 text-[0.98rem] text-muted">SS and CI rotary gear pumps, models and applications.</p>
              </div>
              <label className="grid gap-1.5">
                <span className="text-[0.95rem] font-medium text-steel">Email*</span>
                <input name="email" type="email" required autoComplete="email" className={input} autoFocus />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-[0.95rem] font-medium text-steel">Name</span>
                  <input name="name" autoComplete="name" className={input} />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[0.95rem] font-medium text-steel">Phone</span>
                  <input name="phone" type="tel" autoComplete="tel" inputMode="tel" className={input} />
                </label>
              </div>
              <label className="grid gap-1.5">
                <span className="text-[0.95rem] font-medium text-steel">Company</span>
                <input name="company" autoComplete="organization" className={input} />
              </label>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              {state === "error" ? <p role="alert" className="text-[0.95rem] text-red-700">{error}</p> : null}
              <button type="submit" className="btn-primary w-full" disabled={state === "sending"}>
                {state === "sending" ? <GearSolid className="rz-spin size-5" /> : <Download className="size-5" aria-hidden />}
                {state === "sending" ? "Sending…" : "Email me the brochure"}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
