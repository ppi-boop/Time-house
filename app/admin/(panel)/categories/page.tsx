import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { getCategories, getProducts } from "@/lib/db/content";

export default async function AdminCategories({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const { saved, deleted, error } = await searchParams;
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  /** How much stock sits on each counter. */
  const holding = new Map<string, number>();
  for (const product of products) {
    holding.set(product.category, (holding.get(product.category) ?? 0) + 1);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>
            Categories
          </h1>
          <p className="mt-2 text-sm text-fg-muted">
            {categories.length} {categories.length === 1 ? "counter" : "counters"} in the shop
          </p>
        </div>
        <Button asChild size="md" className="w-full sm:w-auto">
          <Link href="/admin/categories/new">Add a category</Link>
        </Button>
      </div>

      {error && <AdminNotice tone="warning">{error}</AdminNotice>}
      {saved && <AdminNotice>Saved {saved}. The change is live on the site.</AdminNotice>}
      {deleted && <AdminNotice>Category removed.</AdminNotice>}

      {/* Column headings only make sense once the rows are columns. */}
      <div className="mt-9 hidden gap-4 border-b border-line px-4 pb-2 text-xs tracking-[0.12em] text-fg-subtle uppercase sm:grid sm:grid-cols-[3rem_minmax(0,1fr)_6rem] lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,14rem)_6rem]">
        <span aria-hidden="true" />
        <span>Category</span>
        <span className="hidden lg:block">Shelves</span>
        <span className="text-right">Products</span>
      </div>

      <ul className="mt-7 divide-y divide-line overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface sm:mt-0 sm:rounded-t-none sm:border-t-0">
        {categories.map((category) => {
          const stock = holding.get(category.slug) ?? 0;
          const shelves = category.subCategories.map((s) => s.name).join(", ");

          return (
            <li key={category.slug}>
              <Link
                href={`/admin/categories/${category.slug}`}
                className="flex items-start gap-4 p-4 transition-colors hover:bg-surface-2 sm:grid sm:grid-cols-[3rem_minmax(0,1fr)_6rem] sm:items-center lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,14rem)_6rem]"
              >
                <span className="relative aspect-4/5 w-12 shrink-0 overflow-hidden rounded-[var(--radius-xs)] bg-surface-2">
                  <Image src={category.image} alt="" fill sizes="48px" className="object-cover" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-fg">{category.name}</span>
                  <span className="mt-0.5 block truncate text-xs text-fg-subtle">
                    /category/{category.slug}
                    {/* The shelves have their own column from lg; below that they ride along here. */}
                    {shelves && <span className="lg:hidden"> · {shelves}</span>}
                  </span>
                  {/* On a phone the count sits under the name rather than in a column. */}
                  <span className="mt-1.5 block text-xs text-fg-muted tabular-nums sm:hidden">
                    {stock} {stock === 1 ? "product" : "products"}
                  </span>
                </span>

                <span className="hidden truncate text-xs text-fg-subtle lg:block">
                  {shelves || "No shelves yet"}
                </span>

                <span className="hidden text-right text-sm tabular-nums sm:block">{stock}</span>
              </Link>
            </li>
          );
        })}

        {categories.length === 0 && (
          <li className="p-10 text-center text-sm text-fg-muted">
            No categories yet. Add the first one to open the shop.
          </li>
        )}
      </ul>
    </div>
  );
}
