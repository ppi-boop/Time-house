import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getSettings } from "@/lib/db/content";

export async function StoryStrip() {
  const { name, home } = await getSettings();

  return (
    <section className="grain relative overflow-hidden bg-green-deep text-champagne">
      <div className="container-luxe relative z-10 grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-float)] sm:aspect-4/5 lg:aspect-square">
          <Image
            src={home.storyImage}
            alt={`Inside the ${name} shop`}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
          <div className="absolute inset-4 rounded-[var(--radius-lg)] border border-gold-light/30" />
        </div>

        <div className="max-w-lg">
          <p className="eyebrow eyebrow-on-dark">Our story</p>
          <h2
            className="display mt-4 text-3xl sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {home.storyTitle}
          </h2>
          <div className="hairline my-7 max-w-[8rem] opacity-60" />
          <p className="text-sm leading-relaxed text-champagne/75 sm:text-base">
            {home.storyQuote}
          </p>
          <p className="mt-5 text-sm leading-relaxed text-champagne/75 sm:text-base">
            {home.storyBody}
          </p>
          <Button asChild variant="onDark" size="lg" className="mt-9">
            <Link href="/about">Read more about us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
