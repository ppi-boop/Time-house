import { Suspense } from "react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ProductBrowser } from "@/components/product/ProductBrowser";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { getFilterFacets, getProducts } from "@/lib/products";
import { STORE } from "@/lib/constants";
import { breadcrumbSchema, itemListSchema, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "All Products — Watches, Bags & Accessories",
  description: `Browse every piece at ${STORE.name}: watches, ladies bags, and accessories for men and women. Filter by type, brand, colour and price, then order on WhatsApp.`,
  path: "/products",
});

export default async function ProductsPage() {
  const [products, facets] = await Promise.all([getProducts(), getFilterFacets()]);

  return (
    <>
      <JsonLd
        schema={[
          itemListSchema(products),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "All Products", path: "/products" },
          ]),
        ]}
      />

      <div className="container-luxe py-10 lg:py-14">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "All Products", path: "/products" },
          ]}
        />

        <header className="mt-8 max-w-2xl">
          <p className="eyebrow">The full collection</p>
          <h1
            className="display mt-3 text-4xl sm:text-5xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Everything in the shop
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-fg-muted sm:text-base">
            {products.length} pieces across watches, bags and accessories. Narrow it down however
            you like — every piece is bought by messaging us on WhatsApp.
          </p>
        </header>

        <div className="hairline my-10" />

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
