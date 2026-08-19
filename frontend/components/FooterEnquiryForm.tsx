"use client";

import { useState } from "react";

// A compact version of the enquiry form, for the footer — same backend
// endpoint and same consent/honeypot protections as the full form on
// /contact, just fewer fields to fit the space.
export default function FooterEnquiryForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "", consent: false, website: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!form.consent) {
      setError("Please confirm you're okay being contacted.");
      return;
    }
    setError("");
    setStatus("submitting");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, enquiryType: "General enquiry", sourcePage: "footer" })
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setForm({ name: "", email: "", message: "", consent: false, website: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="text-white/90 text-sm">
        Thanks — we'll be in touch shortly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div className="hidden" aria-hidden="true">
        <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
      </div>

      <input
        type="email"
        placeholder="E-mail"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/60 focus:outline focus:outline-2 focus:outline-brand-accent"
      />
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/60 focus:outline focus:outline-2 focus:outline-brand-accent"
      />
      <textarea
        placeholder="Comments"
        rows={3}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-white/60 focus:outline focus:outline-2 focus:outline-brand-accent"
      />
      <label className="flex items-start gap-2 text-xs text-white/70">
        <input type="checkbox" className="mt-0.5" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
        <span>I agree to be contacted about this enquiry.</span>
      </label>
      {error && <p role="alert" className="text-xs text-red-300">{error}</p>}
      {status === "error" && <p role="alert" className="text-xs text-red-300">Something went wrong — please try again.</p>}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-brand-accent text-white text-sm font-medium px-6 py-2.5 rounded-full min-h-[40px] hover:bg-brand-accent-dark transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
