import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { Logo } from "@/components/layout/Logo";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { FOOTER_LINKS } from "@/lib/constants";
import { generalEnquiryLink } from "@/lib/whatsapp";
import { fullAddress, getCategories, getSettings } from "@/lib/db/content";

export async function Footer() {
  const [shop, categories] = await Promise.all([getSettings(), getCategories()]);

  // Built here rather than in constants.ts so a category added in the admin
  // panel reaches the footer as well as the menu.
  const groups = [
    {
      title: "Shop",
      links: [
        { href: "/products", label: "All Products" },
        ...categories.map((category) => ({
          href: `/category/${category.slug}`,
          label: category.name,
        })),
      ],
    },
    ...FOOTER_LINKS,
  ];
  const address = fullAddress(shop);
  const socials = [
    { href: shop.socials.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: shop.socials.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: shop.socials.youtube, label: "YouTube", Icon: YoutubeIcon },
  ];

  return (
    <footer className="grain relative mt-16 overflow-hidden bg-green-deep text-champagne">
      <div className="container-luxe relative z-10 py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Logo onDark />
            <p className="mt-5 text-sm leading-relaxed text-champagne/70">
              {shop.tagline} Since {shop.foundedYear}, from a single counter on{" "}
              {shop.address.locality}.
            </p>

            <a
              href={generalEnquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex h-12 items-center gap-2.5 border border-gold-light/45 px-6 text-[0.6875rem] tracking-[0.16em] text-champagne uppercase transition-colors hover:bg-gold-light hover:text-green-deep"
            >
              <WhatsAppIcon className="size-4" />
              Message us on WhatsApp
            </a>

            <ul className="mt-8 space-y-3 text-sm text-champagne/70">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold-light" />
                <span>{address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-gold-light" />
                <a href={`tel:${shop.phone}`} className="hover:text-champagne">
                  {shop.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-gold-light" />
                <a href={`mailto:${shop.email}`} className="hover:text-champagne">
                  {shop.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {groups.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="eyebrow eyebrow-on-dark">{group.title}</h2>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-champagne/70 transition-colors hover:text-champagne"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div className="sm:col-span-3">
              <div className="hairline mt-2 mb-6 opacity-40" />
              <h2 className="eyebrow eyebrow-on-dark">Store hours</h2>
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2 sm:max-w-md">
                {shop.hours.map((slot) => (
                  <div key={slot.days} className="flex justify-between gap-4 sm:block">
                    <dt className="text-champagne/70">{slot.days}</dt>
                    <dd className="text-champagne">{slot.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-champagne/15 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-champagne/55">
            © {new Date().getFullYear()} {shop.legalName}. All rights reserved.
          </p>

          <ul className="flex items-center gap-1">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center text-champagne/60 transition-colors hover:text-gold-light"
                >
                  <Icon className="size-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-[0.6875rem] leading-relaxed text-champagne/40">
          Prices shown are indicative and confirmed on WhatsApp before purchase. This site is a
          catalogue — there is no online payment. All brand names shown are our own house labels.
        </p>
      </div>
    </footer>
  );
}
