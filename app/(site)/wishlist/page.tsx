import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WishlistGrid } from "@/components/WishlistGrid";
import { getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Your Wishlist",
  description: "The pieces you have saved for later.",
  path: "/wishlist",
  noIndex: true,
});

export default async function WishlistPage() {
  // The whole catalogue is passed in; the client filters it by saved slugs.
  const products = await getProducts();

  return (
    <div className="container-luxe py-10 lg:py-14">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Wishlist", path: "/wishlist" },
        ]}
      />

      <header className="mt-8 max-w-2xl">
        <p className="eyebrow">Saved for later</p>
        <h1 className="display mt-3 text-4xl sm:text-5xl" style={{ fontFamily: "var(--font-playfair)" }}>
          Your wishlist
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-fg-muted sm:text-base">
          Saved on this device only. When you are ready, tap buy on any piece and we will
          pick up the conversation on WhatsApp.
        </p>
      </header>

      <div className="hairline my-10" />

      <WishlistGrid products={products} />
    </div>
  );
}
