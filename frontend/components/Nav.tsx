"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { label: "Home", url: "/" },
  { label: "Projects", url: "/projects" },
  { label: "People", url: "/about" },
  { label: "Media", url: "/news" },
  { label: "Contact", url: "/contact" }
];

export default function Nav({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function isCurrent(url: string) {
    // Before hydration completes, always report "not active" so the server-
    // rendered HTML and the first client render match exactly — avoids the
    // aria-current/className hydration mismatch warning.
    if (!mounted) return false;
    return url === "/" ? pathname === "/" : pathname.startsWith(url);
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
      <div className="mx-auto max-w-[1170px] flex items-center justify-between gap-4 px-4">
        <Link href="/" className="block shrink-0 py-[15px]">
          {logoUrl ? (
            <Image src={logoUrl} alt="Croft Developments" width={202} height={54} priority className="h-auto w-[160px] lg:w-[202px]" />
          ) : (
            <span className="flex flex-col leading-none">
              <span className="font-accent text-2xl text-dark whitespace-nowrap">Croft Developments</span>
            </span>
          )}
        </Link>

        <div className="hidden lg:flex items-center gap-6 ml-auto">
          <nav aria-label="Primary">
            <ul className="flex items-center">
              {NAV_ITEMS.map((item: any) => {
                const current = isCurrent(item.url);
                return (
                  <li key={item.url}>
                    <Link href={item.url} aria-current={current ? "page" : undefined} className={"font-heading inline-block whitespace-nowrap px-[12px] text-[16px] leading-[60px] font-normal transition-colors " + (current ? "text-primary" : "text-dark") + " hover:text-primary"}>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link href="/contact" className="inline-flex items-center bg-primary text-white font-medium text-sm px-6 py-2.5 rounded-pill hover:bg-[#d9701a] transition-colors whitespace-nowrap">Get in Touch</Link>
        </div>

        <button type="button" className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((v) => !v)}>
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className="text-2xl leading-none text-dark">{open ? "X" : "="}</span>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Primary" className="lg:hidden border-t border-[#e9e9e9] bg-white px-4 py-4">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item: any) => {
              const current = isCurrent(item.url);
              return (
                <li key={item.url}>
                  <Link href={item.url} aria-current={current ? "page" : undefined} onClick={() => setOpen(false)} className={"block py-3 min-h-[44px] text-base font-heading " + (current ? "text-primary" : "text-dark")}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2">
              <Link href="/contact" onClick={() => setOpen(false)} className="inline-flex items-center bg-primary text-white font-medium text-sm px-5 py-2.5 rounded-pill min-h-[44px] w-full justify-center">Get in Touch</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
