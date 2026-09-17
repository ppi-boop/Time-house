import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getProducts } from "@/lib/db/content";
import { cn, formatPrice } from "@/lib/utils";
import { AdminNotice } from "@/components/admin/AdminNotice";

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; stock?: string; saved?: string; deleted?: string }>;
}) {
  const { q, stock, saved, deleted } = await searchParams;
  const all = await getProducts();

  const needle = (q ?? "").trim().toLowerCase();
  const products = all.filter((product) => {
    if (stock === "out" && product.inStock) return false;
    if (!needle) return true;
    return [product.name, product.brand, product.sku, product.slug]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>
            Products
          </h1>
          <p className="mt-2 text-sm text-fg-muted">
            {all.length} in the catalogue
            {products.length !== all.length && ` · ${products.length} shown`}
          </p>
        </div>
        <Button asChild size="md" className="w-full sm:w-auto">
          <Link href="/admin/products/new">Add a product</Link>
        </Button>
      </div>

      {saved && <AdminNotice>Saved. The change is live on the site.</AdminNotice>}
      {deleted && <AdminNotice>Product removed.</AdminNotice>}

      <form className="mt-7 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by name, brand or SKU"
          className="h-11 w-full min-w-0 rounded-full border border-line bg-surface px-5 text-sm focus-visible:border-accent focus-visible:outline-none sm:flex-1"
        />
        {stock === "out" && <input type="hidden" name="stock" value="out" />}
        <div className="flex gap-3">
          <Button type="submit" variant="outline" size="md" className="flex-1 sm:flex-none">
            Search
          </Button>
          {(needle || stock) && (
            <Button asChild variant="ghost" size="md" className="flex-1 sm:flex-none">
              <Link href="/admin/products">Clear</Link>
            </Button>
          )}
        </div>
      </form>

      {/* Column headings only make sense once the rows are columns. */}
      <div className="mt-9 hidden gap-4 border-b border-line px-4 pb-2 text-xs tracking-[0.12em] text-fg-subtle uppercase sm:grid sm:grid-cols-[3rem_minmax(0,1fr)_7rem_5rem] lg:grid-cols-[3rem_minmax(0,1fr)_9rem_7rem_5rem]">
        <span aria-hidden="true" />
        <span>Product</span>
        <span className="hidden lg:block">Shelf</span>
        <span className="text-right">Price</span>
        <span className="text-right">Stock</span>
      </div>

      <ul className="mt-7 divide-y divide-line overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface sm:mt-0 sm:rounded-t-none sm:border-t-0">
        {products.map((product) => (
          <li key={product.slug}>
            <Link
              href={`/admin/products/${product.slug}`}
              className="flex items-start gap-4 p-4 transition-colors hover:bg-surface-2 sm:grid sm:grid-cols-[3rem_minmax(0,1fr)_7rem_5rem] sm:items-center lg:grid-cols-[3rem_minmax(0,1fr)_9rem_7rem_5rem]"
            >
              <span className="relative aspect-4/5 w-12 shrink-0 overflow-hidden rounded-[var(--radius-xs)] bg-surface-2">
                <Image
                  src={product.images[0]}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-fg">{product.name}</span>
                <span className="mt-0.5 block truncate text-xs text-fg-subtle">
                  {product.brand} · {product.sku}
                  {/* The shelf has its own column from lg; below that it rides along here. */}
                  <span className="lg:hidden"> · {product.subCategory.replace(/-/g, " ")}</span>
                </span>
                {/* On a phone the price sits under the name rather than in a column. */}
                <span className="mt-1.5 block text-xs text-fg-muted tabular-nums sm:hidden">
                  {formatPrice(product.price)} · {product.inStock ? "In stock" : "Sold out"}
                </span>
              </span>

              <span className="hidden truncate text-xs text-fg-subtle lg:block">
                {product.subCategory.replace(/-/g, " ")}
              </span>

              <span className="hidden text-right text-sm tabular-nums sm:block">
                {formatPrice(product.price)}
              </span>

              <span
                className={cn(
                  "hidden text-right text-xs sm:block",
                  product.inStock ? "text-fg-subtle" : "text-accent-ink",
                )}
              >
                {product.inStock ? "In stock" : "Sold out"}
              </span>
            </Link>
          </li>
        ))}

        {products.length === 0 && (
          <li className="p-10 text-center text-sm text-fg-muted">
            Nothing matches that search.
          </li>
        )}
      </ul>
    </div>
  );
}
