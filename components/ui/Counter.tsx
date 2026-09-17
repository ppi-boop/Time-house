"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

/** Counts up once, when it first scrolls into view. */
export function Counter({ to, duration = 1400 }: { to: number; duration?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>(40);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(to);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.round(easeOutQuint(progress) * to));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration]);

  return <span ref={ref}>{value}</span>;
}
