export interface SocialLink {
  platform: string;
  url: string;
}

const ICONS: Record<string, JSX.Element> = {
  linkedin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  ),
  youtube: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14C4.49 20.5 12 20.5 12 20.5s7.51 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.6 15.6V8.4l6.4 3.6-6.4 3.6z" />
    </svg>
  )
};

export default function TopBar({
  phone,
  email,
  socialLinks
}: {
  phone?: string | null;
  email?: string | null;
  socialLinks?: SocialLink[] | null;
}) {
  if (!phone && !email && (!socialLinks || socialLinks.length === 0)) return null;

  return (
    <div className="bg-brand-accent text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-10 flex items-center justify-between text-sm">
        <div className="flex items-center gap-5">
          {phone && (
            <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.6 10.8c1.4 2.8 3.7 5.1 6.5 6.5l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 3.6c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8z" />
              </svg>
              <span className="hidden sm:inline">{phone}</span>
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-13zm2.2.5 7.8 6.2L19.8 6H4.2zM20 8.1l-7.4 5.9a1 1 0 0 1-1.2 0L4 8.1V18h16V8.1z" />
              </svg>
              <span className="hidden sm:inline">{email}</span>
            </a>
          )}
        </div>
        {socialLinks && socialLinks.length > 0 && (
          <div className="flex items-center gap-4">
            {socialLinks.map((s) => (
              <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform} className="hover:opacity-80 transition-opacity">
                {ICONS[s.platform] || s.platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
