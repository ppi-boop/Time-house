import { ImageResponse } from "next/og";
import { getAllProductSlugs, getProductBySlug } from "@/lib/products";
import { STORE } from "@/lib/constants";
import { slugToTitle } from "@/lib/utils";

/** Satori has no ₹ glyph in its default font, so spell the currency out here. */
const ogPrice = (value: number) => `INR ${new Intl.NumberFormat("en-IN").format(value)}`;

export const alt = "Product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProductOgImage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#00341F",
            color: "#F5F1E8",
            fontSize: 64,
            fontFamily: "Georgia, serif",
          }}
        >
          {STORE.name}
        </div>
      ),
      size,
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px",
          background: "linear-gradient(135deg, #00341F 0%, #006039 100%)",
          color: "#F5F1E8",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#D4AF37",
          }}
        >
          <span>{STORE.name}</span>
          <span>{slugToTitle(product.subCategory)}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 24, color: "rgba(245,241,232,0.65)", letterSpacing: 4 }}>
            {product.brand.toUpperCase()}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: product.name.length > 34 ? 60 : 74,
              marginTop: 16,
              lineHeight: 1.08,
              maxWidth: 1000,
            }}
          >
            {product.name}
          </div>
          <div style={{ display: "flex", width: 110, height: 2, background: "#D4AF37", marginTop: 32 }} />
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 52, color: "#D4AF37" }}>
              {ogPrice(product.price)}
            </div>
            <div style={{ display: "flex", fontSize: 22, color: "rgba(245,241,232,0.6)", marginTop: 8 }}>
              {product.inStock ? "In stock" : "Currently sold out"} · SKU {product.sku}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#F5F1E8",
              border: "1px solid rgba(212,175,55,0.6)",
              padding: "16px 28px",
            }}
          >
            Order on WhatsApp
          </div>
        </div>
      </div>
    ),
    size,
  );
}
