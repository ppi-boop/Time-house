import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  className,
  showCount = true,
  size = "md",
}: {
  value: number;
  count?: number;
  className?: string;
  showCount?: boolean;
  /** "sm" keeps the stars and the count on one line inside a narrow card. */
  size?: "sm" | "md";
}) {
  const rounded = Math.round(value * 2) / 2;
  const starSize = size === "sm" ? "size-3" : "size-3.5";

  return (
    <div className={cn("flex items-center gap-1.5", size === "sm" && "gap-1", className)}>
      <span className="flex shrink-0 items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              rounded >= star
                ? "fill-accent text-accent"
                : rounded >= star - 0.5
                  ? "fill-accent/50 text-accent"
                  : "fill-transparent text-line-strong",
            )}
          />
        ))}
      </span>
      <span className="sr-only">
        Rated {value} out of 5{count ? ` from ${count} reviews` : ""}
      </span>
      {showCount && count !== undefined && (
        <span
          className={cn("whitespace-nowrap text-fg-subtle", size === "sm" ? "text-[0.6875rem]" : "text-xs")}
          aria-hidden="true"
        >
          {value.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}
