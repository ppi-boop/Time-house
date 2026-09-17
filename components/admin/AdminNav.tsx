"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/shop", label: "Shop details" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/faq", label: "FAQ" },
];

/**
 * Section navigation.
 *
 * Below md it is a tab strip sitting on a hairline, with the current section
 * marked by a gold underline. From md up the same links become a rail, where
 * the marker moves to a gold edge down the left. Both read as navigation rather
 * than as a row of buttons — the only actual buttons in the panel are the ones
 * that save something.
 */
export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="min-w-0 md:sticky md:top-24 md:self-start">
      <ul
        className={cn(
          "no-scrollbar -mx-5 flex gap-1 overflow-x-auto overscroll-x-contain px-5",
          // The hairline runs the full width of the strip, under every tab.
          "border-b border-line",
          "md:mx-0 md:flex-col md:gap-0.5 md:overflow-visible md:border-b-0 md:px-0",
        )}
      >
        {SECTIONS.map((section) => {
          const active =
            section.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(section.href);

          return (
            <li key={section.href} className="shrink-0">
              <Link
                href={section.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "-mb-px block border-b-2 px-3 py-3 text-xs tracking-[0.12em] whitespace-nowrap uppercase transition-colors",
                  "md:mb-0 md:rounded-[var(--radius-sm)] md:border-b-0 md:border-l-2 md:py-2.5 md:pr-3 md:pl-4",
                  active
                    ? "border-accent text-fg md:bg-surface-2 md:font-medium"
                    : "border-transparent text-fg-subtle hover:text-fg md:hover:bg-surface-2/60",
                )}
              >
                {section.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
