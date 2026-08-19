import { NextRequest, NextResponse } from "next/server";

// FR-052: double opt-in - this just records the subscription request.
// Confirmation email sending is a TODO once an email provider is wired up
// (see the same TODO in app/api/enquiry/route.ts).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = body?.email?.trim();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 422 });
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/newsletter-subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`
      },
      body: JSON.stringify({
        data: { email, subscribedAt: new Date().toISOString(), confirmed: false }
      })
    });

    if (!res.ok) throw new Error(`Strapi error: ${res.status}`);

    // TODO: send a confirmation email here once an email provider is configured.

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter subscribe failed", err);
    return NextResponse.json({ error: "Could not subscribe right now. Please try again." }, { status: 502 });
  }
}
