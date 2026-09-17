"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fires once when the element first scrolls into view. Small enough that it
 * isn't worth pulling an animation library in for.
 *
 * `bottomInset` delays the trigger until the element is that far inside the
 * bottom edge. It is applied vertically only — a negative horizontal margin
 * shrinks the root sideways too, and a narrow element sitting in the page's
 * side gutter would then never intersect at all.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  bottomInset = 60,
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No IntersectionObserver (or a very old browser): show the content.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: `0px 0px -${bottomInset}px 0px` },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [bottomInset]);

  return { ref, inView };
}
