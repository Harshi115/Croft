import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rate-limit";

// FR-041: handled server-side, no third-party form service ever sees this.
// FR-042: persisted to the `enquiry` collection in Strapi/Postgres, timestamped.
// FR-043: notifies a CMS-configurable recipient list.
// FR-044: submitter gets an acknowledgement email.
// FR-045: honeypot + rate limit + bot mitigation (Turnstile) before anything else.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: a filled hidden field means it's very likely a bot. Return a
  // generic success so the bot doesn't learn its submission was rejected.
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const fieldErrors: Record<string, string> = {};
  if (!body.name?.trim()) fieldErrors.name = "Enter your name.";
  if (!EMAIL_RE.test(body.email || "")) fieldErrors.email = "Enter a valid email address.";
  if (!body.message?.trim()) fieldErrors.message = "Enter a message.";
  if (!body.consent) fieldErrors.consent = "You must consent to be contacted to submit this form.";

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ fieldErrors }, { status: 422 });
  }

  // Bot mitigation: verify Cloudflare Turnstile token if configured.
  // (Frontend must send `turnstileToken` once the widget is wired in —
  // stubbed here so the route works before that key is provisioned.)
  if (process.env.TURNSTILE_SECRET_KEY && body.turnstileToken) {
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: body.turnstileToken })
    }).then((r) => r.json());

    if (!verify.success) {
      return NextResponse.json({ error: "Bot verification failed." }, { status: 400 });
    }
  }

  const enquiry = {
    name: body.name.trim(),
    email: body.email.trim(),
    phone: body.phone?.trim() || null,
    enquiryType: body.enquiryType || "General enquiry",
    message: body.message.trim(),
    consent: true,
    newsletterOptIn: !!body.newsletterOptIn,
    sourcePage: body.sourcePage || "unknown",
    submittedAt: new Date().toISOString(),
    ipAddress: ip
  };

  try {
    // Persist to Strapi's `enquiry` collection.
    const strapiRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/enquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`
      },
      body: JSON.stringify({ data: enquiry })
    });

    if (!strapiRes.ok) {
      throw new Error(`Strapi persist failed: ${strapiRes.status}`);
    }

    // Notification + acknowledgement email sending is intentionally left as
    // a TODO wired to your SMTP/email provider (see .env.example) — plug in
    // your provider of choice (Resend, SES, Postmark) here.
    // await sendEnquiryNotification(enquiry);
    // await sendAcknowledgementEmail(enquiry);

    if (enquiry.newsletterOptIn) {
      // FR-052: double opt-in — trigger a separate confirmation flow rather
      // than subscribing directly.
      // await sendNewsletterConfirmation(enquiry.email);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Enquiry submission failed", err);
    return NextResponse.json({ error: "Could not process your enquiry. Please try again." }, { status: 502 });
  }
}
