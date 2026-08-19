import Link from "next/link";

interface PostCardProps {
  href: string;
  title: string;
  image?: string | null;
  excerpt?: string;
  date?: string;
  eyebrow?: string;
}

// Matches the reference site's `.saral-post-grid` card: image on top, a
// circular orange "read more" button that lifts up on hover, and a light
// heading. Used for Services (home + listing) and can be reused anywhere
// else a Croft-style content card is needed.
export default function PostCard({ href, title, image, excerpt, date, eyebrow }: PostCardProps) {
  return (
    <article className="group relative border border-border flex h-full flex-col overflow-hidden rounded-card bg-white transition-shadow duration-400 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
      <Link href={href} tabIndex={-1} aria-hidden="true">
        <span className="relative block aspect-[3/2] overflow-hidden bg-surfaceAlt">
          {image ? (
            <img src={image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-xs text-stone/50">No image</span>
          )}
        </span>
      </Link>

      <div className="relative flex flex-1 flex-col p-5">
        <span aria-hidden="true" className="bg-primary group-hover:bg-dark group-hover:text-primary absolute top-[-25px] right-[4%] flex h-[52px] w-[52px] items-center justify-center rounded-full text-white shadow-[0_3px_10px_rgba(0,0,0,0.4)] transition-all duration-300 lg:group-hover:top-[-40px]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
            <path d="M11 5v3.2C6.5 8.8 3.6 11.8 3 17c1.9-2.6 4.5-3.8 8-3.8V16l7-5.5L11 5Z" />
          </svg>
        </span>

        {eyebrow && <span className="text-xs uppercase tracking-wide text-primary font-semibold mb-2">{eyebrow}</span>}

        <h3 className="mb-2.5 font-light text-[22px] leading-[30px]">
          <Link href={href} className="text-dark hover:text-primary">{title}</Link>
        </h3>

        {date && <p className="text-muted mb-2.5 text-[14px]">{date}</p>}

        {excerpt && <p className="font-heading text-[15px] leading-[26px] text-text">{excerpt}</p>}
      </div>
    </article>
  );
}