# Time House

A catalogue website for a watch, ladies bag and accessories shop. Customers browse the
whole collection online, then **buy by messaging the shop on WhatsApp** — there is no
checkout and no payment gateway anywhere in this project, by design.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4 and Zustand.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # then edit the WhatsApp number
npm run dev                    # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (pre-renders every product and category page) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

---

## The one thing to configure

Everything hinges on one environment variable:

```bash
# .env.local
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
```

Country code **plus** number, with no `+`, no spaces and no dashes.
`+91 98765 43210` becomes `919876543210`.

Get that wrong and every buy button opens a chat with the wrong person, so it is worth
checking with a real tap before you launch.

The rest of `.env.local`:

| Variable | Used for |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, OG images, and the product link inside each WhatsApp message. No trailing slash. |
| `NEXT_PUBLIC_STORE_NAME` | Header, footer, page titles, schema |
| `NEXT_PUBLIC_STORE_EMAIL` | Footer and contact page |
| `NEXT_PUBLIC_STORE_PHONE` | Footer, contact page, `LocalBusiness` schema |

Shop address, opening hours, social links and the navigation menu live in
[`lib/constants.ts`](lib/constants.ts) — edit them there and they update everywhere,
including the structured data Google reads.

---

## How buying works

Every "buy" on the site ends in WhatsApp with the message already written.

1. **From a product page or card** → opens WhatsApp with that piece, its SKU, the
   selected colour, the quantity and a link back to the page.
2. **From the enquiry list** (`/enquiry`) → opens WhatsApp with every saved piece as one
   numbered message with an estimated total.

All of those messages are built in one place, [`lib/whatsapp.ts`](lib/whatsapp.ts).
Change the wording there and it changes everywhere.

The "enquiry list" is the cart, renamed. It behaves like one — add, change quantity,
remove — except it never checks out. It is stored in the visitor's `localStorage` only;
nothing reaches a server. The wishlist works the same way.

---

## The admin panel

Everything a visitor sees is edited at **`/admin`** — products, categories, shop details,
the homepage wording, the FAQ and the pictures. MongoDB holds all of it and is the only
copy — there is no JSON catalogue in the repository to drift out of step with it.

### First run

```bash
npm run admin:password -- 'a password of your choosing'   # writes a hash to .env.local
npm run db:seed                                           # quotes, FAQ, lookbook, shop details
npm run dev
```

Then sign in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

`.env.local` needs `MONGODB_URI`; `admin:password` fills in `ADMIN_PASSWORD_HASH` and
`ADMIN_SESSION_SECRET` for you. See [`.env.example`](.env.example).

### What is where

| Screen | Edits |
| --- | --- |
| Products | Name, price, SKU, photographs, stock, descriptions, specifications, colours, tags |
| Categories | Add, edit and remove counters, their cards and the shelves inside each |
| Shop details | Address, phone, **the WhatsApp number every buy button uses**, hours, socials, logo, announcement bar |
| Homepage | Hero wording, the promise cards, the story panel, customer quotes, the lookbook strip |
| FAQ | The questions and answers, which also feed the structured data |

Pictures are uploaded inside the form that needs them, so there is no separate media
library to visit and no addresses to copy around.

### How saving works

Each save writes to MongoDB and clears the cached reads, so the change is live on the next
page view — no rebuild. Public pages stay statically rendered with an hour's revalidation;
only `/admin` is server-rendered per request.

Uploads are rotated by their EXIF data, cropped to the shape of the field and converted to
WebP before they leave the server, then stored in Cloudinary and served from its CDN. The
three `CLOUDINARY_*` keys in `.env.local` are required for uploading; without them the
picture fields say so rather than storing the file somewhere unexpected.

### Passwords and sessions

One password for one shop owner, hashed with scrypt in `.env.local` — there is no user
table and no signup. The session is a signed, HTTP-only cookie lasting seven days. Change
the password by re-running `npm run admin:password`; anyone signed in stays signed in until
their cookie expires.

---

## Seeding a fresh database

`npm run db:seed` fills the supporting content — customer quotes, the FAQ, the lookbook
strip, the shop's own details — and creates the indexes. It inserts only what is missing;
`--force` wipes those collections and reloads them.

Products and categories are deliberately **not** seeded. They are the shop's own work and
MongoDB is the only copy, so a fresh database starts with an empty catalogue that is filled
through the admin panel. There is no fallback if the database is unreachable: a read that
fails returns nothing and logs why, which is honest rather than serving a frozen catalogue
from whenever the repository was last touched. Atlas's free tier has no automated backups,
so keep your own if the catalogue matters.

---

## Where the data layer lives

| File | Role |
| --- | --- |
| [`lib/db/mongo.ts`](lib/db/mongo.ts) | The pooled client |
| [`lib/db/collections.ts`](lib/db/collections.ts) | Typed handles and document shapes |
| [`lib/db/content.ts`](lib/db/content.ts) | Cached reads for the public site, tagged so one save refreshes the lot |
| [`lib/admin/media.ts`](lib/admin/media.ts) | Crop, convert and upload to Cloudinary |
| [`lib/products.ts`](lib/products.ts) | The catalogue API every page already used |
| [`lib/catalogue.ts`](lib/catalogue.ts) | Pure filter/sort helpers — safe to import in the browser |
| [`app/admin/actions.ts`](app/admin/actions.ts) | Every write, each checking the session first |

`lib/db/*` is marked `server-only`: importing it from a client component fails the build
rather than leaking a connection string into the browser bundle.

---

## SEO

Already done, but worth knowing about if you change pages:

- Per-page metadata via the Metadata API, with canonical URLs and a title template.
- **Static generation** for every product and category page (`generateStaticParams`),
  revalidated hourly (`export const revalidate = 3600`).
- **Structured data** in [`lib/seo.ts`](lib/seo.ts): `Product` + `Offer` on product pages,
  `ItemList` on listings, `BreadcrumbList`, `Store`/`LocalBusiness` on home, about and
  contact, `FAQPage` on `/faq`, and `Organization` + `WebSite` sitewide.
- `app/sitemap.ts` and `app/robots.ts` generate `/sitemap.xml` and `/robots.txt` from the
  live product list. `/enquiry` and `/wishlist` are excluded — they are personal and
  device-local.
- Social share images are generated per product and per category with `next/og`.

Two things to do before launch:

1. Set `NEXT_PUBLIC_SITE_URL` to the real domain. The sitemap and every canonical URL
   depend on it.
2. Submit `https://yourdomain.com/sitemap.xml` in Google Search Console, and claim the
   shop's Google Business Profile — for a local shop that matters more than anything on
   this list.

---

## Design

Rolex-inspired palette: deep green leads, gold is an accent only — thin rules, small-caps
labels, hover states — never large gold fills. Tokens are defined once in
[`app/globals.css`](app/globals.css) under `@theme` and `:root`, with a dark variant:
colours, corner radii (`--radius-*`), elevation (`--shadow-*`) and easing curves
(`--ease-luxe`, `--ease-spring`). Change a token there and the whole site follows.

Type is Playfair Display for headings, Inter for everything else, both via `next/font`.

Dark mode follows the system by default, and the header toggle overrides it. The choice is
applied by a small inline script in the root layout before first paint, so the page never
flashes. Shadows soften into lit rims in dark mode, because elevation shadows read as
nothing on a dark ground.

### Navigation and search

- **Mega menu** (`components/layout/MegaMenu.tsx`) — each category opens a panel with its
  collections, live counts, and two pieces from the shelf. Built on Radix Navigation Menu,
  so it is keyboard- and screen-reader-operable.
- **Mobile menu** (`components/layout/MobileNav.tsx`) — categories expand in place rather
  than pushing through a second screen.
- **Command palette** (`components/layout/SearchPalette.tsx`) — ⌘K / Ctrl+K or the search
  button. Whole-word matches rank above mid-word ones, arrow keys move, Enter opens.

All three read from [`lib/navigation.ts`](lib/navigation.ts), which is built on the server
in the root layout so the menu and search have data on first paint.

### Motion

Kept restrained and consistent: a staggered hero entrance, count-up stats, one shared 14px
rise for sections entering view, slow image zooms on cards, a shine sweep across primary
buttons, and a gold scroll-progress hairline under the header.

All of it is **CSS animations plus one small hook** (`hooks/useInView.ts`) — there is no
animation library in the bundle. `prefers-reduced-motion` is honoured globally in
`globals.css`, which reduces every animation and transition to near-zero, so new motion
inherits that automatically.

One trap worth knowing about in `useInView`: its inset is applied **vertically only**. A
negative horizontal `rootMargin` shrinks the observer root sideways too, and a narrow
element sitting in the page's side gutter then never intersects at all — which is exactly
how the first hero counter got stuck at zero.

### The focus ring, and why it is in `@layer base`

`:focus-visible` is styled once in `globals.css`, inside `@layer base`. That placement
matters: **unlayered CSS outranks every Tailwind utility**, so an unlayered focus rule
silently overrides `focus:outline-none` everywhere and components cannot style their own
focus. It also sets no `border-radius` — the outline already follows the element's own
corners, and forcing one there squared off every pill button the moment it took focus.

If you restyle focus, keep both of those properties.

### Product cards

`ProductCard` has two layouts, chosen with the `layout` prop rather than a breakpoint,
because the two callers need different things at the same screen width:

- **`"auto"`** (default, used by the listing grids) — one product per row on a phone, image
  beside the details; the usual vertical card from `sm` up.
- **`"grid"`** (used by the home rails) — always vertical, because those cards already sit
  in a narrow horizontally-scrolling column where a side-by-side layout would not fit.

Cards line up — same height, prices on the same baseline — through four things together.
Change one and the row goes ragged:

1. `h-full` on the card, so it stretches to the grid row,
2. `line-clamp-2` plus `min-h` on the title, so a one-line name reserves the same space as
   a two-line one,
3. **the title's `line-height` set inline, not with `leading-*`** — Tailwind's `text-*`
   utilities also emit a `line-height` and win the cascade, so `leading-snug` was silently
   dropped and two-line titles overran the reserved `min-h`. The `min-h` is `2.8em`, which
   is exactly two lines at the inline `1.4`; if you change one, change the other.
4. `mt-auto` on the price row, pinning it to the bottom.

In the row layout the image fills its column (the column stretches to the card height, so
a fixed `aspect-square` would leave a dead strip underneath). In the vertical layout the
image is square on a phone and 4:5 from `sm` up.

### Performance

- **The home page is a server component end to end.** The banner, including its floating
  product cards, ships no client JavaScript.
- **The search index is not in the page payload.** It is ~40KB of product text, served
  from `/api/search` and fetched once, the first time someone opens the palette.
- **The palette and quick-view modal are `next/dynamic`** — neither is in the first load.
- **`loading.tsx` on every listing and product route**, so a click paints a skeleton
  immediately instead of appearing to hang.

First Load JS: 133 kB on the home page, 170 kB on listing pages. Client-side navigation
measures 40–90 ms in a production build.

> If navigation feels slow, check you are not testing `npm run dev`. The dev server
> compiles each route the first time you visit it, which can take seconds. Use
> `npm run build && npm start` to see real speed.

### Feedback and shortcuts

- **Toasts** (`components/ui/Toaster.tsx`, `store/useToast.ts`) confirm adds to the enquiry
  list and wishlist, with a thumbnail and a link straight to the list.
- **Quick view** (`components/product/QuickView.tsx`) — check colour, size and price from
  the grid, and buy without loading the full page.
- **Sticky buy bar** (`components/product/StickyBuyBar.tsx`) follows the customer down long
  product pages on mobile.
- The bottom-of-screen furniture coordinates through `store/useBottomBar.ts`, so the
  floating WhatsApp button and back-to-top move aside for the buy bar instead of stacking
  on it. If you add anything else fixed to the bottom, read that store.

---

## Structure

```
app/            routes, sitemap.ts, robots.ts, OG image routes
components/
  ui/           Button, Badge, Accordion, Drawer, Rating, Skeleton, Toaster, Counter
  layout/       Header, MegaMenu, MobileNav, SearchPalette, AnnouncementBar,
                Footer, Logo, ThemeToggle, WhatsAppFab, ScrollToTop
  product/      ProductCard, QuickView, ProductGallery, PurchasePanel,
                StickyBuyBar, filters, browser
  home/         Hero, CategoryGrid, ProductRail, StoryStrip, Testimonials…
  enquiry/      EnquiryList
lib/            products.ts (data layer), navigation.ts (menu + search index),
                whatsapp.ts, seo.ts, colours.ts, constants.ts
store/          useEnquiry.ts, useWishlist.ts, useToast.ts, useBottomBar.ts
scripts/        seed-db.mjs, set-admin-password.mjs
```

---

## Deploying

Push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new). Add the
environment variables from `.env.example` in the Vercel project settings — remembering that
`NEXT_PUBLIC_SITE_URL` must be the production domain, not `localhost`.

This needs a Node host, not static hosting: `MONGODB_URI`, `ADMIN_PASSWORD_HASH`,
`ADMIN_SESSION_SECRET` and the three `CLOUDINARY_*` keys all live on the server and none
carry a `NEXT_PUBLIC_` prefix, so none of them reach the browser.

---

## Before you launch

- [ ] Real WhatsApp number, address, phone, email and opening hours — **Shop details**
- [ ] Real social links (they currently point at the platform home pages) — **Shop details**
- [ ] Real product photos and real prices — **Products**
- [ ] Customer quotes replaced with real ones, used with permission — **Homepage**
- [ ] `NEXT_PUBLIC_SITE_URL` set to the live domain, or WhatsApp messages carry
      `localhost` links
- [ ] MongoDB password rotated if the connection string has ever been pasted anywhere
- [ ] Delivery, exchange and warranty wording on `/faq` and the product pages checked
      against what you actually do

## A note on the sample data

The brands in the seed catalogue — Meridian, Aurelius, Cassia, Verrow and the rest — are
invented for this demo. They are not real labels. Replace them with what you actually
stock; do not use a trademarked brand name on a product you cannot show is genuine.

The green-and-gold palette is inspired by luxury watch retail generally. The site carries
no third-party branding, and it should stay that way.
