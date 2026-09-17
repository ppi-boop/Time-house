import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { generalEnquiryLink } from "@/lib/whatsapp";
import { getSettings } from "@/lib/db/content";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

const STATS = [
  { value: 14, suffix: " yrs", label: "at the same counter" },
  { value: 400, suffix: "+", label: "pieces in store" },
  { value: 1, prefix: "< ", suffix: " hr", label: "typical reply" },
];

/**
 * Server component — the entrance and float are pure CSS, so the banner costs
 * no client JavaScript and paints with the document.
 */
export async function Hero({ showcase }: { showcase: Product[] }) {
  const { home } = await getSettings();

  const [lead, second, third] = showcase;

  return (
    <section className="grain relative isolate overflow-hidden bg-green-deep text-champagne">
      {/* Layered light, so the panel is not a flat rectangle. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/3 right-0 size-[65vw] rounded-full bg-[radial-gradient(circle,rgba(10,122,74,0.5),transparent_65%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1/3 -left-1/4 size-[50vw] rounded-full bg-[radial-gradient(circle,rgba(163,126,44,0.28),transparent_65%)] blur-3xl"
      />

      <div className="container-luxe relative grid items-center gap-10 py-12 lg:grid-cols-[1fr_1.05fr] lg:gap-10 lg:py-20">
        <div className="max-w-xl">
          <p className="eyebrow eyebrow-on-dark animate-[rise_0.7s_var(--ease-out-quint)_both]">
            {home.heroEyebrow}
          </p>

          <h1 className="display mt-5 text-[2.6rem] leading-[1.04] sm:text-6xl lg:text-[4.25rem]">
            <span className="block animate-[rise_0.7s_var(--ease-out-quint)_0.08s_both]">
              {home.heroTitleTop}
            </span>
            <span className="mt-1.5 block text-gilded animate-[rise_0.7s_var(--ease-out-quint)_0.18s_both]">
              {home.heroTitleBottom}
            </span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-champagne/75 animate-[rise_0.7s_var(--ease-out-quint)_0.28s_both]">
            {home.heroBody}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row animate-[rise_0.7s_var(--ease-out-quint)_0.36s_both]">
            <Button asChild size="lg" variant="gold">
              <Link href="/products">
                Explore the collection
                <ArrowRight className="transition-transform duration-300 ease-luxe group-hover/btn:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="onDark">
              <a href={generalEnquiryLink()} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                Chat on WhatsApp
              </a>
            </Button>
          </div>

          <dl className="mt-8 grid max-w-md grid-cols-3 gap-5 border-t border-champagne/15 pt-6 animate-[rise_0.7s_var(--ease-out-quint)_0.44s_both]">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span
                    className="block font-serif text-2xl text-gold-light tabular-nums"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {stat.prefix}
                    <Counter to={stat.value} />
                    {stat.suffix}
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-champagne/60">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Product composition — three real pieces at three depths. */}
        <div className="relative animate-[rise_0.9s_var(--ease-out-quint)_0.2s_both]">
          <div className="relative mx-auto aspect-square w-full max-w-[21rem] sm:max-w-[27rem] lg:max-w-[34rem]">
            {/* Ring behind the stack, for depth. */}
            <div
              aria-hidden="true"
              className="absolute inset-[8%] rounded-full border border-gold-light/15"
            />
            <div
              aria-hidden="true"
              className="absolute inset-[18%] rounded-full border border-gold-light/10"
            />

            {lead && (
              <Link
                href={`/product/${lead.slug}`}
                className="group absolute top-0 left-[22%] z-20 w-[48%] animate-[float-slow_7s_ease-in-out_infinite]"
              >
                <span className="block overflow-hidden rounded-[var(--radius-lg)] border border-gold-light/20 bg-surface shadow-[var(--shadow-float)] transition-transform duration-500 ease-luxe group-hover:-translate-y-2">
                  <span className="relative block aspect-4/5">
                    <Image
                      src={lead.images[0]}
                      alt={lead.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 55vw, 18rem"
                      className="object-cover"
                    />
                  </span>
                  <span className="flex items-center justify-between gap-2 px-3.5 py-3">
                    <span className="min-w-0">
                      <span className="block truncate text-[0.625rem] tracking-[0.14em] text-accent-ink uppercase">
                        {lead.brand}
                      </span>
                      <span
                        className="mt-0.5 block truncate font-serif text-sm text-fg"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {lead.name}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-fg tabular-nums">
                      {formatPrice(lead.price)}
                    </span>
                  </span>
                </span>
              </Link>
            )}

            {second && (
              <Link
                href={`/product/${second.slug}`}
                className="group absolute top-[32%] right-0 z-10 w-[33%] animate-[float-slow_9s_ease-in-out_0.8s_infinite]"
              >
                <span className="relative block aspect-4/5 overflow-hidden rounded-[var(--radius-md)] border border-gold-light/15 bg-surface-2 shadow-[var(--shadow-lift)] transition-transform duration-500 ease-luxe group-hover:-translate-y-2">
                  <Image
                    src={second.images[0]}
                    alt={second.name}
                    fill
                    sizes="(max-width: 1024px) 38vw, 12rem"
                    className="object-cover"
                  />
                </span>
              </Link>
            )}

            {third && (
              <Link
                href={`/product/${third.slug}`}
                className="group absolute bottom-0 left-0 z-10 w-[31%] animate-[float-slow_8s_ease-in-out_1.6s_infinite]"
              >
                <span className="relative block aspect-4/5 overflow-hidden rounded-[var(--radius-md)] border border-gold-light/15 bg-surface-2 shadow-[var(--shadow-lift)] transition-transform duration-500 ease-luxe group-hover:-translate-y-2">
                  <Image
                    src={third.images[0]}
                    alt={third.name}
                    fill
                    sizes="(max-width: 1024px) 36vw, 11rem"
                    className="object-cover"
                  />
                </span>
              </Link>
            )}

            {/* Two small proof chips tucked into the composition. */}
            <span className="absolute right-[13%] bottom-[18%] z-30 flex items-center gap-2 rounded-full border border-gold-light/25 bg-green-deep/85 px-3.5 py-2 text-[0.625rem] tracking-[0.12em] text-champagne uppercase backdrop-blur-sm">
              <BadgeCheck className="size-3.5 text-gold-light" />
              Warranty card
            </span>
            <span className="absolute top-[6%] right-[2%] z-30 hidden items-center gap-2 rounded-full border border-gold-light/25 bg-green-deep/85 px-3.5 py-2 text-[0.625rem] tracking-[0.12em] text-champagne uppercase backdrop-blur-sm sm:flex">
              <MapPin className="size-3.5 text-gold-light" />
              In store today
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
