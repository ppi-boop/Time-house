import type { Metadata } from "next";
import { FULL_ADDRESS, SITE_URL, STORE, WHATSAPP_NUMBER } from "@/lib/constants";
import { slugToTitle } from "@/lib/utils";
import type { Category, Product } from "@/types";

export function absoluteUrl(path = "") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path,
  images,
  noIndex,
}: {
  title: string;
  description: string;
  path: string;
  images?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: STORE.name,
      type: "website",
      locale: "en_IN",
      ...(images ? { images: images.map((i) => absoluteUrl(i)) } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: images.map((i) => absoluteUrl(i)) } : {}),
    },
  };
}

/* ----------------------------- JSON-LD ----------------------------- */

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: STORE.address.street,
  addressLocality: `${STORE.address.locality}, ${STORE.address.city}`,
  addressRegion: STORE.address.region,
  postalCode: STORE.address.postalCode,
  addressCountry: STORE.address.country,
};

/** `logo` is the shop's uploaded mark; it falls back to the drawn icon. */
export function organizationSchema(logo?: string | null) {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: STORE.name,
    legalName: STORE.legalName,
    url: SITE_URL,
    logo: logo || absoluteUrl("/icon.svg"),
    email: STORE.email,
    telephone: STORE.phone,
    foundingDate: String(STORE.foundedYear),
    address: postalAddress,
    sameAs: Object.values(STORE.socials),
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: STORE.name,
    description: STORE.description,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessSchema() {
  return {
    "@type": "Store",
    "@id": `${SITE_URL}/#store`,
    name: STORE.name,
    description: STORE.description,
    url: SITE_URL,
    image: absoluteUrl("/products/hero.webp"),
    telephone: STORE.phone,
    email: STORE.email,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    address: postalAddress,
    geo: {
      "@type": "GeoCoordinates",
      latitude: STORE.geo.latitude,
      longitude: STORE.geo.longitude,
    },
    openingHoursSpecification: STORE.openingHours.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.days,
      opens: slot.opens,
      closes: slot.closes,
    })),
    sameAs: Object.values(STORE.socials),
    potentialAction: {
      "@type": "CommunicateAction",
      name: "Order on WhatsApp",
      target: `https://wa.me/${WHATSAPP_NUMBER}`,
    },
  };
}

export function productSchema(product: Product) {
  const url = absoluteUrl(`/product/${product.slug}`);
  return {
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    mpn: product.sku,
    image: product.images.map((i) => absoluteUrl(i)),
    brand: { "@type": "Brand", name: product.brand },
    category: `${slugToTitle(product.category)} > ${slugToTitle(product.subCategory)}`,
    color: product.colours.join(", "),
    audience: {
      "@type": "PeopleAudience",
      suggestedGender: product.gender === "unisex" ? "unisex" : product.gender === "men" ? "male" : "female",
    },
    aggregateRating: product.reviewCount
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: product.currency,
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE_URL}/#organization` },
      availableAtOrFrom: {
        "@type": "Place",
        name: STORE.name,
        address: FULL_ADDRESS,
      },
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function itemListSchema(products: Product[], category?: Category) {
  return {
    "@type": "ItemList",
    name: category ? `${category.name} — ${STORE.name}` : `All products — ${STORE.name}`,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/product/${product.slug}`),
      name: product.name,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
