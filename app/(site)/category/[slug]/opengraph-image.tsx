import { ImageResponse } from "next/og";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/products";
import { STORE } from "@/lib/constants";
import type { CategorySlug } from "@/types";

export const alt = "Category";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryOgImage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await getCategoryBySlug(params.slug);
  const products = category
    ? await getProducts({ category: params.slug as CategorySlug })
    : [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #00341F 0%, #006039 100%)",
          color: "#F5F1E8",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 8, textTransform: "uppercase", color: "#D4AF37" }}>
          {STORE.name}
        </div>
        <div style={{ display: "flex", fontSize: 88, marginTop: 24, lineHeight: 1.05 }}>
          {category?.name ?? "Collection"}
        </div>
        <div style={{ display: "flex", width: 120, height: 2, background: "#D4AF37", marginTop: 34, marginBottom: 34 }} />
        <div style={{ display: "flex", fontSize: 30, color: "rgba(245,241,232,0.78)", maxWidth: 860 }}>
          {category?.tagline ?? "Browse the collection"} · {products.length} pieces · Order on WhatsApp
        </div>
      </div>
    ),
    size,
  );
}
