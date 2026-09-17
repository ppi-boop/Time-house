"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The line that appears after a save or a delete.
 *
 * It is driven by a flag in the address (?saved=1), which used to mean it stayed
 * on screen for good — and came back on every refresh, and on every search or
 * filter that kept the query string. So it now takes the flag out of the address
 * as soon as it has been read, and fades itself out shortly after.
 */

const VISIBLE_FOR = 4500;
const FADE = 500;

export function AdminNotice({
  children,
  tone = "success",
}: {
  children: React.ReactNode;
  /** A refusal stays put — it is telling the shop why nothing happened. */
  tone?: "success" | "warning";
}) {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");

  useEffect(() => {
    // replaceState rather than router.replace: no navigation, no refetch, and
    // the flag is gone from the address bar the moment the notice is shown.
    const url = new URL(window.location.href);
    const stale = ["saved", "deleted", "uploaded"].filter((flag) =>
      url.searchParams.has(flag),
    );
    if (stale.length) {
      for (const flag of stale) url.searchParams.delete(flag);
      window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    }

    if (tone === "warning") return;
    const timer = setTimeout(() => setPhase("out"), VISIBLE_FOR);
    return () => clearTimeout(timer);
  }, [tone]);

  useEffect(() => {
    if (phase !== "out") return;
    // Unmount on a timer rather than on transitionend, which never fires for
    // anyone who has asked for reduced motion.
    const timer = setTimeout(() => setPhase("gone"), FADE);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <p
      role="status"
      className={cn(
        "mt-6 flex items-start gap-3 rounded-[var(--radius-sm)] border px-4 py-3 text-sm",
        // There is no red in this palette; a refusal reads as a firmer,
        // neutral panel rather than an invented alarm colour.
        tone === "warning"
          ? "border-line-strong bg-surface-3 text-fg"
          : "border-accent/40 bg-gold/10 text-accent-ink",
        "transition-opacity duration-500 motion-reduce:transition-none",
        phase === "out" ? "opacity-0" : "opacity-100",
      )}
    >
      <span className="min-w-0 flex-1">{children}</span>
      {/* Still dismissible by hand, for anyone who needs longer than the timer. */}
      <button
        type="button"
        onClick={() => setPhase("out")}
        aria-label="Dismiss this message"
        className="-my-1 -mr-1 shrink-0 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100"
      >
        <X className="size-4" />
      </button>
    </p>
  );
}
