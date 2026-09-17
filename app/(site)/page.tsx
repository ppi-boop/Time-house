import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductRail } from "@/components/home/ProductRail";
import { TrustBar } from "@/components/home/TrustBar";
import { StoryStrip } from "@/components/home/StoryStrip";
import { Testimonials } from "@/components/home/Testimonials";
import { Lookbook } from "@/components/home/Lookbook";
import { VisitCta } from "@/components/home/VisitCta";
import { JsonLd } from "@/components/JsonLd";
import { getBestSellers, getNewArrivals, getShowcase } from "@/lib/products";
import { getMegaMenu } from "@/lib/navigation";
import { localBusinessSchema } from "@/lib/seo";

export const revalidate = 3600;

export default async function HomePage() {
  const [categories, newArrivals, bestSellers, showcase] = await Promise.all([
    getMegaMenu(),
    getNewArrivals(8),
    getBestSellers(8),
    getShowcase(3),
  ]);

  return (
    <>
      <JsonLd schema={localBusinessSchema()} />
      <Hero showcase={showcase} />
      <CategoryGrid categories={categories} />
      <ProductRail
        eyebrow="Just arrived"
        title="New this season"
        description="The most recent pieces to reach the counter."
        href="/products?sort=newest"
        products={newArrivals}
        priority
      />
      <TrustBar />
      <ProductRail
        eyebrow="Most asked for"
        title="Best sellers"
        description="What leaves the shop fastest, in the order people ask for it."
        href="/products"
        products={bestSellers}
      />
      <StoryStrip />
      <Testimonials />
      <Lookbook />
      <VisitCta />
    </>
  );
}
