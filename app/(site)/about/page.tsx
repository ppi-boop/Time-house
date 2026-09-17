import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { TrustBar } from "@/components/home/TrustBar";
import { STORE } from "@/lib/constants";
import { getSettings } from "@/lib/db/content";
import { breadcrumbSchema, localBusinessSchema, pageMetadata } from "@/lib/seo";
import { generalEnquiryLink } from "@/lib/whatsapp";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Our Story",
  description: `How ${STORE.name} works: a single counter in ${STORE.address.city} since ${STORE.foundedYear}, selling watches, ladies bags and accessories — with every order handled personally on WhatsApp.`,
  path: "/about",
});

const CHAPTERS = [
  {
    year: STORE.foundedYear,
    title: "One glass case",
    body: `We opened with a single case of watches on ${STORE.address.locality} and a rule we still keep: never stock something we would not wear ourselves.`,
  },
  {
    year: 2016,
    title: "Bags join the shelves",
    body: "Customers kept asking where we bought our bags. So we started stocking them — structured, everyday pieces rather than anything that would date in a season.",
  },
  {
    year: 2019,
    title: "The WhatsApp counter",
    body: "A customer messaged us a photo asking if we had it. We replied in ten minutes. That is now how most of our orders arrive, and it is why this site works the way it does.",
  },
  {
    year: "Today",
    title: "Four counters, same people",
    body: "Watches, bags, gents accessories and ladies accessories — around 400 pieces at any time, and the same faces behind the counter.",
  },
];

export default async function AboutPage() {
  const { home } = await getSettings();

  return (
    <>
      <JsonLd
        schema={[
          localBusinessSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Our Story", path: "/about" },
          ]),
        ]}
      />

      <div className="container-luxe py-10 lg:py-14">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Our Story", path: "/about" },
          ]}
        />

        <header className="mt-10 max-w-3xl">
          <p className="eyebrow">Since {STORE.foundedYear}</p>
          <h1
            className="display mt-4 text-4xl sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            A shop, not a warehouse
          </h1>
          <p className="mt-7 text-base leading-relaxed text-fg-muted sm:text-lg">
            {STORE.name} is a family-run boutique. Everything on this site is a piece you could
            pick up at our counter this afternoon — there is no third-party seller, no drop-shipper,
            and no algorithm deciding what we stock.
          </p>
        </header>
      </div>

      <section className="container-luxe">
        <div className="relative aspect-21/9 w-full overflow-hidden rounded-[var(--radius-xl)] bg-surface-2 shadow-[var(--shadow-soft)]">
          <Image
            src={home.storyWideImage}
            alt={`Inside ${STORE.name}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="container-luxe py-14 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[18rem_1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">How we got here</p>
            <h2
              className="display mt-4 text-3xl sm:text-4xl"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Fourteen years, one address
            </h2>
          </div>

          <ol className="relative border-l border-line">
            {CHAPTERS.map((chapter) => (
              <li key={chapter.title} className="relative pb-12 pl-8 last:pb-0">
                <span
                  className="absolute top-1.5 -left-[4.5px] size-2 rounded-full bg-accent"
                  aria-hidden="true"
                />
                <p className="text-xs tracking-[0.18em] text-accent-ink uppercase tabular-nums">
                  {chapter.year}
                </p>
                <h3
                  className="mt-2 font-serif text-2xl"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {chapter.title}
                </h3>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-fg-muted">
                  {chapter.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <TrustBar />

      <section className="grain relative overflow-hidden bg-green-deep text-champagne">
        <div className="container-luxe relative z-10 py-14 text-center lg:py-20">
          <p className="eyebrow eyebrow-on-dark">Why there is no checkout button</p>
          <h2
            className="display mx-auto mt-5 max-w-3xl text-3xl sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Because a watch is not a thing you should buy from a form
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-sm leading-relaxed text-champagne/75 sm:text-base">
            Half the questions we get are ones a checkout page cannot answer. Will it fit a
            6.5&Prime; wrist. Does the green look like that in daylight. Can you engrave it by
            Friday. So we kept the conversation and dropped the cart — message us and you are
            talking to the person who will hand you the box.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="gold">
              <a href={generalEnquiryLink()} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                Start a conversation
              </a>
            </Button>
            <Button asChild size="lg" variant="onDark">
              <Link href="/products">See the collection</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
