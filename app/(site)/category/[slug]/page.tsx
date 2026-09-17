import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ProductBrowser } from "@/components/product/ProductBrowser";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import {
  getCategories,
  getCategoryBySlug,
  getFilterFacets,
  getProducts,
} from "@/lib/products";
import { breadcrumbSchema, itemListSchema, pageMetadata } from "@/lib/seo";
import { STORE } from "@/lib/constants";

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Not found" };

  return pageMetadata({
    title: `${category.name} — ${category.tagline}`,
    description: `${category.description} Order on WhatsApp from ${STORE.name}, ${STORE.address.city}.`,
    path: `/category/${category.slug}`,
    images: [category.image],
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, facets] = await Promise.all([
    getProducts({ category: category.slug }),
    getFilterFacets(category.slug),
  ]);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "All Products", path: "/products" },
    { name: category.name, path: `/category/${category.slug}` },
  ];

  return (
    <>
      <JsonLd schema={[itemListSchema(products, category), breadcrumbSchema(crumbs)]} />

      {/* Category banner */}
      <section className="grain relative overflow-hidden bg-green-deep text-champagne">
        <Image
          src={category.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-linear-to-r from-green-deep via-green-deep/85 to-green-deep/40" />
        <div className="container-luxe relative z-10 py-16 lg:py-24">
          <div className="[&_*]:!text-champagne/70 [&_a:hover]:!text-gold-light">
            <Breadcrumbs items={crumbs} />
          </div>
          <p className="eyebrow eyebrow-on-dark mt-7">{category.tagline}</p>
          <h1
            className="display mt-3 text-4xl sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {category.name}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-champagne/75 sm:text-base">
            {category.description}
          </p>
          <p className="mt-6 text-xs tracking-[0.16em] text-gold-light uppercase tabular-nums">
            {products.length} pieces
          </p>
        </div>
      </section>

      <div className="container-luxe py-12 lg:py-16">
        <Suspense fallback={<BrowserFallback />}>
          <ProductBrowser products={products} facets={facets} />
        </Suspense>
      </div>
    </>
  );
}

function BrowserFallback() {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
