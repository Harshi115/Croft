"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Hero({ eyebrow, heading, supportingCopy, ctaLabel, ctaHref, slides }: { eyebrow?: string; heading?: string; supportingCopy?: string; ctaLabel?: string; ctaHref?: string; slides?: any[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion.current) setPaused(true);
  }, []);

  useEffect(() => {
    if (!slides || slides.length < 2 || paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides, paused]);

  const effectiveSlides = slides && slides.length > 0 ? slides : [{ image: "", heading: heading, ctaLabel: ctaLabel, ctaHref: ctaHref }];

  return (
    <section aria-label="Featured Croft Developments projects" className="relative w-full overflow-hidden bg-[#31343c]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => !reducedMotion.current && setPaused(false)}>
      <div className="relative aspect-[1920/767] max-h-[767px] min-h-[280px] w-full">
        {effectiveSlides.map((slide: any, i: number) => (
          <div key={i} aria-hidden={i !== index} className={"absolute inset-0 transition-opacity duration-1000 " + (i === index ? "opacity-100" : "pointer-events-none opacity-0")}>
            {slide.image && (
              <Image src={slide.image} alt="" fill sizes="100vw" priority={i === 0} quality={90} className="object-cover object-center" />
            )}

            {i === 0 && (
              <div className="absolute inset-x-0 top-[20%] sm:top-[24%] bg-black/20 py-2">
                {eyebrow && (
                  <p className="font-body text-xs sm:text-sm uppercase tracking-[0.2em] text-primary font-semibold text-center mb-2">{eyebrow}</p>
                )}
                <h1 className="font-heading m-0 px-4 text-center text-[22px] leading-[1.15] font-normal text-white md:text-[36px] lg:text-[45px] xl:text-[62px]">{slide.heading || heading}</h1>
              </div>
            )}

            {(slide.caption || (i === 0 && supportingCopy) || slide.ctaLabel) && (
              <div className="absolute inset-x-0 bottom-[8%] bg-black/50 py-2.5 lg:right-auto lg:left-0 lg:w-[70%] lg:max-w-[1350px]">
                <div className="px-4 lg:pl-5 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  {(slide.caption || (i === 0 && supportingCopy)) && (
                    <p className="font-body m-0 text-center text-[15px] leading-[22px] font-normal text-white lg:text-left lg:text-[18px]">{slide.caption || supportingCopy}</p>
                  )}
                  {(slide.ctaLabel || ctaLabel) && (slide.ctaHref || ctaHref) && (
                    <a href={slide.ctaHref || ctaHref} className="inline-flex shrink-0 items-center bg-primary text-white font-medium px-6 py-2.5 rounded-pill min-h-[40px] hover:bg-[#d9701a] transition-colors whitespace-nowrap">{slide.ctaLabel || ctaLabel}</a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {effectiveSlides.length > 1 && (
        <div className="absolute inset-x-0 bottom-[10px] flex justify-center gap-2">
          {effectiveSlides.map((_: any, i: number) => (
            <button key={i} type="button" aria-label={"Show slide " + (i + 1)} aria-current={i === index} onClick={() => setIndex(i)} className={"h-[10px] w-[10px] rounded-full transition-colors " + (i === index ? "bg-primary" : "bg-white/60 hover:bg-white")} />
          ))}
        </div>
      )}
    </section>
  );
}
