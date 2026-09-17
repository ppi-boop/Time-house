import { CategoryForm } from "@/components/admin/CategoryForm";

export default async function NewCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return <CategoryForm error={error} />;
}
