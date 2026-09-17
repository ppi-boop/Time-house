"use client";

import Image from "next/image";
import Link from "next/link";
import { useShop } from "@/components/shop/ShopProvider";
import { cn } from "@/lib/utils";

/**
 * Wordmark plus a mark.
 *
 * The mark is the uploaded logo when the shop has set one under Shop details,
 * and the drawn dial otherwise — matching what that field promises. The
 * uploaded picture keeps its own proportions, so a square badge and a wide
 * lockup both sit on the same line as the name.
 */
export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const shop = useShop();

  return (
    <Link
      href="/"
      aria-label={`${shop.name} — home`}
      className={cn("group flex min-w-0 items-center gap-2 sm:gap-2.5", className)}
    >
      {shop.logo ? (
        <Image
          src={shop.logo}
          alt=""
          width={160}
          height={40}
          sizes="160px"
          priority
          className="h-6 w-auto max-w-[9rem] shrink-0 object-contain sm:h-7"
        />
      ) : (
        <svg
          viewBox="0 0 32 32"
          className={cn(
            "size-6 shrink-0 transition-transform duration-500 ease-luxe group-hover:rotate-12 sm:size-7",
            onDark ? "text-gold-light" : "text-accent",
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="12" />
          <circle cx="16" cy="16" r="9" strokeOpacity="0.4" />
          <path d="M16 16V9.5" strokeLinecap="round" />
          <path d="M16 16l4.5 2.5" strokeLinecap="round" />
          <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      )}
      <span
        className={cn(
          "truncate font-serif text-base leading-tight tracking-[0.04em] sm:text-xl sm:tracking-[0.06em]",
          onDark ? "text-champagne" : "text-fg",
        )}
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {shop.name}
      </span>
    </Link>
  );
}
