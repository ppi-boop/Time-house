"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Rating } from "@/components/ui/Rating";
import { cn } from "@/lib/utils";
import type { TestimonialDoc } from "@/lib/db/collections";

/**
 * The quotes, as a carousel that moves on its own.
 *
 * One card is in focus and sharp; its neighbours sit behind a little blur and
 * are scaled back, so the eye lands in the middle without the rest of the row
 * disappearing.
 *
 * The list is laid out three times over and the carousel lives in the middle
 * copy, which is what keeps a card on both sides at all times — with only a
 * handful of quotes, a plain track would leave the first one with nothing to
 * its left. Once a slide has finished, the index is quietly rebased into the
 * middle copy with the transition switched off, so the loop never runs out and
 * the jump is never visible.
 *
 * The track is a normal flex row inside an overflow-hidden viewport: it takes
 * its height from the tallest card, and the translation can never push the page
 * sideways.
 */

const INTERVAL = 5500;
const SLIDE_MS = 700;

export function TestimonialCarousel({ items }: { items: TestimonialDoc[] }) {
  const count = items.length;
  const looping = count > 1;

  // Three copies when there is something to loop; the middle one is home.
  const slides = looping ? [...items, ...items, ...items] : items;
  const home = looping ? count : 0;

  const [active, setActive] = useState(home);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);

  /** Which of the real quotes is in the middle right now. */
  const currentSlot = ((active % count) + count) % count;

  const go = useCallback((by: number) => setActive((a) => a + by), []);

  /** A dot jumps by the shorter way round rather than winding back. */
  function jumpTo(slot: number) {
    let by = slot - currentSlot;
    if (by > count / 2) by -= count;
    if (by < -count / 2) by += count;
    setActive((a) => a + by);
  }

  /* Move on by itself, unless there is a reason not to: the pointer is over it,
     something inside has keyboard focus, the tab is in the background, or the
     reader has asked for reduced motion. */
  useEffect(() => {
    if (!looping || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      if (!document.hidden) setActive((a) => a + 1);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [looping, paused]);

  /* Once the slide has landed, step back into the middle copy without moving
     anything on screen. */
  useEffect(() => {
    if (!looping) return;
    if (active >= home && active < home + count) return;

    const timer = setTimeout(() => {
      setAnimate(false);
      setActive(home + (((active % count) + count) % count));
    }, SLIDE_MS + 30);
    return () => clearTimeout(timer);
  }, [active, looping, home, count]);

  /* Re-arm the transition a frame after the silent rebase has painted. */
  useEffect(() => {
    if (animate) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [animate]);

  /* Drag or swipe across the cards. */
  const drag = useRef<{ x: number; id: number } | null>(null);
  function onPointerDown(e: React.PointerEvent) {
    drag.current = { x: e.clientX, id: e.pointerId };
  }
  function onPointerUp(e: React.PointerEvent) {
    const start = drag.current;
    drag.current = null;
    if (!start || start.id !== e.pointerId) return;
    const moved = e.clientX - start.x;
    if (Math.abs(moved) > 45) go(moved < 0 ? 1 : -1);
  }

  return (
    <div
      className="mt-10"
      role="group"
      aria-roledescription="carousel"
      aria-label="What people tell us"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* The viewport. Its side padding centres whichever card the track has
          brought into position, so the maths below needs no measuring. */}
      <div
        className={cn(
          "overflow-hidden",
          "[--card:min(84vw,26rem)] [--gap:1rem]",
          "md:[--card:23rem] md:[--gap:1.25rem]",
          "xl:[--card:25rem]",
          "px-[calc((100%-var(--card))/2)]",
        )}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current = null)}
      >
        <ul
          className={cn(
            "flex items-stretch gap-[var(--gap)] ease-luxe",
            animate
              ? "transition-transform duration-[700ms] motion-reduce:transition-none"
              : "transition-none",
          )}
          style={{ transform: `translateX(calc(${-active} * (var(--card) + var(--gap))))` }}
        >
          {slides.map((item, index) => {
            const distance = Math.abs(index - active);
            // Only the middle copy is read out; the other two are scenery.
            const duplicate = looping && (index < home || index >= home + count);

            return (
              <li
                key={`${item.id}-${index}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${(index % count) + 1} of ${count}`}
                aria-hidden={duplicate || undefined}
                className="w-[var(--card)] shrink-0"
              >
                <figure
                  className={cn(
                    "flex h-full flex-col rounded-[var(--radius-lg)] border bg-surface-2 p-6 sm:p-8",
                    // Off during the rebase as well as the track, or the card
                    // arriving in the middle would animate out of its blur and
                    // the loop would show a flicker once a lap.
                    animate
                      ? "transition-[transform,filter,opacity,border-color,box-shadow] duration-[700ms] ease-luxe motion-reduce:transition-none"
                      : "transition-none",
                    distance === 0 &&
                      "scale-100 border-line-strong opacity-100 shadow-[var(--shadow-lift)] blur-none",
                    // Enough blur to push them back, not so much that the words
                    // stop looking like words.
                    distance === 1 && "scale-[0.88] border-line opacity-55 blur-[2.5px]",
                    distance > 1 && "scale-[0.84] border-line opacity-30 blur-[4px]",
                  )}
                >
                  <Quote className="size-6 text-accent" aria-hidden="true" />
                  <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-fg-muted">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-7 border-t border-line pt-5">
                    <Rating value={item.rating} showCount={false} className="mb-3" />
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="mt-0.5 text-xs text-fg-subtle">{item.detail}</p>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>

      {looping && (
        <div className="mt-8 flex items-center justify-center gap-5">
          <Arrow label="Previous quote" onClick={() => go(-1)}>
            <ChevronLeft className="size-4" />
          </Arrow>

          <ul className="flex items-center gap-2.5">
            {items.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => jumpTo(index)}
                  aria-label={`Show quote ${index + 1}`}
                  aria-current={index === currentSlot}
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-500 ease-luxe",
                    index === currentSlot
                      ? "w-7 bg-accent"
                      : "w-1.5 bg-line-strong hover:bg-fg-subtle",
                  )}
                />
              </li>
            ))}
          </ul>

          <Arrow label="Next quote" onClick={() => go(1)}>
            <ChevronRight className="size-4" />
          </Arrow>
        </div>
      )}
    </div>
  );
}

function Arrow({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:border-accent hover:text-fg"
    >
      {children}
    </button>
  );
}
