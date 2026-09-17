import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Truck, Undo2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { ProductGallery } from "@/components/product/ProductGallery";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import {
  getAllProductSlugs,
  getCategoryBySlug,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";
import { breadcrumbSchema, pageMetadata, productSchema } from "@/lib/seo";
import { discountPercent, formatPrice, slugToTitle } from "@/lib/utils";
import { STORE } from "@/lib/constants";

export const revalidate = 3600;

const DELIVERY_POINTS = [
  {
    Icon: Truck,
    title: "Delivery",
    body: `Same-day hand delivery within ${STORE.address.city}. Anywhere else in India, 3–5 working days by courier — we share the tracking number on WhatsApp.`,
  },
  {
    Icon: Undo2,
    title: "7-day exchange",
    body: "Bring it back with the bill and tags within 7 days and we will exchange it. Sale pieces and engraved items are final.",
  },
  {
    Icon: Check,
    title: "Warranty",
    body: "Handled by us at the counter, not by a service centre in another city.",
  },
];

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };

  return {
    ...pageMetadata({
      title: `${product.name} — ${product.brand}`,
      description: `${product.shortDescription} ${formatPrice(product.price)} at ${STORE.name}. Order on WhatsApp.`,
      path: `/product/${product.slug}`,
      images: [product.images[0]],
    }),
    other: {
      "product:price:amount": String(product.price),
      "product:price:currency": product.currency,
      "product:availability": product.inStock ? "in stock" : "out of stock",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([
    getCategoryBySlug(product.category),
    getRelatedProducts(product, 4),
  ]);

  const discount = discountPercent(product.price, product.mrp);
  const subCategoryName =
    category?.subCategories.find((s) => s.slug === product.subCategory)?.name ??
    slugToTitle(product.subCategory);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "All Products", path: "/products" },
    { name: category?.name ?? slugToTitle(product.category), path: `/category/${product.category}` },
    { name: product.name, path: `/product/${product.slug}` },
  ];

  return (
    <>
      <JsonLd schema={[productSchema(product), breadcrumbSchema(crumbs)]} />
      <StickyBuyBar product={product} />

      <div className="container-luxe py-8 lg:py-12">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <ProductGallery images={product.images} name={product.name} />

          <div className="lg:py-4">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/category/${product.category}?type=${product.subCategory}`}
                className="eyebrow hover:text-fg"
              >
                {subCategoryName}
              </Link>
              {product.isNewArrival && <Badge tone="green">New</Badge>}
              {!product.inStock && <Badge tone="danger">Sold out</Badge>}
            </div>

            <h1
              className="display mt-4 text-3xl sm:text-4xl lg:text-[2.75rem]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {product.name}
            </h1>

            <p className="mt-3 text-sm text-fg-muted">
              by <span className="text-fg">{product.brand}</span>
              <span className="mx-2 text-line-strong">·</span>
              <span className="text-fg-subtle">SKU {product.sku}</span>
            </p>

            <Rating value={product.rating} count={product.reviewCount} className="mt-4" />

            <div className="mt-7 flex flex-wrap items-baseline gap-3">
              <span className="font-serif text-3xl tabular-nums" style={{ fontFamily: "var(--font-playfair)" }}>
                {formatPrice(product.price)}
              </span>
              {product.mrp > product.price && (
                <>
                  <span className="text-base text-fg-subtle line-through tabular-nums">
                    {formatPrice(product.mrp)}
                  </span>
                  <Badge tone="gold">Save {discount}%</Badge>
                </>
              )}
            </div>
            <p className="mt-1.5 text-xs text-fg-subtle">Inclusive of all taxes</p>

            <p className="mt-6 max-w-prose text-sm leading-relaxed text-fg-muted">
              {product.shortDescription}
            </p>

            <div className="hairline my-8" />

            <div id="buy-anchor">
              <PurchasePanel product={product} />
            </div>

            <div className="mt-10">
              <Accordion type="single" collapsible defaultValue="description">
                <AccordionItem value="description">
                  <AccordionTrigger>Description</AccordionTrigger>
                  <AccordionContent>
                    <p className="max-w-prose">{product.description}</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="specs">
                  <AccordionTrigger>Specifications</AccordionTrigger>
                  <AccordionContent>
                    <dl className="divide-y divide-line">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-[9rem_1fr] gap-4 py-3">
                          <dt className="text-xs tracking-[0.1em] text-fg-subtle uppercase">
                            {key}
                          </dt>
                          <dd className="text-sm text-fg">{value}</dd>
                        </div>
                      ))}
                      <div className="grid grid-cols-[9rem_1fr] gap-4 py-3">
                        <dt className="text-xs tracking-[0.1em] text-fg-subtle uppercase">
                          Colours
                        </dt>
                        <dd className="text-sm text-fg">{product.colours.join(", ")}</dd>
                      </div>
                    </dl>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="delivery">
                  <AccordionTrigger>Delivery & exchange</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-4">
                      {DELIVERY_POINTS.map(({ Icon, title, body }) => (
                        <li key={title} className="flex gap-3">
                          <Icon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                          <div>
                            <h3 className="text-sm font-medium text-fg">{title}</h3>
                            <p className="mt-1 max-w-prose">{body}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-luxe border-t border-line py-12 lg:py-16">
          <SectionHeading
            eyebrow="You might also like"
            title={`More from ${category?.name ?? slugToTitle(product.category)}`}
            href={`/category/${product.category}`}
          />
          <ul className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-4">
            {related.map((item) => (
              <li key={item.id}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
