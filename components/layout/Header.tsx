"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Drawer, DrawerTrigger } from "@/components/ui/Drawer";
import { Logo } from "@/components/layout/Logo";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileNav } from "@/components/layout/MobileNav";
import dynamic from "next/dynamic";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { generalEnquiryLink } from "@/lib/whatsapp";
import { useShop } from "@/components/shop/ShopProvider";
import { cn } from "@/lib/utils";
import { selectCount, useEnquiry } from "@/store/useEnquiry";
import { useWishlist } from "@/store/useWishlist";
import type { MenuCategory } from "@/lib/navigation";

// Only needed once someone reaches for search, so it stays out of the first load.
const SearchPalette = dynamic(() =>
  import("@/components/layout/SearchPalette").then((m) => m.SearchPalette),
);

export function Header({ menu }: { menu: MenuCategory[] }) {
  const pathname = usePathname();
  const shop = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchMounted, setSearchMounted] = useState(false);

  const enquiryCount = useEnquiry(selectCount);
  const enquiryHydrated = useEnquiry((s) => s.hydrated);
  const wishlistCount = useWishlist((s) => s.slugs.length);
  const wishlistHydrated = useWishlist((s) => s.hydrated);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  function openSearch() {
    setSearchMounted(true);
    setSearchOpen(true);
  }

  // The header owns ⌘K, because it is what mounts the palette in the first place.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchMounted(true);
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-500 ease-luxe",
          scrolled
            ? "glass border-b border-line shadow-[var(--shadow-soft)]"
            : "border-b border-transparent bg-surface",
        )}
      >
        <div
          className={cn(
            "container-luxe flex items-center justify-between gap-2 transition-[height] duration-500 ease-luxe sm:gap-4",
            scrolled ? "h-16 lg:h-[4.5rem]" : "h-16 lg:h-20",
          )}
        >
          <div className="flex min-w-0 items-center gap-1 sm:gap-2">
            {/* Mobile menu */}
            <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
              <DrawerTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="-ml-2 shrink-0 rounded-full p-2 text-fg transition-colors hover:bg-surface-2 xl:hidden"
                >
                  <Menu className="size-5" />
                </button>
              </DrawerTrigger>
              <MobileNav menu={menu} />
            </Drawer>

            <Logo className="xl:flex-none" />
          </div>

          <MegaMenu menu={menu} />

          <div className="flex shrink-0 items-center gap-0 sm:gap-1">
            {/* Opens the palette, which ⌘K also opens from anywhere. */}
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search products"
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg sm:size-10"
            >
              <Search className="size-[18px]" />
            </button>

            {/* Under 360px the drawer carries this instead — four targets plus
                the wordmark do not fit there. */}
            <ThemeToggle className="hidden min-[360px]:flex" />

            <Link
              href="/wishlist"
              aria-label={`Wishlist${wishlistHydrated && wishlistCount ? `, ${wishlistCount} items` : ""}`}
              className="relative flex size-9 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg sm:size-10"
            >
              <Heart className="size-[18px]" />
              {wishlistHydrated && wishlistCount > 0 && <Dot>{wishlistCount}</Dot>}
            </Link>

            <Link
              href="/enquiry"
              aria-label={`Enquiry list${enquiryHydrated && enquiryCount ? `, ${enquiryCount} items` : ""}`}
              className="relative flex size-9 shrink-0 items-center justify-center rounded-full text-fg transition-colors hover:bg-surface-2 sm:size-10"
            >
              <ShoppingBag className="size-[18px]" />
              {enquiryHydrated && enquiryCount > 0 && <Dot>{enquiryCount}</Dot>}
            </Link>

            <a
              href={generalEnquiryLink(shop)}
              target="_blank"
              rel="noopener noreferrer"
              className="shine ml-1.5 hidden h-10 shrink-0 items-center gap-2 rounded-full bg-brand px-5 text-[0.6875rem] tracking-[0.14em] whitespace-nowrap text-on-brand uppercase shadow-[var(--shadow-soft)] transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[var(--shadow-lift)] md:inline-flex xl:hidden 2xl:inline-flex"
            >
              <WhatsAppIcon className="size-4" />
              Order now
            </a>
          </div>
        </div>

        <ScrollProgress />
      </header>

      {/* Mounted only after the first open, then kept for the session. */}
      {searchMounted && (
        <SearchPalette menu={menu} open={searchOpen} onOpenChange={setSearchOpen} />
      )}

      {/* Announced to screen readers when the enquiry list changes. */}
      <p aria-live="polite" className="sr-only">
        {enquiryHydrated
          ? `${enquiryCount} item${enquiryCount === 1 ? "" : "s"} in your enquiry list`
          : ""}
      </p>
    </>
  );
}

/** A gold hairline along the bottom of the header showing read position. */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-px origin-left bg-linear-to-r from-gold to-gold-light transition-transform duration-150 ease-out"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}

function Dot({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="absolute top-1 right-1 flex size-4 animate-[pop-in_280ms_var(--ease-spring)] items-center justify-center rounded-full bg-accent text-[0.5625rem] font-bold text-green-deep tabular-nums"
    >
      {children}
    </span>
  );
}
