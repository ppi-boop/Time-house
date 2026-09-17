"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { enquiryListLink } from "@/lib/whatsapp";
import { useShop } from "@/components/shop/ShopProvider";
import { formatPrice } from "@/lib/utils";
import { useEnquiry } from "@/store/useEnquiry";
import type { CatalogueIndex } from "@/types";

export function EnquiryList({ catalogue }: { catalogue: CatalogueIndex }) {
  const shop = useShop();
  const stored = useEnquiry((s) => s.items);
  const hydrated = useEnquiry((s) => s.hydrated);
  const setQuantity = useEnquiry((s) => s.setQuantity);
  const remove = useEnquiry((s) => s.remove);
  const clear = useEnquiry((s) => s.clear);

  // A line was written to localStorage when it was added, so its price, name
  // and photograph are only as fresh as that moment. Take the catalogue's
  // version where the piece still exists, and keep the stored copy for
  // anything that has since been discontinued.
  const items = stored.map((item) => ({ ...item, ...(catalogue[item.slug] ?? {}) }));
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Until localStorage is read, we don't know whether the list is empty.
  if (!hydrated) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-[var(--radius-lg)] border border-line bg-surface-2/50 px-6 py-24 text-center">
        <WhatsAppIcon className="size-8 text-line-strong" />
        <h2 className="mt-5 font-serif text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
          Your list is empty
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-fg-muted">
          Add a few pieces as you browse and send them to us as one message — or just
          tap the WhatsApp button on any product to ask about it directly.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/products">Browse the collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
      <div className="min-w-0">
        <ul className="divide-y divide-line overflow-hidden rounded-[var(--radius-lg)] border border-line">
          {items.map((item) => (
            <li key={`${item.productId}-${item.colour ?? ""}`} className="flex gap-4 p-5 transition-colors duration-300 hover:bg-surface-2 sm:gap-6">
              <Link
                href={`/product/${item.slug}`}
                className="relative aspect-4/5 w-20 shrink-0 self-start overflow-hidden rounded-[var(--radius-sm)] bg-surface-2 sm:w-28"
              >
                <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:justify-between">
                <div className="min-w-0">
                  <h3 className="font-serif text-lg leading-snug" style={{ fontFamily: "var(--font-playfair)" }}>
                    <Link href={`/product/${item.slug}`} className="hover:text-accent-ink">
                      {item.name}
                    </Link>
                  </h3>
                  <p className="mt-1.5 text-xs text-fg-subtle">
                    SKU {item.sku}
                    {item.colour && <> · {item.colour}</>}
                  </p>
                  <p className="mt-2 text-sm font-medium tabular-nums">{formatPrice(item.price)}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(next) => setQuantity(item.productId, next, item.colour)}
                    />
                    <button
                      type="button"
                      onClick={() => remove(item.productId, item.colour)}
                      className="group/rm flex items-center gap-1.5 rounded-full px-2 py-1 text-xs text-fg-subtle transition-colors hover:bg-surface-3 hover:text-fg"
                    >
                      <Trash2 className="size-3.5" />
                      Remove
                    </button>
                  </div>
                </div>

                <p className="shrink-0 text-sm font-semibold tabular-nums sm:text-right">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between">
          <Link
            href="/products"
            className="text-xs tracking-[0.14em] text-accent-ink uppercase underline underline-offset-4 hover:text-fg"
          >
            Continue browsing
          </Link>
          <button
            type="button"
            onClick={clear}
            className="text-xs tracking-[0.14em] text-fg-subtle uppercase transition-colors hover:text-fg"
          >
            Clear list
          </button>
        </div>
      </div>

      <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[var(--radius-lg)] border border-line bg-surface-2 p-7 shadow-[var(--shadow-soft)]">
          <h2 className="eyebrow">Summary</h2>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-fg-muted">
                {items.length} {items.length === 1 ? "line" : "lines"}
              </dt>
              <dd className="tabular-nums">{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-fg-muted">Delivery</dt>
              <dd className="text-fg-subtle">Confirmed in chat</dd>
            </div>
          </dl>

          <div className="hairline my-6" />

          <div className="flex items-baseline justify-between">
            <span className="text-sm text-fg-muted">Estimated total</span>
            <span
              className="font-serif text-2xl tabular-nums"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {formatPrice(total)}
            </span>
          </div>

          <Button asChild size="lg" className="mt-7 w-full">
            <a href={enquiryListLink(items, shop)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              Send list on WhatsApp
            </a>
          </Button>

          <p className="mt-4 text-xs leading-relaxed text-fg-subtle">
            This opens WhatsApp with all {items.length}{" "}
            {items.length === 1 ? "piece" : "pieces"} written into the message. Nothing is
            charged here — we confirm stock and the final price in the chat.
          </p>
        </div>
      </aside>
    </div>
  );
}
