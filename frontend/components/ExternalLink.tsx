import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

// FR-009: external links are visually indicated, open in a new tab, and carry
// rel="noopener noreferrer". Internal links (starting with "/" or same-origin)
// render as a normal Next.js Link instead.
export default function ExternalLink({ href, children, className = "", ...rest }: ExternalLinkProps) {
  const isExternal = /^https?:\/\//.test(href) && !href.includes("croft.com.au");

  if (!isExternal) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} inline-flex items-center gap-1`}
      {...rest}
    >
      {children}
      <span aria-hidden="true" className="text-xs">↗</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
