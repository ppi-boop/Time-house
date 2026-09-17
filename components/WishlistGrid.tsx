"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { useWishlist } from "@/store/useWishlist";
import type { Product } from "@/types";

export function WishlistGrid({ products }: { products: Product[] }) {
  const slugs = useWishlist((s) => s.slugs);
  const hydrated = useWishlist((s) => s.hydrated);
  const clear = useWishlist((s) => s.clear);

  if (!hydrated) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-9 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Keep the order the customer saved them in.
  const saved = slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-[var(--radius-lg)] border border-line bg-surface-2/50 px-6 py-24 text-center">
        <Heart className="size-8 text-line-strong" />
        <h2 className="mt-5 font-serif text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
          Nothing saved yet
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-fg-muted">
          Tap the heart on any piece to keep it here. Your wishlist stays on this device.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/products">Browse the collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <p className="text-xs text-fg-muted tabular-nums" aria-live="polite">
          {saved.length} saved
        </p>
        <button
          type="button"
          onClick={clear}
          className="text-xs tracking-[0.14em] text-fg-subtle uppercase transition-colors hover:text-fg"
        >
          Clear wishlist
        </button>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-9 md:grid-cols-3 xl:grid-cols-4">
        {saved.map((product, index) => (
          <li key={product.id}>
            <ProductCard product={product} priority={index < 4} />
          </li>
        ))}
      </ul>
    </>
  );
}
