"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { AddToEnquiryButton } from "@/components/product/AddToEnquiryButton";
import { BuyOnWhatsAppButton } from "@/components/product/BuyOnWhatsAppButton";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { WishlistButton } from "@/components/product/WishlistButton";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { absoluteUrl } from "@/lib/seo";
import { shareProductLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

/**
 * Colour and quantity live here rather than in each button, so whatever the
 * customer picks is what lands in the WhatsApp message.
 */
export function PurchasePanel({ product }: { product: Product }) {
  const [colour, setColour] = useState(product.colours[0]);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(absoluteUrl(`/product/${product.slug}`));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the WhatsApp share button still works.
    }
  }

  return (
    <div className="space-y-7">
      {product.colours.length > 1 && (
        <fieldset>
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
                  "rounded-full border px-4 py-2.5 text-xs tracking-[0.08em] transition-all duration-300 ease-luxe hover:-translate-y-0.5",
                  colour === option
                    ? "border-accent bg-surface-2 text-fg shadow-[var(--shadow-soft)]"
                    : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {/* .eyebrow is inline-flex and so is the stepper, so without a flex column
          here the label lands beside the stepper on a shared text baseline
          instead of above it, and its mb-3 does nothing. */}
      <div className="flex flex-col items-start gap-3">
        <p className="eyebrow">Quantity</p>
        <QuantityStepper value={quantity} onChange={setQuantity} />
      </div>

      <div className="space-y-3">
        <div className="flex gap-3">
          <BuyOnWhatsAppButton
            product={product}
            quantity={quantity}
            colour={colour}
            className="min-w-0 flex-1"
          />
          <WishlistButton
            slug={product.slug}
            name={product.name}
            image={product.images[0]}
            className="size-12 shrink-0 sm:size-14"
          />
        </div>

        <AddToEnquiryButton
          product={product}
          quantity={quantity}
          colour={colour}
          className="w-full"
        />

        <p className="flex items-start gap-2 pt-1 text-xs leading-relaxed text-fg-subtle">
          <WhatsAppIcon className="mt-0.5 size-3.5 shrink-0 text-brand" />
          <span>
            There is no online payment here. Tapping buy opens WhatsApp with this piece
            already written into the message — we confirm stock, final price and delivery
            in the chat.
          </span>
        </p>
      </div>

      <div className="flex items-center gap-1 border-t border-line pt-5">
        <span className="eyebrow mr-2">Share</span>
        <a
          href={shareProductLink(product)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className="flex size-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-2 hover:text-accent-ink"
        >
          <WhatsAppIcon className="size-4" />
        </a>
        <button
          type="button"
          onClick={copyLink}
          aria-label="Copy link to this product"
          className="flex size-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-2 hover:text-accent-ink"
        >
          {copied ? <Check className="size-4 text-brand" /> : <Copy className="size-4" />}
        </button>
        <span aria-live="polite" className="text-xs text-fg-subtle">
          {copied ? "Link copied" : ""}
        </span>
      </div>
    </div>
  );
}
