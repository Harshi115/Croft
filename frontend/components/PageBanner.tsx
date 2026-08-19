import Link from "next/link";

export default function PageBanner({ eyebrow, title, breadcrumb }: { eyebrow?: string; title: string; breadcrumb?: { label: string; href?: string }[] }) {
  return (
    <div className="bg-[#31343c]">
      <div className="mx-auto max-w-[1170px] px-4 py-[30px]">
        {eyebrow && (
          <p className="font-body text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">
            {eyebrow}
          </p>
        )}
        <h1 className="font-heading text-[34px] leading-[40px] sm:text-[48px] sm:leading-[52px] font-light text-white mb-[20px]">
          {title}
        </h1>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="text-sm text-white/70">
            <ol className="flex flex-wrap items-center gap-1">
              {breadcrumb.map((item: any, i: number) => (
                <li key={i} className="flex items-center gap-1">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {item.href ? (
                    <Link href={item.href} className="hover:text-primary transition-colors">{item.label}</Link>
                  ) : (
                    <span aria-current="page" className="text-white font-medium">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </div>
  );
}
