"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { site } from "@/lib/site";
import { InquiryForm } from "./InquiryForm";

// "Inquire Now" popup, for conversions.
// Opens automatically once (see TRIGGERS), and any time an <InquireButton> is clicked.
// Not shown again for SNOOZE_DAYS after it was closed, or ever after an inquiry was sent.

const TRIGGERS = {
  afterSeconds: 35, // time on the page
  scrollShare: 0.55, // or this much of the page scrolled…
  scrollMinSeconds: 12, // …but not before this
  exitIntentMinSeconds: 8, // desktop: mouse leaves through the top of the window
};
const SNOOZE_DAYS = 3;
const SKIP_PATHS = ["/contact-us/", "/careers/"];
const EVENT = "rz:inquire";

const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} },
};
export const markInquirySent = () => store.set("rz-inq-done", "1");

/** Opens the inquiry popup (falls back to the #inquiry form link without JS). */
export function InquireButton({ className, children = "Inquire Now", requirement }: { className?: string; children?: React.ReactNode; requirement?: string }) {
  return (
    <a
      href="#inquiry"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(EVENT, { detail: { requirement, source: "button" } }));
      }}
    >
      {children}
    </a>
  );
}

export function InquiryPopup() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [requirement, setRequirement] = useState<string | undefined>();
  const pathname = usePathname();

  const show = useCallback((source: string, req?: string) => {
    const d = dialog.current;
    if (!d || d.open || document.querySelector("dialog[open]")) return;
    setRequirement(req);
    setOpen(true);
    d.showModal();
    (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "inquiry_popup_open", source });
  }, []);

  const close = useCallback(() => dialog.current?.close(), []);

  // Manual opens from buttons.
  useEffect(() => {
    const onOpen = (e: Event) => show("button", (e as CustomEvent<{ requirement?: string }>).detail?.requirement);
    window.addEventListener(EVENT, onOpen);
    return () => window.removeEventListener(EVENT, onOpen);
  }, [show]);

  // Automatic triggers.
  useEffect(() => {
    if (SKIP_PATHS.includes(pathname)) return;
    if (store.get("rz-inq-done")) return;
    const snoozed = Number(store.get("rz-inq-snooze") || 0);
    if (snoozed > Date.now()) return;

    const start = Date.now();
    const elapsed = () => (Date.now() - start) / 1000;
    let fired = false;
    const fire = (source: string) => {
      if (fired) return;
      fired = true;
      cleanup();
      show(source);
    };
    const timer = window.setTimeout(() => fire("timer"), TRIGGERS.afterSeconds * 1000);
    const onScroll = () => {
      const h = document.documentElement;
      const share = (h.scrollTop + window.innerHeight) / h.scrollHeight;
      if (share >= TRIGGERS.scrollShare && elapsed() >= TRIGGERS.scrollMinSeconds) fire("scroll");
    };
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0 && elapsed() >= TRIGGERS.exitIntentMinSeconds) fire("exit-intent");
    };
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    window.addEventListener("scroll", onScroll, { passive: true });
    if (finePointer) document.addEventListener("mouseout", onLeave);
    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onLeave);
    }
    return cleanup;
  }, [pathname, show]);

  // Close on backdrop click; snooze when closed.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClick = (e: MouseEvent) => e.target === d && d.close();
    const onClose = () => {
      setOpen(false);
      store.set("rz-inq-snooze", String(Date.now() + SNOOZE_DAYS * 864e5));
    };
    d.addEventListener("click", onClick);
    d.addEventListener("close", onClose);
    return () => {
      d.removeEventListener("click", onClick);
      d.removeEventListener("close", onClose);
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-label="Inquire Now"
      className="m-auto max-h-[92dvh] w-[min(94vw,580px)] overflow-y-auto rounded-md border border-line p-0 text-body outline-none backdrop:bg-steel/60"
    >
      {open ? (
        <div>
          <div className="relative bg-steel px-6 py-5 text-white md:px-7">
            <button type="button" onClick={close} className="absolute right-3 top-3 grid size-10 place-items-center rounded-sm text-white/80 hover:bg-white/10" aria-label="Close">
              <X className="size-5" />
            </button>
            <p className="pr-10 font-display text-[1.6rem] font-semibold leading-tight">Talk to our pump team</p>
            <p className="mt-1 text-[0.95rem] text-white/75">Tell us your fluid, flow rate and pressure. We reply within one working day.</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.95rem]">
              <a href={site.phones[0].href} className="inline-flex items-center gap-2 font-semibold hover:text-brand">
                <Phone className="size-4 text-brand" aria-hidden /> {site.phones[0].label}
              </a>
              <a href={site.whatsapp} target="_blank" rel="noopener" className="inline-flex items-center gap-2 font-semibold hover:text-brand">
                <MessageCircle className="size-4 text-brand" aria-hidden /> WhatsApp us
              </a>
            </div>
          </div>
          <div className="p-6 md:p-7">
            <InquiryForm requirement={requirement} heading="Inquire Now" headingAs="p" compact />
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
