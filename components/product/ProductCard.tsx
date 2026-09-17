"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { AddToEnquiryButton } from "@/components/product/AddToEnquiryButton";
import { WishlistButton } from "@/components/product/WishlistButton";
import { productEnquiryLink } from "@/lib/whatsapp";
import { useShop } from "@/components/shop/ShopProvider";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

const QuickView = dynamic(() =>
  import("@/components/product/QuickView").then((m) => m.QuickView),
);

export function ProductCard({
  product,
  priority = false,
  layout = "auto",
  className,
}: {
  product: Product;
  /** Set on the first row so the LCP image isn't lazy-loaded. */
  priority?: boolean;
  /**
   * "auto" — one per row on a phone, laid out side by side, then the usual
   * vertical card from `sm` up. Used by the listing grids.
   * "grid" — always vertical. Used by the home rails, where the card already
   * sits in a narrow horizontally-scrolling column.
   */
  layout?: "auto" | "grid";
  className?: string;
}) {
  const [quickView, setQuickView] = useState(false);
  const shop = useShop();
  const discount = discountPercent(product.price, product.mrp);
  const row = layout === "auto";

  return (
    <>
      <article
        className={cn(
          "group relative flex h-full overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface",
          "transition-[transform,box-shadow,border-color] duration-500 ease-luxe",
          "hover:border-line-strong hover:shadow-[var(--shadow-lift)] sm:hover:-translate-y-1.5",
          row ? "flex-row sm:flex-col" : "flex-col",
          className,
        )}
      >
        <div
          className={cn(
            "relative shrink-0 overflow-hidden bg-surface-2",
            row ? "w-[38%] max-w-[9.5rem] sm:w-full sm:max-w-none" : "w-full",
          )}
        >
          <Link
            href={`/product/${product.slug}`}
            /* h-full is needed on the anchor too: the image box below sizes
               itself with h-full, and a percentage height cannot resolve
               through an auto-height link. */
            className="block h-full"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div
              className={cn(
                "relative w-full",
                row
                  ? "h-full min-h-[9.5rem] sm:h-auto sm:min-h-0 sm:aspect-4/5"
                  : "aspect-square sm:aspect-4/5",
              )}
            >
              <Image
                src={product.images[0]}
                alt={`${product.name} by ${product.brand}`}
                fill
                sizes={
                  row
                    ? "(max-width: 640px) 40vw, (max-width: 1024px) 33vw, 22vw"
                    : "(max-width: 640px) 62vw, (max-width: 1024px) 33vw, 22vw"
                }
                priority={priority}
                className="object-cover transition-transform duration-[1100ms] ease-luxe group-hover:scale-[1.08]"
              />
              {/* Second angle cross-fades in on hover. */}
              {product.images[1] && (
                <Image
                  src={product.images[1]}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 40vw, (max-width: 1024px) 33vw, 22vw"
                  className="hidden object-cover opacity-0 transition-opacity duration-700 ease-luxe group-hover:opacity-100 sm:block"
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-green-deep/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          </Link>

          {/* Badges sit on the image in both layouts. */}
          <div className="pointer-events-none absolute inset-x-2 top-2 z-20 flex flex-col items-start gap-1.5 sm:inset-x-3 sm:top-3">
            {!product.inStock && <Badge tone="danger">Sold out</Badge>}
            {product.inStock && product.isNewArrival && <Badge tone="green">New</Badge>}
            {product.inStock && discount >= 20 && (
              /* On a row card the thumbnail is small, so the discount gives way to
                 the New badge and shows beside the price instead. */
              <Badge tone="gold" className={cn(row && product.isNewArrival && "hidden sm:inline-flex")}>
                {discount}% off
              </Badge>
            )}
          </div>

          {/* Wishlist and quick view sit over the image — except on a row card,
              where the image is too small and the wishlist moves beside the brand. */}
          <div
            className={cn(
              "absolute top-3 right-3 z-20 flex-col gap-2",
              row ? "hidden sm:flex" : "flex",
            )}
          >
            <WishlistButton
              slug={product.slug}
              name={product.name}
              image={product.images[0]}
              size="sm"
            />
            <button
              type="button"
              onClick={() => setQuickView(true)}
              aria-label={`Quick view ${product.name}`}
              className="hidden size-9 translate-x-2 items-center justify-center rounded-full border border-line bg-surface/85 text-fg-muted opacity-0 backdrop-blur-sm transition-all duration-300 ease-luxe hover:scale-110 hover:border-accent hover:text-accent-ink group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 md:flex"
            >
              <Eye className="size-4" />
            </button>
          </div>

          {/* Vertical cards on touch get one small corner button, so the piece
              stays visible. Row cards put their actions beside the price instead. */}
          {!row && (
            <a
              href={productEnquiryLink(product, { shop })}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Buy ${product.name} on WhatsApp`}
              className="absolute right-2.5 bottom-2.5 z-20 flex size-10 items-center justify-center rounded-full bg-brand text-on-brand shadow-[var(--shadow-lift)] transition-transform active:scale-95 md:hidden"
            >
              <WhatsAppIcon className="size-[18px]" />
            </a>
          )}

          {/* From md up, the full row rises in on hover or keyboard focus. */}
          <div className="absolute inset-x-3 bottom-3 z-20 hidden translate-y-[130%] gap-2 opacity-0 transition-all duration-400 ease-luxe group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 md:flex">
            <a
              href={productEnquiryLink(product, { shop })}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Buy ${product.name} on WhatsApp`}
              className="shine flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-brand text-[0.6875rem] tracking-[0.12em] text-on-brand uppercase shadow-[var(--shadow-soft)] transition-colors hover:bg-brand-hover"
            >
              <WhatsAppIcon className="size-4" />
              Buy on WhatsApp
            </a>
            <AddToEnquiryButton
              product={product}
              label=""
              variant="gold"
              size="icon"
              className="size-10 shrink-0"
            />
          </div>
        </div>

        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col",
            row ? "py-3 pr-3 pl-4 sm:p-4" : "p-3 sm:p-4",
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="eyebrow text-[0.625rem] before:w-3 sm:text-[0.6875rem] sm:before:w-6">
              {product.brand}
            </p>
            {/* Row cards hang the wishlist here — there is no room over the image. */}
            {row && (
              <div className="relative z-20 -mt-1 shrink-0 sm:hidden">
                <WishlistButton
                  slug={product.slug}
                  name={product.name}
                  image={product.images[0]}
                  size="sm"
                  className="size-8 border-transparent bg-transparent"
                />
              </div>
            )}
          </div>

          {/* Clamped so every card in a row is the same height. */}
          <h3
            className={cn(
              // Line height and min-height are pinned together: two lines of space,
              // always. Leaving it to `leading-snug` + an em guess left one-line
              // names a few pixels short, so rows never quite aligned.
              "mt-1.5 line-clamp-2 min-h-[2.8em] font-serif transition-colors duration-300 group-hover:text-accent-ink",
              row ? "text-[0.9375rem] sm:text-base" : "text-sm sm:text-base",
            )}
            // line-height is set here rather than with `leading-*`: Tailwind's
            // `text-*` utilities also emit a line-height and win the cascade, which
            // left two-line titles taller than the reserved min-height.
            style={{ fontFamily: "var(--font-playfair)", lineHeight: 1.4 }}
          >
            <Link
              href={`/product/${product.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {product.name}
            </Link>
          </h3>

          <Rating
            value={product.rating}
            count={product.reviewCount}
            size="sm"
            className="mt-2"
          />

          {/* mt-auto pins this row to the bottom, so prices align across a row. */}
          <div className="mt-auto flex items-end justify-between gap-3 pt-3">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-sm font-semibold tabular-nums sm:text-[0.9375rem]">
                {formatPrice(product.price)}
              </span>
              {product.mrp > product.price && (
                <>
                  <span className="text-[0.6875rem] text-fg-subtle line-through tabular-nums sm:text-xs">
                    {formatPrice(product.mrp)}
                  </span>
                  {row && product.inStock && discount >= 20 && (
                    <span className="text-[0.6875rem] font-semibold text-accent-ink tabular-nums sm:hidden">
                      −{discount}%
                    </span>
                  )}
                </>
              )}
            </div>

            {row && (
              <div className="relative z-20 flex shrink-0 items-center gap-1.5 sm:hidden">
                <AddToEnquiryButton
                  product={product}
                  label=""
                  variant="outline"
                  size="iconSm"
                />
                <a
                  href={productEnquiryLink(product, { shop })}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Buy ${product.name} on WhatsApp`}
                  className="flex size-9 items-center justify-center rounded-full bg-brand text-on-brand transition-transform active:scale-95"
                >
                  <WhatsAppIcon className="size-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </article>

      {quickView && (
        <QuickView product={product} open={quickView} onOpenChange={setQuickView} />
      )}
    </>
  );
}
