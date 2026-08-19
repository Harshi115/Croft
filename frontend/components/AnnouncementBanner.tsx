"use client";

import { useState } from "react";

export interface AnnouncementData {
  message: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  linkHref?: string;
  linkLabel?: string;
}

// FR-008: dismissible, date-range-controlled site-wide announcement banner.
export default function AnnouncementBanner({ data }: { data?: AnnouncementData }) {
  const [dismissed, setDismissed] = useState(false);

  if (!data || !data.active || dismissed) return null;

  const now = new Date();
  if (data.startDate && now < new Date(data.startDate)) return null;
  if (data.endDate && now > new Date(data.endDate)) return null;

  return (
    <div className="bg-brand-accent text-brand-950 px-4 py-2 text-sm flex items-center justify-center gap-3 relative">
      <span>
        {data.message}
        {data.linkHref && data.linkLabel && (
          <a href={data.linkHref} className="underline ml-2 font-medium">{data.linkLabel}</a>
        )}
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-3 min-w-[32px] min-h-[32px]"
      >
        âœ•
      </button>
    </div>
  );
}
