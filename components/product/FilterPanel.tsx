"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { swatchFor } from "@/lib/colours";
import { cn, formatPrice, slugToTitle } from "@/lib/utils";
import type { Gender, ProductFilters } from "@/types";

export interface Facets {
  brands: string[];
  colours: string[];
  subCategories: string[];
  minPrice: number;
  maxPrice: number;
}

const GENDERS: { value: Gender; label: string }[] = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "unisex", label: "Unisex" },
];

export function FilterPanel({
  facets,
  filters,
  onChange,
  showSubCategories = true,
}: {
  facets: Facets;
  filters: ProductFilters;
  onChange: (next: Partial<ProductFilters>) => void;
  showSubCategories?: boolean;
}) {
  const min = filters.minPrice ?? facets.minPrice;
  const max = filters.maxPrice ?? facets.maxPrice;

  const toggleIn = (list: string[] | undefined, value: string) => {
    const current = list ?? [];
    return current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
  };

  return (
    <div className="divide-y divide-line">
      {showSubCategories && facets.subCategories.length > 1 && (
        <Group title="Type">
          <div className="flex flex-wrap gap-2">
            <Chip
              active={!filters.subCategory}
              onClick={() => onChange({ subCategory: undefined })}
            >
              All
            </Chip>
            {facets.subCategories.map((sub) => (
              <Chip
                key={sub}
                active={filters.subCategory === sub}
                onClick={() =>
                  onChange({ subCategory: filters.subCategory === sub ? undefined : sub })
                }
              >
                {slugToTitle(sub)}
              </Chip>
            ))}
          </div>
        </Group>
      )}

      <Group title="Price">
        <SliderPrimitive.Root
          value={[min, max]}
          min={facets.minPrice}
          max={facets.maxPrice}
          step={100}
          minStepsBetweenThumbs={1}
          onValueChange={([lo, hi]) => onChange({ minPrice: lo, maxPrice: hi })}
          className="relative flex h-5 w-full touch-none items-center select-none"
          aria-label="Price range"
        >
          <SliderPrimitive.Track className="relative h-px w-full grow bg-line-strong">
            <SliderPrimitive.Range className="absolute h-px bg-accent" />
          </SliderPrimitive.Track>
          {["Minimum price", "Maximum price"].map((label) => (
            <SliderPrimitive.Thumb
              key={label}
              aria-label={label}
              className="block size-4 rounded-full border-2 border-accent bg-surface shadow-[var(--shadow-soft)] transition-transform hover:scale-125 active:scale-110 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            />
          ))}
        </SliderPrimitive.Root>
        <p className="mt-3 flex justify-between text-xs tabular-nums text-fg-muted">
          <span>{formatPrice(min)}</span>
          <span>{formatPrice(max)}</span>
        </p>
      </Group>

      <Group title="Brand">
        <ul className="space-y-2.5">
          {facets.brands.map((brand) => (
            <li key={brand}>
              <Check
                label={brand}
                checked={filters.brands?.includes(brand) ?? false}
                onChange={() => onChange({ brands: toggleIn(filters.brands, brand) })}
              />
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Colour">
        <div className="flex flex-wrap gap-2">
          {facets.colours.map((colour) => {
            const active = filters.colours?.includes(colour) ?? false;
            return (
              <button
                key={colour}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ colours: toggleIn(filters.colours, colour) })}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-2 text-xs transition-all duration-300 ease-luxe hover:-translate-y-0.5",
                  active
                    ? "border-accent bg-surface-2 text-fg shadow-[var(--shadow-soft)]"
                    : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
                )}
              >
                <span
                  aria-hidden="true"
                  className="size-3.5 rounded-full border border-line"
                  style={{ backgroundColor: swatchFor(colour) }}
                />
                {colour}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="For">
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <Chip
              key={g.value}
              active={filters.gender === g.value}
              onClick={() =>
                onChange({ gender: filters.gender === g.value ? undefined : g.value })
              }
            >
              {g.label}
            </Chip>
          ))}
        </div>
      </Group>

      <Group title="Availability">
        <Check
          label="In stock only"
          checked={filters.inStockOnly ?? false}
          onChange={() => onChange({ inStockOnly: !filters.inStockOnly })}
        />
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-6 first:pt-0">
      <h3 className="eyebrow mb-4">{title}</h3>
      {children}
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs transition-all duration-300 ease-luxe hover:-translate-y-0.5",
        active
          ? "border-accent bg-surface-2 text-fg shadow-[var(--shadow-soft)]"
          : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-fg-muted transition-colors hover:text-fg">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 shrink-0 appearance-none rounded-[5px] border border-line-strong bg-transparent transition-colors checked:border-accent checked:bg-accent checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22 stroke=%22%2300341F%22 stroke-width=%222.4%22><path d=%22M3.5 8.5l3 3 6-6%22/></svg>')] checked:bg-center checked:bg-no-repeat"
      />
      {label}
    </label>
  );
}
