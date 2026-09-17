import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { generalEnquiryLink } from "@/lib/whatsapp";

export default function NotFound() {
  return (
    <div className="container-luxe flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">404</p>
      <h1
        className="display mt-5 text-4xl sm:text-5xl lg:text-6xl"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        This one is not on the shelf
      </h1>
      <p className="mt-6 max-w-md text-sm leading-relaxed text-fg-muted sm:text-base">
        The page you were after has moved or never existed. The collection is all still here
        — or ask us and we will point you to it.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/products">Browse the collection</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href={generalEnquiryLink()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            Ask us on WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
