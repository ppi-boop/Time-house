"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

/**
 * A restrained entrance: a 14px rise, once. The transition lives in CSS, so
 * `prefers-reduced-motion` switches it off without any JS branch.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-shown={inView}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      className={cn("reveal", className)}
    >
      {children}
    </div>
  );
}
