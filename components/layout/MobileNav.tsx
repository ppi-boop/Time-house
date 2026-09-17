"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown, Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DrawerClose, DrawerContent } from "@/components/ui/Drawer";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { generalEnquiryLink } from "@/lib/whatsapp";
import { useShop } from "@/components/shop/ShopProvider";
import { cn } from "@/lib/utils";
import type { MenuCategory } from "@/lib/navigation";

const FLAT_LINKS = [
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Visit Us" },
  { href: "/faq", label: "FAQ" },
];

/**
 * Mobile menu. Categories expand in place rather than pushing the visitor
 * through a second screen to reach a collection.
 */
export function MobileNav({ menu }: { menu: MenuCategory[] }) {
  const pathname = usePathname();
  const shop = useShop();
  const [open, setOpen] = useState<string | null>(
    menu.find((c) => pathname.startsWith(c.href))?.slug ?? null,
  );

  return (
    <DrawerContent side="left" title="Menu" description={`Browse ${shop.name}`}>
      <nav className="px-5 py-4">
        <DrawerClose asChild>
          <Link
            href="/products"
            className="flex items-center justify-between border-b border-line py-4 font-serif text-xl text-fg"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            All Products
          </Link>
        </DrawerClose>

        {menu.map((category) => (
          <Collapsible.Root
            key={category.slug}
            open={open === category.slug}
            onOpenChange={(next) => setOpen(next ? category.slug : null)}
            className="border-b border-line"
          >
            <Collapsible.Trigger className="group flex w-full items-center justify-between py-4 text-left">
              <span
                className="font-serif text-xl text-fg"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {category.name}
              </span>
              <span className="flex items-center gap-3">
                <span className="text-xs text-fg-subtle tabular-nums">{category.count}</span>
                <ChevronDown className="size-4 text-accent transition-transform duration-300 ease-luxe group-data-[state=open]:rotate-180" />
              </span>
            </Collapsible.Trigger>

            <Collapsible.Content className="overflow-hidden data-[state=closed]:animate-[collapse-up_240ms_ease] data-[state=open]:animate-[collapse-down_240ms_ease]">
              <ul className="space-y-0.5 pb-4">
                <li>
                  <DrawerClose asChild>
                    <Link
                      href={category.href}
                      className="block rounded-[var(--radius-xs)] px-3 py-2.5 text-sm text-accent-ink"
                    >
                      Everything in {category.name}
                    </Link>
                  </DrawerClose>
                </li>
                {category.subCategories.map((sub) => (
                  <li key={sub.slug}>
                    <DrawerClose asChild>
                      <Link
                        href={sub.href}
                        className="flex items-center justify-between rounded-[var(--radius-xs)] px-3 py-2.5 text-sm text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
                      >
                        {sub.name}
                        <span className="text-xs text-fg-subtle tabular-nums">{sub.count}</span>
                      </Link>
                    </DrawerClose>
                  </li>
                ))}
              </ul>

              {/* One piece, so the menu shows product rather than only words. */}
              {category.featured[0] && (
                <DrawerClose asChild>
                  <Link
                    href={`/product/${category.featured[0].slug}`}
                    className="mb-4 flex items-center gap-3 rounded-[var(--radius-sm)] bg-surface-2 p-3"
                  >
                    <span className="relative aspect-4/5 w-12 shrink-0 overflow-hidden rounded-[var(--radius-xs)]">
                      <Image
                        src={category.featured[0].image}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.625rem] tracking-[0.14em] text-accent-ink uppercase">
                        New in
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-fg">
                        {category.featured[0].name}
                      </span>
                    </span>
                  </Link>
                </DrawerClose>
              )}
            </Collapsible.Content>
          </Collapsible.Root>
        ))}

        {FLAT_LINKS.map((link) => (
          <DrawerClose asChild key={link.href}>
            <Link
              href={link.href}
              className={cn(
                "block border-b border-line py-4 text-sm tracking-[0.1em] uppercase transition-colors",
                pathname === link.href ? "text-accent-ink" : "text-fg-muted hover:text-fg",
              )}
            >
              {link.label}
            </Link>
          </DrawerClose>
        ))}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <DrawerClose asChild>
            <Link
              href="/enquiry"
              className="flex items-center justify-center gap-2 rounded-full border border-line py-3 text-[0.6875rem] tracking-[0.12em] text-fg uppercase"
            >
              <ShoppingBag className="size-4" />
              Enquiry
            </Link>
          </DrawerClose>
          <DrawerClose asChild>
            <Link
              href="/wishlist"
              className="flex items-center justify-center gap-2 rounded-full border border-line py-3 text-[0.6875rem] tracking-[0.12em] text-fg uppercase"
            >
              <Heart className="size-4" />
              Wishlist
            </Link>
          </DrawerClose>
        </div>
      </nav>

      <div className="sticky bottom-0 flex items-center gap-3 border-t border-line bg-surface p-5">
        <a
          href={generalEnquiryLink(shop)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand text-xs tracking-[0.14em] text-on-brand uppercase"
        >
          <WhatsAppIcon className="size-4" />
          Chat with us
        </a>
        {/* Only where the header has no room for it. */}
        <ThemeToggle className="size-12 shrink-0 border border-line min-[360px]:hidden" />
      </div>
    </DrawerContent>
  );
}
