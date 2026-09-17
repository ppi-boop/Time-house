import { SectionHeading } from "@/components/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";

/** A horizontally scrollable rail on mobile, a plain grid from md up. */
export function ProductRail({
  eyebrow,
  title,
  description,
  href,
  products,
  priority = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  products: Product[];
  priority?: boolean;
}) {
  if (products.length === 0) return null;

  return (
    <section className="py-12 lg:py-16">
      <div className="container-luxe">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          href={href}
        />
      </div>

      <div className="container-luxe">
        <ul
          /* scroll-px matches the px gutter: without it a mandatory snap
             pulls the first card under the left edge on load. */
          className="no-scrollbar fade-edges -mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto overscroll-x-contain px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-x-5 md:gap-y-10 md:overflow-visible md:scroll-px-0 md:px-0 xl:grid-cols-4"
        >
          {products.map((product, index) => (
            <li
              key={product.id}
              className="w-[68%] shrink-0 snap-start sm:w-[43%] md:w-auto md:shrink"
            >
              <ProductCard product={product} layout="grid" priority={priority && index < 4} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
