import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories, getProducts } from "@/lib/db/content";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  return <ProductForm product={product} categories={categories} />;
}
