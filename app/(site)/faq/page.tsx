import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";
import { getFaqs, getSettings } from "@/lib/db/content";
import { generalEnquiryLink } from "@/lib/whatsapp";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const shop = await getSettings();
  return pageMetadata({
    title: "FAQ — Ordering, Delivery & Exchange",
    description: `How ordering on WhatsApp works at ${shop.name}, plus delivery, exchange, warranty and payment answers.`,
    path: "/faq",
  });
}

export default async function FaqPage() {
  const [faqs, shop] = await Promise.all([getFaqs(), getSettings()]);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <>
      <JsonLd schema={[faqSchema(faqs), breadcrumbSchema(crumbs)]} />

      <div className="container-luxe py-10 lg:py-14">
        <Breadcrumbs items={crumbs} />

        <div className="mt-10 grid gap-12 lg:grid-cols-[20rem_1fr] lg:gap-20">
          <header className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Questions</p>
            <h1
              className="display mt-4 text-4xl sm:text-5xl"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              How this works
            </h1>
            <p className="mt-6 text-sm leading-relaxed text-fg-muted">
              Ordering here is a conversation rather than a checkout. Here is everything people
              usually ask before their first order.
            </p>

            <div className="mt-8 rounded-[var(--radius-lg)] border border-line bg-surface-2 p-6 shadow-[var(--shadow-soft)]">
              <p className="text-sm text-fg-muted">Still not answered?</p>
              <Button asChild size="md" className="mt-4 w-full">
                <a href={generalEnquiryLink(shop)} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon />
                  Ask us directly
                </a>
              </Button>
              <Link
                href="/contact"
                className="mt-4 block text-center text-xs tracking-[0.14em] text-accent-ink uppercase underline underline-offset-4 hover:text-fg"
              >
                Shop address & hours
              </Link>
            </div>
          </header>

          <Accordion type="single" collapsible className="border-t border-line">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left normal-case tracking-normal">
                  <span className="font-serif text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="max-w-prose">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
}
