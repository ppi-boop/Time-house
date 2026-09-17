import Image from "next/image";
import Link from "next/link";
import { getLookbook, getSettings } from "@/lib/db/content";

export async function Lookbook() {
  const [shots, settings] = await Promise.all([getLookbook(), getSettings()]);
  if (shots.length === 0) return null;

  return (
    <section className="border-t border-line py-12 lg:py-16">
      <div className="container-luxe text-center">
        <p className="eyebrow">From the shop floor</p>
        <h2
          className="display mt-3 text-2xl sm:text-3xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          New in, every week
        </h2>
        <a
          href={settings.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-xs tracking-[0.16em] text-accent-ink uppercase underline underline-offset-4 hover:text-fg"
        >
          Follow us on Instagram
        </a>
      </div>

      <ul className="no-scrollbar container-luxe mt-8 flex gap-3 overflow-x-auto overscroll-x-contain md:grid md:grid-cols-6 md:overflow-visible">
        {shots.map((shot, index) => (
          <li key={shot.id} className="w-40 shrink-0 md:w-auto">
            <Link
              href="/products"
              className="group relative block aspect-square overflow-hidden rounded-[var(--radius-md)] bg-surface-2 transition-transform duration-500 ease-luxe hover:-translate-y-1.5"
              aria-label="Browse new arrivals"
            >
              <Image
                src={shot.image}
                alt=""
                fill
                sizes="(max-width: 768px) 160px, 17vw"
                loading="lazy"
                className="object-cover transition-transform duration-[900ms] ease-luxe group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-green-deep/0 transition-colors duration-500 group-hover:bg-green-deep/25" />
              <span className="sr-only">Look {index + 1}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
