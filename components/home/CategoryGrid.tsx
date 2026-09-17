import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import type { MenuCategory } from "@/lib/navigation";

export function CategoryGrid({ categories }: { categories: MenuCategory[] }) {
  return (
    <section className="container-luxe py-14 lg:py-20">
      <SectionHeading
        eyebrow="Shop by category"
        title="Four counters, one shop"
        description="Everything we stock, grouped the way it sits in the store."
        href="/products"
        linkLabel="Browse everything"
      />

      <ul className="mt-9 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {categories.map((category, index) => (
          <li key={category.slug}>
            <Reveal delay={index * 0.06}>
              <Link
                href={category.href}
                className="group relative block aspect-4/5 overflow-hidden rounded-[var(--radius-lg)] sm:aspect-3/4 bg-surface-2 shadow-[var(--shadow-soft)] transition-[transform,box-shadow] duration-500 ease-luxe hover:-translate-y-2 hover:shadow-[var(--shadow-float)]"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1100ms] ease-luxe group-hover:scale-[1.09]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-green-deep/90 via-green-deep/20 to-transparent transition-opacity duration-500 group-hover:from-green-deep/95" />
                {/* Gold rim that draws itself on hover. */}
                <div className="absolute inset-3 rounded-[var(--radius-md)] border border-gold-light/0 transition-colors duration-500 ease-luxe group-hover:border-gold-light/35" />

                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                  <p className="eyebrow eyebrow-on-dark hidden sm:inline-flex">{category.tagline}</p>
                  <h3
                    className="mt-1 flex items-start gap-1.5 font-serif text-lg leading-tight text-champagne sm:mt-2 sm:text-2xl"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {category.name}
                    <ArrowUpRight className="mt-1 size-4 shrink-0 text-gold-light sm:size-5 transition-transform duration-300 ease-luxe group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </h3>
                  <p className="mt-1.5 flex items-center gap-2 text-[0.6875rem] whitespace-nowrap text-champagne/65 sm:text-xs">
                    <span>{category.subCategories.length} collections</span>
                    <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-gold-light/60" />
                    <span>{category.count} pieces</span>
                  </p>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
