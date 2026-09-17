import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EnquiryList } from "@/components/enquiry/EnquiryList";
import { getCatalogueIndex } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Your Enquiry List",
  description:
    "The pieces you have gathered, ready to send to us as one WhatsApp message.",
  path: "/enquiry",
  noIndex: true,
});

export default async function EnquiryPage() {
  // Saved lines are refreshed against this, so a price or photograph that has
  // changed since the piece was added is corrected before it reaches WhatsApp.
  const catalogue = await getCatalogueIndex();

  return (
    <div className="container-luxe py-10 lg:py-14">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Enquiry List", path: "/enquiry" },
        ]}
      />

      <header className="mt-8 max-w-2xl">
        <p className="eyebrow">Ready to send</p>
        <h1 className="display mt-3 text-4xl sm:text-5xl" style={{ fontFamily: "var(--font-playfair)" }}>
          Your enquiry list
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-fg-muted sm:text-base">
          Everything here goes into a single WhatsApp message. Adjust the quantities, then
          send it and we will reply with availability and the final price.
        </p>
      </header>

      <div className="hairline my-10" />

      <EnquiryList catalogue={catalogue} />
    </div>
  );
}
