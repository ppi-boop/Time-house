import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getCategories, getProducts } from "@/lib/db/content";

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ slug }, { error }] = await Promise.all([params, searchParams]);
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <CategoryForm
      category={category}
      productCount={products.filter((p) => p.category === slug).length}
      error={error}
    />
  );
}
