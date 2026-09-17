import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
  align = "left",
  onDark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "text-center")}>
        {eyebrow && <p className={cn("eyebrow", onDark && "eyebrow-on-dark")}>{eyebrow}</p>}
        <h2
          className={cn(
            "display mt-2.5 text-3xl sm:text-4xl lg:text-[2.6rem]",
            onDark && "text-champagne",
          )}
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-3 text-sm leading-relaxed sm:text-base",
              onDark ? "text-champagne/70" : "text-fg-muted",
            )}
          >
            {description}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-2 text-[0.6875rem] tracking-[0.16em] uppercase transition-colors",
            onDark ? "text-gold-light hover:text-champagne" : "text-accent-ink hover:text-fg",
          )}
        >
          {linkLabel}
          <ArrowRight className="size-3.5 transition-transform duration-300 ease-luxe group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
