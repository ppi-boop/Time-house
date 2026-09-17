import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { MapEmbed } from "@/components/MapEmbed";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { fullAddress, getSettings } from "@/lib/db/content";

import { breadcrumbSchema, localBusinessSchema, pageMetadata } from "@/lib/seo";
import { generalEnquiryLink, visitEnquiryLink } from "@/lib/whatsapp";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const shop = await getSettings();
  return pageMetadata({
    title: "Visit Us",
    description: `${shop.name} — ${fullAddress(shop)}. Opening hours, directions, phone and WhatsApp.`,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const shop = await getSettings();
  const address = fullAddress(shop);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Visit Us", path: "/contact" },
  ];

  return (
    <>
      <JsonLd schema={[localBusinessSchema(), breadcrumbSchema(crumbs)]} />

      <div className="container-luxe py-10 lg:py-14">
        <Breadcrumbs items={crumbs} />

        <header className="mt-10 max-w-2xl">
          <p className="eyebrow">Come and see us</p>
          <h1
            className="display mt-4 text-4xl sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {shop.address.locality}, {shop.address.city}
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-fg-muted sm:text-base">
            The fastest way to reach us is WhatsApp — we usually reply within the hour during
            shop hours. Or just walk in; someone is always at the counter.
          </p>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <div className="space-y-8">
              <Detail Icon={MapPin} title="Address">
                <address className="not-italic text-fg-muted">
                  {shop.address.street}
                  <br />
                  {shop.address.locality}, {shop.address.city}
                  <br />
                  {shop.address.region} {shop.address.postalCode}
                </address>
              </Detail>

              <Detail Icon={Clock} title="Opening hours">
                <dl className="space-y-1.5 text-fg-muted">
                  {shop.hours.map((slot) => (
                    <div key={slot.days} className="flex flex-wrap gap-x-3">
                      <dt>{slot.days}</dt>
                      <dd className="text-fg">{slot.time}</dd>
                    </div>
                  ))}
                </dl>
              </Detail>

              <Detail Icon={Phone} title="Phone">
                <a href={`tel:${shop.phone}`} className="text-fg-muted hover:text-fg">
                  {shop.phone}
                </a>
              </Detail>

              <Detail Icon={Mail} title="Email">
                <a href={`mailto:${shop.email}`} className="text-fg-muted hover:text-fg">
                  {shop.email}
                </a>
              </Detail>
            </div>

            <div className="mt-10 rounded-[var(--radius-lg)] border border-line bg-surface-2 p-5 shadow-[var(--shadow-soft)] sm:p-7">
              <h2 className="eyebrow">Message us</h2>
              <p className="mt-4 text-sm leading-relaxed text-fg-muted">
                Send a photo, a screenshot or a link from this site — whatever you are looking at.
                We will tell you straight away whether it is at the counter.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="flex-1">
                  <a href={generalEnquiryLink()} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon />
                    Chat on WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1">
                  <a href={visitEnquiryLink()} target="_blank" rel="noopener noreferrer">
                    Plan a visit
                  </a>
                </Button>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-fg-subtle">
                There is no contact form here on purpose — a form takes a day to answer and
                WhatsApp takes an hour.
              </p>
            </div>
          </div>

          <div className="min-w-0 min-h-[24rem] overflow-hidden rounded-[var(--radius-lg)] border border-line lg:min-h-full">
            <MapEmbed
              name={shop.name}
              address={address}
              className="h-full min-h-[24rem] w-full grayscale-[0.35] contrast-[1.05]"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function Detail({
  Icon,
  title,
  children,
}: {
  Icon: typeof MapPin;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/12 text-accent-ink">
        <Icon className="size-[18px]" aria-hidden="true" />
      </span>
      <div className="min-w-0 text-sm break-words">
        <h2 className="eyebrow mb-2">{title}</h2>
        {children}
      </div>
    </div>
  );
}
