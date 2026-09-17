import Link from "next/link";
import * as db from "@/lib/db/collections";
import { getSettings } from "@/lib/db/content";

async function counts() {
  try {
    const [products, categories, testimonials, faqs] = await Promise.all([
      (await db.products()).countDocuments(),
      (await db.categories()).countDocuments(),
      (await db.testimonials()).countDocuments(),
      (await db.faqs()).countDocuments(),
    ]);
    const outOfStock = await (await db.products()).countDocuments({ inStock: false });
    return { products, categories, testimonials, faqs, outOfStock, error: false };
  } catch {
    return { products: 0, categories: 0, testimonials: 0, faqs: 0, outOfStock: 0, error: true };
  }
}

export default async function AdminOverview() {
  const [stats, settings] = await Promise.all([counts(), getSettings()]);

  const tiles = [
    { label: "Products", value: stats.products, href: "/admin/products" },
    { label: "Out of stock", value: stats.outOfStock, href: "/admin/products?stock=out" },
    { label: "Categories", value: stats.categories, href: "/admin/categories" },
    { label: "Testimonials", value: stats.testimonials, href: "/admin/homepage" },
    { label: "FAQ answers", value: stats.faqs, href: "/admin/faq" },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>
        {settings.name}
      </h1>
      <p className="mt-2 text-sm text-fg-muted">
        Everything a visitor sees is edited from here. Changes go live as soon as you save.
      </p>

      {stats.error && (
        <p className="mt-6 rounded-[var(--radius-sm)] border border-line-strong bg-surface p-4 text-sm text-fg">
          The database could not be reached. The public site is still serving its last known
          catalogue, but nothing can be edited until the connection is back.
        </p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            className="rounded-[var(--radius-lg)] border border-line bg-surface p-5 transition-colors hover:border-line-strong sm:p-6"
          >
            <p className="text-xs tracking-[0.12em] text-fg-muted uppercase">{tile.label}</p>
            <p
              className="mt-2 font-serif text-3xl tabular-nums sm:mt-3 sm:text-4xl"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {tile.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-[var(--radius-lg)] border border-line bg-surface p-6 sm:p-7">
        <h2 className="text-xs tracking-[0.14em] text-accent-ink uppercase">Where things live</h2>
        <dl className="mt-5 space-y-4 text-sm">
          <div>
            <dt className="text-fg">Products &amp; categories</dt>
            <dd className="mt-1 text-fg-muted">
              Names, prices, photographs, stock and the copy on each product page.
            </dd>
          </div>
          <div>
            <dt className="text-fg">Shop details</dt>
            <dd className="mt-1 text-fg-muted">
              Address, phone, the WhatsApp number every buy button uses, opening hours, social
              links and the logo.
            </dd>
          </div>
          <div>
            <dt className="text-fg">Homepage</dt>
            <dd className="mt-1 text-fg-muted">
              The hero wording, the story panel, customer quotes and the lookbook strip.
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
