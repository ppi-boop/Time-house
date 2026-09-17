"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useBottomBar } from "@/store/useBottomBar";

/** Appears once the page is long behind you. Sits left of the WhatsApp button. */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const barVisible = useBottomBar((s) => s.visible);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={cn(
        "fixed left-4 z-40 flex size-11 items-center justify-center rounded-full border border-line bg-surface text-fg-muted shadow-[var(--shadow-soft)] transition-all duration-500 ease-luxe hover:border-accent hover:text-fg sm:left-6",
        barVisible ? "bottom-[5.25rem] lg:bottom-6" : "bottom-4 sm:bottom-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ArrowUp className="size-4" />
    </button>
  );
}
