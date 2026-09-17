"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AddToEnquiryButton } from "@/components/product/AddToEnquiryButton";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { productEnquiryLink } from "@/lib/whatsapp";
import { useShop } from "@/components/shop/ShopProvider";
import { cn, formatPrice } from "@/lib/utils";
import { useBottomBar } from "@/store/useBottomBar";
import type { Product } from "@/types";

/**
 * Once the main buy buttons have scrolled away, the same two actions follow the
 * customer down the page. Mobile only — on desktop the panel stays in view.
 */
export function StickyBuyBar({ product }: { product: Product }) {
  const [visible, setVisible] = useState(false);
  const setBarVisible = useBottomBar((s) => s.setVisible);

  const shop = useShop();

  useEffect(() => {
    const anchor = document.getElementById("buy-anchor");
    if (!anchor) return;

    // Show the bar only while the real buttons are above the fold.
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.boundingClientRect.top < 0 && !entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  // Tell the floating buttons to step aside while the bar is up.
  useEffect(() => {
    setBarVisible(visible);
    return () => setBarVisible(false);
  }, [visible, setBarVisible]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line lg:hidden",
        "bg-surface/95 shadow-[var(--shadow-float)] backdrop-blur-xl transition-transform duration-500 ease-luxe",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="container-luxe flex items-center gap-3 py-3">
        <span className="relative hidden aspect-square w-11 shrink-0 overflow-hidden rounded-[var(--radius-xs)] bg-surface-2 sm:block">
          <Image src={product.images[0]} alt="" fill sizes="44px" className="object-cover" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs text-fg-subtle">{product.name}</span>
          <span className="block text-sm font-semibold tabular-nums">
            {formatPrice(product.price)}
          </span>
        </span>

        <AddToEnquiryButton product={product} label="" variant="outline" size="icon" />

        <a
          href={productEnquiryLink(product, { shop })}
          target="_blank"
          rel="noopener noreferrer"
          className="shine flex h-11 max-w-[9.5rem] flex-1 items-center justify-center gap-2 rounded-full bg-brand text-[0.6875rem] tracking-[0.12em] whitespace-nowrap text-on-brand uppercase sm:max-w-[12rem]"
        >
          <WhatsAppIcon className="size-4" />
          Buy now
        </a>
      </div>
    </div>
  );
}
