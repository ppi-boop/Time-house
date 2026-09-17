"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowRight, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatPrice, cn } from "@/lib/utils";
import type { MenuCategory, SearchDoc } from "@/lib/navigation";

const QUICK_SEARCHES = ["Automatic", "Couple set", "Sling bag", "Gift", "Under ₹2,000"];
const MAX_RESULTS = 6;

/**
 * Site search as a command palette. Opens on click or ⌘K / Ctrl+K, matches as you
 * type, and jumps straight to a product with Enter.
 */
/** Fetched once per session and shared by every mount of the palette. */
let indexPromise: Promise<SearchDoc[]> | null = null;

function loadIndex() {
  indexPromise ??= fetch("/api/search")
    .then((res) => (res.ok ? res.json() : []))
    .catch(() => []);
  return indexPromise;
}

export function SearchPalette({
  menu,
  open,
  onOpenChange,
}: {
  menu: MenuCategory[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [index, setIndex] = useState<SearchDoc[]>([]);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  // Pull the index in as the palette opens, so the first keystroke has data.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    loadIndex().then((docs) => {
      if (!cancelled) setIndex(docs);
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    // Whole-word matches beat mid-word ones, so "gold" finds the gold cufflinks
    // before it finds Marigold Lane.
    const startsWord = (text: string) =>
      text.split(/[^a-z0-9]+/).some((word) => word.startsWith(term));

    const scored = index
      .map((doc) => {
        const name = doc.name.toLowerCase();
        const brand = doc.brand.toLowerCase();
        if (name.startsWith(term)) return { doc, score: 0 };
        if (startsWord(name)) return { doc, score: 1 };
        if (brand.startsWith(term)) return { doc, score: 2 };
        if (startsWord(doc.keywords)) return { doc, score: 3 };
        if (name.includes(term) || brand.includes(term)) return { doc, score: 4 };
        if (doc.keywords.includes(term)) return { doc, score: 5 };
        return null;
      })
      .filter((hit): hit is { doc: SearchDoc; score: number } => hit !== null)
      .sort((a, b) => a.score - b.score);

    return scored.slice(0, MAX_RESULTS).map((hit) => hit.doc);
  }, [index, query]);

  useEffect(() => setActive(0), [query]);

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (results.length === 0) {
      if (event.key === "Enter" && query.trim()) {
        event.preventDefault();
        go(`/products?q=${encodeURIComponent(query.trim())}`);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(`/product/${results[active].slug}`);
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-60 bg-green-deep/55 backdrop-blur-sm data-[state=closed]:animate-[fade-out_180ms_ease] data-[state=open]:animate-[fade-in_220ms_ease]" />
        <DialogPrimitive.Content
          className={cn(
            "fixed top-[8vh] left-1/2 z-60 w-[min(92vw,42rem)] -translate-x-1/2 overflow-hidden",
            "rounded-[var(--radius-lg)] border border-line bg-surface shadow-[var(--shadow-float)]",
            "data-[state=closed]:animate-[pop-out_180ms_ease] data-[state=open]:animate-[pop-in_280ms_var(--ease-out-quint)]",
          )}
        >
          <DialogPrimitive.Title className="sr-only">Search products</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Type to find a watch, bag or accessory. Use the arrow keys to move through
            results and Enter to open one.
          </DialogPrimitive.Description>

          {/* The whole row lights up rather than the input drawing its own box —
              a full-width outline inside a rounded panel reads as a mistake. */}
          <div className="group relative flex items-center gap-3 border-b border-line px-5 transition-colors focus-within:bg-surface-2/60">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-linear-to-r from-gold to-gold-light transition-transform duration-400 ease-luxe group-focus-within:scale-x-100"
            />
            <Search className="size-[18px] shrink-0 text-accent" aria-hidden="true" />
            {/* Focus belongs in the field the moment the palette opens. */}
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search the collection…"
              aria-label="Search products"
              aria-controls="search-results"
              className="h-16 w-full bg-transparent text-base placeholder:text-fg-subtle focus-visible:outline-none"
            />
            <DialogPrimitive.Close
              aria-label="Close search"
              className="-mr-1 shrink-0 rounded-full p-2 text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <X className="size-4" />
            </DialogPrimitive.Close>
          </div>

          <div className="max-h-[min(60vh,28rem)] overflow-y-auto p-3">
            {query.trim() === "" ? (
              <Suggestions menu={menu} onPick={setQuery} onGo={go} />
            ) : results.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="text-sm text-fg-muted">
                  Nothing matches <span className="text-fg">“{query}”</span>.
                </p>
                <button
                  type="button"
                  onClick={() => go(`/products?q=${encodeURIComponent(query.trim())}`)}
                  className="mt-4 inline-flex items-center gap-2 text-xs tracking-[0.14em] text-accent-ink uppercase underline underline-offset-4 hover:text-fg"
                >
                  Search the full catalogue
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            ) : (
              <>
                <p className="px-3 pb-2 text-[0.625rem] tracking-[0.2em] text-fg-subtle uppercase">
                  {results.length} result{results.length === 1 ? "" : "s"}
                </p>
                <ul id="search-results" ref={listRef} role="listbox" aria-label="Search results">
                  {results.map((doc, i) => (
                    <li key={doc.slug} role="option" aria-selected={i === active}>
                      <Link
                        href={`/product/${doc.slug}`}
                        onClick={() => onOpenChange(false)}
                        onMouseEnter={() => setActive(i)}
                        className={cn(
                          "flex items-center gap-4 rounded-[var(--radius-sm)] p-2.5 transition-colors",
                          i === active ? "bg-surface-2" : "hover:bg-surface-2",
                        )}
                      >
                        <span className="relative aspect-square w-12 shrink-0 overflow-hidden rounded-[var(--radius-xs)] bg-surface-2">
                          <Image src={doc.image} alt="" fill sizes="48px" className="object-cover" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-fg">
                            {doc.name}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-fg-subtle">
                            {doc.brand} · {doc.category}
                            {!doc.inStock && " · Sold out"}
                          </span>
                        </span>
                        <span className="shrink-0 text-sm tabular-nums text-fg-muted">
                          {formatPrice(doc.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => go(`/products?q=${encodeURIComponent(query.trim())}`)}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] px-4 py-3 text-xs tracking-[0.14em] text-accent-ink uppercase transition-colors hover:bg-surface-2"
                >
                  See all results
                  <ArrowRight className="size-3.5" />
                </button>
              </>
            )}
          </div>

          <div className="hidden items-center justify-between border-t border-line bg-surface-2 px-5 py-3 text-[0.625rem] tracking-[0.12em] text-fg-subtle uppercase sm:flex">
            <span className="flex items-center gap-3">
              <Key>↑</Key>
              <Key>↓</Key>
              to navigate
            </span>
            <span className="flex items-center gap-2">
              <Key>enter</Key>
              to open
            </span>
            <span className="flex items-center gap-2">
              <Key>esc</Key>
              to close
            </span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function Suggestions({
  menu,
  onPick,
  onGo,
}: {
  menu: MenuCategory[];
  onPick: (term: string) => void;
  onGo: (href: string) => void;
}) {
  return (
    <div className="space-y-6 p-2">
      <div>
        <p className="px-1 pb-3 text-[0.625rem] tracking-[0.2em] text-fg-subtle uppercase">
          Try
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => onPick(term)}
              className="rounded-full border border-line px-3.5 py-1.5 text-xs text-fg-muted transition-colors hover:border-accent hover:text-fg"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="px-1 pb-3 text-[0.625rem] tracking-[0.2em] text-fg-subtle uppercase">
          Browse
        </p>
        <ul className="grid gap-1 sm:grid-cols-2">
          {menu.map((category) => (
            <li key={category.slug}>
              <button
                type="button"
                onClick={() => onGo(category.href)}
                className="group flex w-full items-center gap-3 rounded-[var(--radius-sm)] p-2.5 text-left transition-colors hover:bg-surface-2"
              >
                <span className="relative aspect-square w-10 shrink-0 overflow-hidden rounded-[var(--radius-xs)] bg-surface-2">
                  <Image src={category.image} alt="" fill sizes="40px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-fg">{category.name}</span>
                  <span className="block text-xs text-fg-subtle">{category.count} pieces</span>
                </span>
                <ArrowRight className="size-3.5 -translate-x-1 text-accent opacity-0 transition-all duration-300 ease-luxe group-hover:translate-x-0 group-hover:opacity-100" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-[4px] border border-line bg-surface px-1.5 py-0.5 font-sans text-[0.625rem] text-fg-muted">
      {children}
    </kbd>
  );
}
