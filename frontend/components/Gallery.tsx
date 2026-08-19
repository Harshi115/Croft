"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface GalleryImage {
  url: string;
  alt: string;
}

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  function open(i: number) {
    triggerRef.current = document.activeElement as HTMLElement;
    setOpenIndex(i);
  }

  function close() {
    setOpenIndex(null);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (openIndex === null) return;

    dialogRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
      } else if (e.key === "ArrowRight") {
        setOpenIndex((i) => (i === null ? i : (i + 1) % images.length));
      } else if (e.key === "ArrowLeft") {
        setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
      } else if (e.key === "Tab") {
        // Simple focus trap: only the close button is focusable in the dialog
        e.preventDefault();
        dialogRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openIndex, images.length]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8" role="list" aria-label="Project gallery">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => open(i)}
            className="relative aspect-square rounded overflow-hidden focus:outline focus:outline-2 focus:outline-brand"
          >
            <Image src={img.url} alt={img.alt} fill sizes="33vw" className="object-cover" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${openIndex + 1} of ${images.length}`}
          ref={dialogRef}
          tabIndex={-1}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 min-w-[44px] min-h-[44px] text-white text-2xl"
            aria-label="Close gallery"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={() => setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length))}
            className="absolute left-4 min-w-[44px] min-h-[44px] text-white text-3xl"
            aria-label="Previous image"
          >
            ‹
          </button>
          <div className="relative w-full max-w-4xl h-[70vh] mx-16">
            <Image
              src={images[openIndex].url}
              alt={images[openIndex].alt}
              fill
              className="object-contain"
            />
          </div>
          <button
            type="button"
            onClick={() => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length))}
            className="absolute right-4 min-w-[44px] min-h-[44px] text-white text-3xl"
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
