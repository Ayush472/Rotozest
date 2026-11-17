"use client";

import { Sent, SubmitButton, useFormPost } from "./InquiryForm";

const field = "w-full rounded-sm border border-line bg-white px-4 py-3 text-body focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

const fields = [
  { name: "your-firstname", label: "First Name", auto: "given-name" },
  { name: "your-lastname", label: "Last Name", auto: "family-name" },
  { name: "your-email", label: "Email", auto: "email", type: "email" },
  { name: "your-number", label: "Phone", auto: "tel", type: "tel" },
  { name: "your-address", label: "Address", auto: "street-address" },
  { name: "your-city", label: "City", auto: "address-level2" },
  { name: "your-state", label: "State", auto: "address-level1" },
];

/** Same fields as the WordPress careers form, CV attached to the email. */
export function CareersForm() {
  const { status, onSubmit } = useFormPost("careers");
  if (status.state === "sent") return <Sent text="Thank you for applying. Our team will review your details and contact you." />;
  return (
    <form onSubmit={onSubmit} className="grid gap-4" encType="multipart/form-data">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.name} className="grid gap-1.5">
            <span className="text-[0.95rem] font-medium text-steel">{f.label}*</span>
            <input name={f.name} type={f.type ?? "text"} required autoComplete={f.auto} className={field} />
          </label>
        ))}
        <label className="grid gap-1.5">
          <span className="text-[0.95rem] font-medium text-steel">CV / Resume* (PDF or Word, max 5 MB)</span>
          <input name="file-445" type="file" required accept=".pdf,.doc,.docx" className="w-full text-[0.95rem] file:mr-4 file:rounded-sm file:border-0 file:bg-surface file:px-4 file:py-3 file:font-display file:font-semibold file:text-steel" />
        </label>
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {status.state === "error" && <p role="alert" className="text-[0.95rem] text-red-700">{status.message}</p>}
      <div>
        <SubmitButton sending={status.state === "sending"} label="Apply Now" />
      </div>
    </form>
  );
}
