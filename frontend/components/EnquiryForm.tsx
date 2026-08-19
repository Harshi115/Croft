"use client";

import { useRef, useState } from "react";

interface FormState {
  name: string;
  email: string;
  phone: string;
  enquiryType: string;
  message: string;
  consent: boolean;
  newsletterOptIn: boolean;
  website: string; // honeypot â€” real users never fill this
}

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  enquiryType: "General enquiry",
  message: "",
  consent: false,
  newsletterOptIn: false,
  website: ""
};

// FR-040/046/047/048/049/050/051: full field set, client+server validation,
// accessible error announcement, in-page confirmation with focus move,
// privacy link adjacent to submit, unticked explicit consent, newsletter
// opt-in kept separate from enquiry consent.
export default function EnquiryForm({ sourcePage }: { sourcePage: string }) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const confirmationRef = useRef<HTMLDivElement>(null);

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.message.trim()) e.message = "Enter a message.";
    if (!form.consent) e.consent = "You must consent to be contacted to submit this form.";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sourcePage })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.fieldErrors) {
          setErrors(body.fieldErrors);
          setStatus("idle");
          return;
        }
        throw new Error("Submission failed");
      }

      setStatus("success");
      setForm(INITIAL);
      // FR-048: move focus to the confirmation message
      requestAnimationFrame(() => confirmationRef.current?.focus());
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        ref={confirmationRef}
        tabIndex={-1}
        role="status"
        className="rounded border border-green-600 bg-green-50 p-4 text-green-900"
      >
        <p className="font-semibold">Thanks â€” your enquiry has been sent.</p>
        <p>We'll be in touch shortly. A confirmation has been sent to your email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 max-w-xl">
      {/* Honeypot â€” hidden from sighted users and screen readers, bots fill it */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Leave this field blank</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />
      </div>

      <Field
        label="Name"
        id="name"
        required
        value={form.name}
        error={errors.name}
        onChange={(v) => setForm({ ...form, name: v })}
      />
      <Field
        label="Email"
        id="email"
        type="email"
        required
        value={form.email}
        error={errors.email}
        onChange={(v) => setForm({ ...form, email: v })}
      />
      <Field
        label="Phone (optional)"
        id="phone"
        type="tel"
        value={form.phone}
        onChange={(v) => setForm({ ...form, phone: v })}
      />

      <div>
        <label htmlFor="enquiryType" className="block font-medium mb-1">Enquiry type</label>
        <select
          id="enquiryType"
          className="w-full border border-black/15 rounded-lg px-4 py-2.5 focus:outline focus:outline-2 focus:outline-brand-accent focus:border-brand-accent min-h-[44px]"
          value={form.enquiryType}
          onChange={(e) => setForm({ ...form, enquiryType: e.target.value })}
        >
          <option>General enquiry</option>
          <option>New project</option>
          <option>Careers</option>
          <option>Media</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block font-medium mb-1">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={5}
          className="w-full border border-black/15 rounded-lg px-4 py-2.5 focus:outline focus:outline-2 focus:outline-brand-accent focus:border-brand-accent"
          value={form.message}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        {errors.message && (
          <p id="message-error" role="alert" className="text-red-700 text-sm mt-1">
            {errors.message}
          </p>
        )}
      </div>

      {/* FR-049: privacy statement immediately adjacent to submit */}
      <div className="space-y-2 border-t border-black/10 pt-4">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.consent}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
          />
          <span>
            I consent to Croft Developments contacting me about this enquiry. See our{" "}
            <a href="/privacy-policy" className="underline">Privacy Policy</a> for how your
            information is used.
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" role="alert" className="text-red-700 text-sm">
            {errors.consent}
          </p>
        )}

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.newsletterOptIn}
            onChange={(e) => setForm({ ...form, newsletterOptIn: e.target.checked })}
          />
          <span>
            Also send me Croft Developments news (separate from the above â€” you'll get a
            confirmation email to opt in).
          </span>
        </label>
      </div>

      {status === "error" && (
        <p role="alert" className="text-red-700">
          Something went wrong sending your enquiry. Please try again or call us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-brand-accent text-white font-medium px-6 py-3 rounded min-h-[44px] disabled:opacity-60 hover:opacity-90"
      >
        {status === "submitting" ? "Sendingâ€¦" : "Send enquiry"}
      </button>
    </form>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  error,
  type = "text",
  required = false
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-medium mb-1">
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        className="w-full border border-black/15 rounded-lg px-4 py-2.5 focus:outline focus:outline-2 focus:outline-brand-accent focus:border-brand-accent min-h-[44px]"
        value={value}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-red-700 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
