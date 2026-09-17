"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/store/useWishlist";
import { useToast } from "@/store/useToast";
import { cn } from "@/lib/utils";

export function WishlistButton({
  slug,
  name,
  image,
  className,
  size = "md",
}: {
  slug: string;
  name: string;
  image?: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const saved = useWishlist((s) => s.slugs.includes(slug));
  const hydrated = useWishlist((s) => s.hydrated);
  const toggle = useWishlist((s) => s.toggle);
  const toast = useToast((s) => s.push);

  return (
    <button
      type="button"
      onClick={() => {
        toggle(slug);
        toast({
          title: saved ? "Removed from wishlist" : "Saved to wishlist",
          description: name,
          image,
          action: saved ? undefined : { label: "View", href: "/wishlist" },
        });
      }}
      aria-pressed={hydrated ? saved : undefined}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      className={cn(
        "flex items-center justify-center rounded-full border border-line bg-surface/85 text-fg-muted backdrop-blur-sm transition-all duration-300 ease-luxe hover:scale-110 hover:border-accent hover:text-accent-ink active:scale-95",
        size === "sm" ? "size-9" : "size-12",
        className,
      )}
    >
      <Heart
        className={cn(
          "transition-all duration-300 ease-spring",
          size === "sm" ? "size-4" : "size-[18px]",
          hydrated && saved && "scale-110 fill-accent text-accent",
        )}
      />
    </button>
  );
}
