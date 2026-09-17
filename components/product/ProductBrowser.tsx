"use client";

import { ChevronDown, LayoutGrid, Rows3, Search, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { FilterPanel, type Facets } from "@/components/product/FilterPanel";
import { ProductCard } from "@/components/product/ProductCard";
import { BuyOnWhatsAppButton } from "@/components/product/BuyOnWhatsAppButton";
import { AddToEnquiryButton } from "@/components/product/AddToEnquiryButton";
import { filterProducts, sortProducts } from "@/lib/catalogue";
import { cn, discountPercent, formatPrice, slugToTitle } from "@/lib/utils";
import type { Gender, Product, ProductFilters, SortKey } from "@/types";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A to Z" },
];

const PAGE_SIZE = 12;

export function ProductBrowser({
  products,
  facets,
  showSubCategories = true,
}: {
  products: Product[];
  facets: Facets;
  showSubCategories?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [filters, setFilters] = useState<ProductFilters>(() => ({
    subCategory: searchParams.get("type") ?? undefined,
    gender: (searchParams.get("for") as Gender) ?? undefined,
    sort: (searchParams.get("sort") as SortKey) ?? "newest",
    search: searchParams.get("q") ?? undefined,
  }));

  // The input is uncontrolled by the filter state so typing stays responsive;
  // it is copied into `filters.search` 250ms after the last keystroke.
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setFilters((f) => ({ ...f, search: searchInput || undefined })),
      250,
    );
    return () => clearTimeout(timer);
  }, [searchInput]);

  /** The last query string this component wrote, to tell it apart from one
      that arrived from somewhere else. */
  const ours = useRef<string | null>(null);

  /** Keep the URL shareable without pushing a history entry per keystroke. */
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("q", filters.search);
    if (filters.subCategory) params.set("type", filters.subCategory);
    if (filters.gender) params.set("for", filters.gender);
    if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);
    const query = params.toString();
    ours.current = query;
    startTransition(() => {
      router.replace(query ? `?${query}` : window.location.pathname, { scroll: false });
    });
  }, [filters.search, filters.subCategory, filters.gender, filters.sort, router]);

  /**
   * Adopt a query string this component did not write: a mega-menu link, a
   * shared address, the back button.
   *
   * Without this, picking a second shelf from the same category menu did
   * nothing. The state above is seeded by useState's initialiser, which runs
   * only on the first mount — and navigating from ?type=ladies-watches to
   * ?type=mens-watches keeps the same component mounted, so the filter stayed
   * on the old shelf and the effect above then wrote the stale address back
   * over the new one.
   */
  const incoming = searchParams.toString();
  useEffect(() => {
    if (incoming === ours.current) return;
    ours.current = incoming;
    const next = new URLSearchParams(incoming);
    setFilters((current) => ({
      ...current,
      subCategory: next.get("type") ?? undefined,
      gender: (next.get("for") as Gender) ?? undefined,
      sort: (next.get("sort") as SortKey) ?? "newest",
      search: next.get("q") ?? undefined,
    }));
    setSearchInput(next.get("q") ?? "");
  }, [incoming]);

  const results = useMemo(
    () => sortProducts(filterProducts(products, filters), filters.sort),
    [products, filters],
  );

  useEffect(() => setVisible(PAGE_SIZE), [results.length, filters.sort]);

  function update(next: Partial<ProductFilters>) {
    setFilters((current) => ({ ...current, ...next }));
  }

  function clearAll() {
    setFilters({ sort: filters.sort });
    setSearchInput("");
  }

  const activeChips = buildActiveChips(filters, facets);

  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
      {/* Desktop filters */}
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
              Filters
            </h2>
            {activeChips.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-accent-ink underline underline-offset-4 hover:text-fg"
              >
                Clear all
              </button>
            )}
          </div>
          <FilterPanel
            facets={facets}
            filters={filters}
            onChange={update}
            showSubCategories={showSubCategories}
          />
        </div>
      </aside>

      <div className="min-w-0">
        {/* Toolbar */}
        <div className="grid grid-cols-[auto_1fr] gap-3 sm:flex sm:flex-wrap sm:items-center">
          <div className="relative col-span-2 min-w-0 sm:flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-fg-subtle" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search watches, bags, accessories…"
              aria-label="Search products"
              className="h-12 w-full rounded-full border border-line bg-transparent pr-4 pl-11 text-sm placeholder:text-fg-subtle transition-colors focus:border-accent focus:outline-none"
            />
          </div>

          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="md" className="h-12 w-full sm:w-auto lg:hidden">
                <SlidersHorizontal />
                Filters
                {activeChips.length > 0 && (
                  <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-accent text-[0.625rem] font-bold text-green-deep">
                    {activeChips.length}
                  </span>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent side="bottom" title="Filters" description="Narrow the collection">
              <div className="px-5 py-6">
                <FilterPanel
                  facets={facets}
                  filters={filters}
                  onChange={update}
                  showSubCategories={showSubCategories}
                />
              </div>
              <div className="sticky bottom-0 flex gap-3 border-t border-line bg-surface p-5">
                <Button variant="outline" size="md" className="flex-1" onClick={clearAll}>
                  Clear
                </Button>
                <Button size="md" className="flex-1" onClick={() => setDrawerOpen(false)}>
                  Show {results.length} result{results.length === 1 ? "" : "s"}
                </Button>
              </div>
            </DrawerContent>
          </Drawer>

          <label className="sr-only" htmlFor="sort">
            Sort products
          </label>
          {/* The native control keeps the platform picker on touch; only its
              shell and chevron are ours, so it sits with the other pills. */}
          <div className="relative min-w-0 sm:w-auto">
            <select
              id="sort"
              value={filters.sort ?? "newest"}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              className="h-12 w-full cursor-pointer appearance-none truncate rounded-full border border-line bg-surface pr-10 pl-4 text-xs text-fg transition-colors hover:border-line-strong focus-visible:border-accent focus-visible:outline-none sm:w-auto sm:pr-11 sm:pl-5 sm:text-[0.8125rem]"
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-accent"
            />
          </div>

          <div className="hidden overflow-hidden rounded-full border border-line sm:flex">
            {(["grid", "list"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                aria-label={`${mode} view`}
                aria-pressed={view === mode}
                className={cn(
                  "flex size-12 items-center justify-center transition-colors",
                  view === mode ? "bg-surface-2 text-fg" : "text-fg-subtle hover:text-fg",
                )}
              >
                {mode === "grid" ? <LayoutGrid className="size-4" /> : <Rows3 className="size-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Active filters + count */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <p className="mr-2 text-xs text-fg-muted tabular-nums" aria-live="polite">
            {results.length} {results.length === 1 ? "piece" : "pieces"}
          </p>
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => update(chip.clear)}
              className="group/chip inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-xs text-fg-muted transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:border-accent hover:text-fg"
            >
              {chip.label}
              <X className="size-3 transition-transform duration-300 ease-luxe group-hover/chip:rotate-90" />
            </button>
          ))}
          {activeChips.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-accent-ink underline underline-offset-4 hover:text-fg"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="hairline mt-5 mb-8" />

        {results.length === 0 ? (
          <EmptyState onClear={clearAll} />
        ) : view === "grid" ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-9 md:grid-cols-3 xl:grid-cols-4">
            {results.slice(0, visible).map((product, index) => (
              <li key={product.id}>
                <ProductCard product={product} priority={index < 4} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-[var(--radius-lg)] border border-line">
            {results.slice(0, visible).map((product) => (
              <li key={product.id}>
                <ListRow product={product} />
              </li>
            ))}
          </ul>
        )}

        {visible < results.length && (
          <div className="mt-14 flex flex-col items-center gap-4">
            <p className="text-xs text-fg-subtle tabular-nums">
              Showing {Math.min(visible, results.length)} of {results.length}
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            >
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ListRow({ product }: { product: Product }) {
  const discount = discountPercent(product.price, product.mrp);
  return (
    <div className="flex gap-5 p-5 transition-colors duration-300 hover:bg-surface-2">
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-4/5 w-24 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-surface-2 sm:w-32"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="128px"
          className="object-cover"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow">{product.brand}</p>
          <h3 className="mt-1 font-serif text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
            <Link href={`/product/${product.slug}`} className="hover:text-accent-ink">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1.5 line-clamp-2 max-w-prose text-sm text-fg-muted">
            {product.shortDescription}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Rating value={product.rating} count={product.reviewCount} />
            {!product.inStock && <Badge tone="danger">Sold out</Badge>}
            {product.inStock && discount >= 20 && <Badge tone="gold">{discount}% off</Badge>}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-fg-subtle line-through tabular-nums">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <BuyOnWhatsAppButton product={product} size="sm" label="Buy" />
            <AddToEnquiryButton product={product} size="sm" label="Add" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-[var(--radius-lg)] border border-line bg-surface-2/50 px-6 py-24 text-center">
      <Search className="size-8 text-line-strong" />
      <h3 className="mt-5 font-serif text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
        Nothing matches that
      </h3>
      <p className="mt-3 max-w-sm text-sm text-fg-muted">
        Try removing a filter — or message us on WhatsApp and we will tell you whether
        we have it at the counter.
      </p>
      <Button variant="outline" size="md" className="mt-7" onClick={onClear}>
        Clear all filters
      </Button>
    </div>
  );
}

function buildActiveChips(filters: ProductFilters, facets: Facets) {
  const chips: { key: string; label: string; clear: Partial<ProductFilters> }[] = [];

  if (filters.search) {
    chips.push({ key: "q", label: `“${filters.search}”`, clear: { search: undefined } });
  }
  if (filters.subCategory) {
    chips.push({
      key: "type",
      label: slugToTitle(filters.subCategory),
      clear: { subCategory: undefined },
    });
  }
  if (filters.gender) {
    chips.push({ key: "gender", label: slugToTitle(filters.gender), clear: { gender: undefined } });
  }
  filters.brands?.forEach((brand) =>
    chips.push({
      key: `brand-${brand}`,
      label: brand,
      clear: { brands: filters.brands!.filter((b) => b !== brand) },
    }),
  );
  filters.colours?.forEach((colour) =>
    chips.push({
      key: `colour-${colour}`,
      label: colour,
      clear: { colours: filters.colours!.filter((c) => c !== colour) },
    }),
  );
  if (
    (filters.minPrice !== undefined && filters.minPrice > facets.minPrice) ||
    (filters.maxPrice !== undefined && filters.maxPrice < facets.maxPrice)
  ) {
    chips.push({
      key: "price",
      label: `${formatPrice(filters.minPrice ?? facets.minPrice)} – ${formatPrice(filters.maxPrice ?? facets.maxPrice)}`,
      clear: { minPrice: undefined, maxPrice: undefined },
    });
  }
  if (filters.inStockOnly) {
    chips.push({ key: "stock", label: "In stock", clear: { inStockOnly: false } });
  }

  return chips;
}
