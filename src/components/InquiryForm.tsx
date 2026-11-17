"use client";

import { useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { GearSolid } from "./Gear";

type Status = { state: "idle" | "sending" | "sent" | "error"; message?: string };

const field = "w-full rounded-sm border border-line bg-white px-4 py-3 text-body placeholder:text-muted/80 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

export function SubmitButton({ sending, label }: { sending: boolean; label: string }) {
  return (
    <button type="submit" className="btn-primary w-full sm:w-auto" disabled={sending} aria-live="polite">
      {sending ? <GearSolid className="rz-spin size-5" /> : null}
      {sending ? "Sending…" : label}
    </button>
  );
}

export function useFormPost(kind: "inquiry" | "careers") {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const started = useRef(Date.now());
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("kind", kind);
    fd.set("elapsed", String(Date.now() - started.current));
    fd.set("page", window.location.pathname);
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/inquiry/", { method: "POST", body: fd });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please call or email us instead.");
      setStatus({ state: "sent" });
      try { localStorage.setItem("rz-inq-done", "1"); } catch {}
      (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: kind === "inquiry" ? "inquiry_sent" : "application_sent" });
    } catch (err) {
      setStatus({ state: "error", message: (err as Error).message });
    }
  }
  return { status, onSubmit };
}

export function Sent({ text }: { text: string }) {
  return (
    <div role="status" className="flex items-start gap-3 rounded-sm border border-brand/40 bg-surface p-5 text-steel">
      <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-brand-ink" aria-hidden />
      <p>{text}</p>
    </div>
  );
}

/** Same fields as the WordPress Contact Form 7 inquiry form. */
export function InquiryForm({ requirement, heading = "Inquiry Now", headingAs: H = "h2", compact }: { requirement?: string; heading?: string; headingAs?: "h2" | "p"; compact?: boolean }) {
  const { status, onSubmit } = useFormPost("inquiry");
  if (status.state === "sent") return <Sent text="Thank you. Your inquiry has reached our team and we will get back to you shortly." />;
  return (
    <form onSubmit={onSubmit} className={`grid ${compact ? "gap-3" : "gap-4"}`}>
      <H className="font-display text-[1.8rem] font-semibold leading-tight text-steel">{heading}</H>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-[0.95rem] font-medium text-steel">Name</span>
          <input name="your-name" required autoComplete="name" className={field} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[0.95rem] font-medium text-steel">Email</span>
          <input name="your-email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[0.95rem] font-medium text-steel">Phone</span>
          <input name="your-number" type="tel" required autoComplete="tel" inputMode="tel" className={field} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[0.95rem] font-medium text-steel">Requirement</span>
          <input name="your-subject" required defaultValue={requirement} className={field} />
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="text-[0.95rem] font-medium text-steel">Message</span>
        <textarea name="your-message" required rows={compact ? 3 : 4} placeholder="Write Your Message Here..." className={field} />
      </label>
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {status.state === "error" && <p role="alert" className="text-[0.95rem] text-red-700">{status.message}</p>}
      <div>
        <SubmitButton sending={status.state === "sending"} label="Inquire Now" />
      </div>
    </form>
  );
}
