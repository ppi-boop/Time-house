"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AddToEnquiryButton } from "@/components/product/AddToEnquiryButton";
import { BuyOnWhatsAppButton } from "@/components/product/BuyOnWhatsAppButton";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

/**
 * Lets someone check size, colour and price without leaving the grid — and buy
 * from here if that is all they needed to know.
 */
export function QuickView({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [colour, setColour] = useState(product.colours[0]);
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(0);
  const discount = discountPercent(product.price, product.mrp);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-60 bg-green-deep/55 backdrop-blur-sm data-[state=closed]:animate-[fade-out_180ms_ease] data-[state=open]:animate-[fade-in_220ms_ease]" />
        <DialogPrimitive.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-60 max-h-[90vh] w-[min(94vw,56rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto",
            "rounded-[var(--radius-lg)] border border-line bg-surface shadow-[var(--shadow-float)]",
            "data-[state=closed]:animate-[pop-out_180ms_ease] data-[state=open]:animate-[pop-in_300ms_var(--ease-out-quint)]",
          )}
        >
          <DialogPrimitive.Close
            aria-label="Close quick view"
            className="absolute top-4 right-4 z-10 flex size-9 items-center justify-center rounded-full border border-line bg-surface/85 text-fg-muted backdrop-blur-sm transition-colors hover:text-fg"
          >
            <X className="size-4" />
          </DialogPrimitive.Close>

          <div className="grid sm:grid-cols-2">
            <div className="bg-surface-2 p-4 sm:p-6">
              <div className="relative aspect-4/5 overflow-hidden rounded-[var(--radius-md)]">
                <Image
                  key={product.images[image]}
                  src={product.images[image]}
                  alt={`${product.name} — view ${image + 1}`}
                  fill
                  sizes="(max-width: 640px) 90vw, 28rem"
                  className="animate-[fade-in_300ms_ease] object-cover"
                />
                {!product.inStock && (
                  <span className="absolute top-3 left-3">
                    <Badge tone="danger">Sold out</Badge>
                  </span>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setImage(i)}
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={image === i}
                    className={cn(
                      "relative aspect-square flex-1 overflow-hidden rounded-[var(--radius-xs)] border transition-colors",
                      image === i ? "border-accent" : "border-line hover:border-line-strong",
                    )}
                  >
                    <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="eyebrow">{product.brand}</p>

              <DialogPrimitive.Title
                className="display mt-3 text-2xl sm:text-3xl"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {product.name}
              </DialogPrimitive.Title>

              <Rating value={product.rating} count={product.reviewCount} className="mt-3" />

              <div className="mt-5 flex flex-wrap items-baseline gap-3">
                <span className="text-2xl font-semibold tabular-nums">
                  {formatPrice(product.price)}
                </span>
                {product.mrp > product.price && (
                  <>
                    <span className="text-sm text-fg-subtle line-through tabular-nums">
                      {formatPrice(product.mrp)}
                    </span>
                    <Badge tone="gold">Save {discount}%</Badge>
                  </>
                )}
              </div>

              <DialogPrimitive.Description className="mt-4 text-sm leading-relaxed text-fg-muted">
                {product.shortDescription}
              </DialogPrimitive.Description>

              {product.colours.length > 1 && (
                <fieldset className="mt-6">
                  <legend className="eyebrow">
                    Colour: <span className="text-fg-muted normal-case">{colour}</span>
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.colours.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setColour(option)}
                        aria-pressed={colour === option}
                        className={cn(
                          "rounded-full border px-3.5 py-2 text-xs transition-colors",
                          colour === option
                            ? "border-accent bg-surface-2 text-fg"
                            : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              <div className="mt-6 flex items-center gap-3">
                <QuantityStepper value={quantity} onChange={setQuantity} />
                <AddToEnquiryButton
                  product={product}
                  quantity={quantity}
                  colour={colour}
                  size="md"
                  className="flex-1"
                />
              </div>

              <BuyOnWhatsAppButton
                product={product}
                quantity={quantity}
                colour={colour}
                size="lg"
                className="mt-3 w-full"
              />

              <Link
                href={`/product/${product.slug}`}
                onClick={() => onOpenChange(false)}
                className="group mt-5 inline-flex items-center gap-2 text-xs tracking-[0.14em] text-accent-ink uppercase"
              >
                Full details & specifications
                <ArrowRight className="size-3.5 transition-transform duration-300 ease-luxe group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
