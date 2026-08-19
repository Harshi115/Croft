"use client";

import { useState } from "react";

export default function NewsletterBand() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(ev) {
    ev.preventDefault();
    setError("");
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="bg-[#2c2f36] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center gap-4">
        <p className="font-heading text-2xl sm:text-3xl whitespace-nowrap">Subscribe For Newsletter</p>

        {status === "success" ? (
          <p role="status" className="text-white/90 sm:ml-auto">Thanks - check your inbox to confirm.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col sm:flex-row gap-3 w-full sm:max-w-xl sm:ml-auto">
            <label htmlFor="newsletter-email" className="sr-only">Your email address</label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-white placeholder-white/60 focus:outline focus:outline-2 focus:outline-brand-accent"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="bg-brand-accent text-white font-medium px-7 py-3 rounded-full min-h-[44px] hover:bg-brand-accent-dark transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {status === "submitting" ? "Sending..." : "Subscribe"}
            </button>
          </form>
        )}
      </div>
      {error && (
        <p role="alert" className="text-center text-sm text-red-300 pb-4">{error}</p>
      )}
    </div>
  );
}
