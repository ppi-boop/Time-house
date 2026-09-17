import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { fullAddress, getSettings } from "@/lib/db/content";

import { visitEnquiryLink } from "@/lib/whatsapp";
import { MapEmbed } from "@/components/MapEmbed";

export async function VisitCta() {
  const shop = await getSettings();
  const address = fullAddress(shop);

  return (
    <section className="container-luxe py-14 lg:py-20">
      <div className="grid overflow-hidden rounded-[var(--radius-xl)] border border-line shadow-[var(--shadow-soft)] lg:grid-cols-2">
        <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
          <p className="eyebrow">Come and see them</p>
          <h2
            className="display mt-4 text-3xl sm:text-4xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Photographs only tell you so much
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-fg-muted sm:text-base">
            Weight, drape, how a strap sits — none of it photographs. Tell us what you are
            looking at and we will keep it at the counter for 48 hours.
          </p>

          <dl className="mt-9 space-y-4 text-sm">
            <div className="flex gap-3">
              <dt className="sr-only">Address</dt>
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <dd className="text-fg-muted">{address}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="sr-only">Phone</dt>
              <Phone className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <dd>
                <a href={`tel:${shop.phone}`} className="text-fg-muted hover:text-fg">
                  {shop.phone}
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href={visitEnquiryLink()} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                Reserve at the counter
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Directions & hours</Link>
            </Button>
          </div>
        </div>

        <div className="min-h-[22rem] border-t border-line lg:border-t-0 lg:border-l">
          <MapEmbed name={shop.name} address={address} />
        </div>
      </div>
    </section>
  );
}
