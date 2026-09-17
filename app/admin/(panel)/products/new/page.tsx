import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/db/content";

export default async function NewProductPage() {
  return <ProductForm categories={await getCategories()} />;
}
