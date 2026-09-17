"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Main image with thumbnails on desktop and a swipeable rail on mobile.
 * Hovering the main image pans a 1.8x zoom around the cursor.
 */
export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const railRef = useRef<HTMLDivElement>(null);

  function onMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  /** Keep the thumbnail state in step with a mobile swipe. */
  function onRailScroll() {
    const rail = railRef.current;
    if (!rail) return;
    const index = Math.round(rail.scrollLeft / rail.clientWidth);
    setActive(Math.min(images.length - 1, Math.max(0, index)));
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row-reverse lg:gap-6">
      {/* Mobile: swipe rail */}
      <div
        ref={railRef}
        onScroll={onRailScroll}
        className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain lg:hidden"
      >
        {images.map((src, index) => (
          <div key={src} className="relative aspect-4/5 w-full shrink-0 snap-center overflow-hidden rounded-[var(--radius-lg)] bg-surface-2">
            <Image
              src={src}
              alt={`${name} — view ${index + 1} of ${images.length}`}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Desktop: single image with hover zoom */}
      <div
        className="relative hidden aspect-4/5 flex-1 cursor-zoom-in overflow-hidden rounded-[var(--radius-lg)] bg-surface-2 lg:block"
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={onMove}
      >
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${name} — view ${active + 1} of ${images.length}`}
          fill
          sizes="(max-width: 1024px) 100vw, 45vw"
          priority
          className="object-cover transition-transform duration-500 ease-luxe"
          style={{
            transform: zooming ? "scale(1.8)" : "scale(1)",
            transformOrigin: origin,
          }}
        />
      </div>

      {/* Thumbnails */}
      <div
        role="tablist"
        aria-label={`${name} images`}
        className="no-scrollbar flex gap-3 overflow-x-auto overscroll-x-contain lg:w-20 lg:flex-col lg:overflow-visible"
      >
        {images.map((src, index) => (
          <button
            key={src}
            role="tab"
            type="button"
            aria-selected={active === index}
            aria-label={`View image ${index + 1}`}
            onClick={() => {
              setActive(index);
              railRef.current?.scrollTo({
                left: index * railRef.current.clientWidth,
                behavior: "smooth",
              });
            }}
            className={cn(
              "relative aspect-4/5 w-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border bg-surface-2 transition-all duration-300 ease-luxe hover:-translate-y-0.5 lg:w-full",
              active === index
                ? "border-accent shadow-[var(--shadow-soft)]"
                : "border-line hover:border-line-strong",
            )}
          >
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
