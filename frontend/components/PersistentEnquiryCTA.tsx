import Link from "next/link";

// FR-007: a persistent enquiry call-to-action on every template. Fixed to the
// bottom-right on all viewports; stays clear of the mobile nav toggle.
export default function PersistentEnquiryCTA() {
  return (
    <Link
      href="/contact"
      className="fixed bottom-5 right-5 z-30 bg-brand-accent text-white font-medium px-5 py-3 rounded-full shadow-lg min-h-[44px] flex items-center gap-2 hover:opacity-90"
    >
      <span aria-hidden="true">✉</span>
      Enquire now
    </Link>
  );
}
