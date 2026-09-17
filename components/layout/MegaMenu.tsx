"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { MenuCategory } from "@/lib/navigation";

/**
 * Desktop navigation. Each category opens a panel with its collections, two
 * pieces from the shelf, and a way straight through to the category page.
 */
export function MegaMenu({ menu }: { menu: MenuCategory[] }) {
  const pathname = usePathname();

  return (
    <NavigationMenu.Root
      delayDuration={80}
      skipDelayDuration={240}
      className="relative hidden xl:flex"
    >
      <NavigationMenu.List className="flex items-center gap-1">
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link
              href="/products"
              data-active={pathname === "/products"}
              // The category triggers are buttons with display:flex. This one is
              // an anchor inside the li, so it stays inline unless told
              // otherwise — and an inline box ignores vertical padding for line
              // height, dropping its text 2px below every other item.
              className="link-underline flex items-center rounded-full px-3 py-2 text-[0.6875rem] font-medium tracking-[0.16em] whitespace-nowrap text-fg-muted uppercase transition-colors hover:text-fg data-[active=true]:text-fg"
            >
              All Products
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        {menu.map((category) => {
          const active = pathname.startsWith(category.href);
          return (
            <NavigationMenu.Item key={category.slug}>
              <NavigationMenu.Trigger
                data-active={active}
                className={cn(
                  "group/trigger flex items-center gap-1.5 rounded-full px-3 py-2 text-[0.6875rem] font-medium tracking-[0.16em] whitespace-nowrap uppercase transition-colors",
                  "hover:bg-surface-2 data-[state=open]:bg-surface-2",
                  active ? "text-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                {category.name}
                <ChevronDown
                  className="size-3 text-accent transition-transform duration-300 ease-luxe group-data-[state=open]/trigger:rotate-180"
                  aria-hidden="true"
                />
              </NavigationMenu.Trigger>

              <NavigationMenu.Content className="absolute top-0 left-0 w-full data-[motion=from-end]:animate-[fade-in_220ms_ease] data-[motion=from-start]:animate-[fade-in_220ms_ease] data-[motion=to-end]:animate-[fade-out_180ms_ease] data-[motion=to-start]:animate-[fade-out_180ms_ease]">
                <Panel category={category} />
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>

      {/* The panel is portalled into this positioner so it can span the page. */}
      <div className="absolute top-full left-1/2 flex w-screen max-w-6xl -translate-x-1/2 justify-center perspective-[2000px]">
        <NavigationMenu.Viewport
          className={cn(
            "relative mt-3 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-top overflow-hidden",
            "rounded-[var(--radius-lg)] border border-line bg-surface shadow-[var(--shadow-float)]",
            "transition-[width,height] duration-300 ease-luxe",
            "data-[state=closed]:animate-[menu-out_180ms_ease] data-[state=open]:animate-[menu-in_260ms_var(--ease-out-quint)]",
          )}
        />
      </div>
    </NavigationMenu.Root>
  );
}

function Panel({ category }: { category: MenuCategory }) {
  return (
    <div className="grid grid-cols-[1.1fr_1.5fr_1.4fr] gap-8 p-7">
      {/* Category card */}
      <Link
        href={category.href}
        className="group relative flex flex-col justify-end overflow-hidden rounded-[var(--radius-md)] bg-surface-2 p-6"
      >
        <Image
          src={category.image}
          alt=""
          fill
          sizes="320px"
          className="object-cover transition-transform duration-[900ms] ease-luxe group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-green-deep/90 via-green-deep/35 to-transparent" />
        <div className="relative">
          <p className="eyebrow eyebrow-on-dark">{category.tagline}</p>
          <p
            className="mt-2 font-serif text-2xl text-champagne"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {category.name}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-[0.6875rem] tracking-[0.14em] text-gold-light uppercase">
            Shop all {category.count}
            <ArrowRight className="size-3.5 transition-transform duration-300 ease-luxe group-hover:translate-x-1" />
          </span>
        </div>
      </Link>

      {/* Collections */}
      <div>
        <p className="eyebrow">Collections</p>
        <ul className="mt-5 space-y-1">
          {category.subCategories.map((sub) => (
            <li key={sub.slug}>
              <NavigationMenu.Link asChild>
                <Link
                  href={sub.href}
                  className="group flex items-center justify-between rounded-[var(--radius-xs)] px-3 py-2.5 transition-colors hover:bg-surface-2"
                >
                  <span className="text-sm text-fg-muted transition-colors group-hover:text-fg">
                    {sub.name}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-fg-subtle tabular-nums">{sub.count}</span>
                    <ArrowUpRight className="size-3.5 -translate-x-1 text-accent opacity-0 transition-all duration-300 ease-luxe group-hover:translate-x-0 group-hover:opacity-100" />
                  </span>
                </Link>
              </NavigationMenu.Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Two pieces from the shelf */}
      <div>
        <p className="eyebrow">On the shelf</p>
        <ul className="mt-5 space-y-2">
          {category.featured.map((product) => (
            <li key={product.slug}>
              <NavigationMenu.Link asChild>
                <Link
                  href={`/product/${product.slug}`}
                  className="group flex items-center gap-4 rounded-[var(--radius-sm)] p-2 transition-colors hover:bg-surface-2"
                >
                  <span className="relative aspect-4/5 w-16 shrink-0 overflow-hidden rounded-[var(--radius-xs)] bg-surface-2">
                    <Image
                      src={product.image}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-110"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.6875rem] tracking-[0.14em] text-accent-ink uppercase">
                      {product.brand}
                    </span>
                    <span
                      className="mt-1 block font-serif text-sm leading-snug text-fg"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {product.name}
                    </span>
                    <span className="mt-1 block text-xs text-fg-muted tabular-nums">
                      {formatPrice(product.price)}
                    </span>
                  </span>
                </Link>
              </NavigationMenu.Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
