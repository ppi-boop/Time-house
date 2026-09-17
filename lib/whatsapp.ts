import { SITE_URL, STORE, WHATSAPP_NUMBER } from "@/lib/constants";
import { formatPrice, slugToTitle } from "@/lib/utils";
import type { EnquiryItem, Product } from "@/types";

/**
 * Every "buy" on this site ends in WhatsApp. Build the link in one place so the
 * message the shop receives always looks the same, wherever the customer clicked.
 *
 * The number and the shop name come from the admin panel, so each builder takes
 * them as an optional argument. Left out, they fall back to the values in the
 * environment — which is also what happens if the database cannot be reached.
 */
export interface WhatsAppShop {
  whatsapp: string;
  name: string;
}

const DEFAULT_SHOP: WhatsAppShop = { whatsapp: WHATSAPP_NUMBER, name: STORE.name };

function link(message: string, shop: WhatsAppShop) {
  return `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(message)}`;
}

const hello = (shop: WhatsAppShop) => `Hello ${shop.name}! 👋`;

/** Floating button / header / footer — no product context. */
export function generalEnquiryLink(shop: WhatsAppShop = DEFAULT_SHOP) {
  return link(
    `${hello(shop)}\nI'd like to know more about your products.\n\n${SITE_URL}`,
    shop,
  );
}

/** "I'd like to visit the store" — used on the contact page. */
export function visitEnquiryLink(shop: WhatsAppShop = DEFAULT_SHOP) {
  return link(
    `${hello(shop)}\nI'd like to visit the store. Could you confirm your timings and availability?`,
    shop,
  );
}

export function productEnquiryLink(
  product: Product,
  options: { quantity?: number; colour?: string; shop?: WhatsAppShop } = {},
) {
  const shop = options.shop ?? DEFAULT_SHOP;
  const quantity = options.quantity ?? 1;
  const lines = [
    hello(shop),
    `I'm interested in this product:`,
    ``,
    `*${product.name}*`,
    `Category: ${slugToTitle(product.category)} › ${slugToTitle(product.subCategory)}`,
    `Brand: ${product.brand}`,
    `SKU: ${product.sku}`,
  ];

  if (options.colour) lines.push(`Colour: ${options.colour}`);

  lines.push(
    `Price: ${formatPrice(product.price)}`,
    `Quantity: ${quantity}`,
    `Link: ${SITE_URL}/product/${product.slug}`,
    ``,
    `Please share availability and details.`,
  );

  return link(lines.join("\n"), shop);
}

/** The enquiry list ("cart") sent as one message. */
export function enquiryListLink(items: EnquiryItem[], shop: WhatsAppShop = DEFAULT_SHOP) {
  if (items.length === 0) return generalEnquiryLink(shop);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  const lines = [
    hello(shop),
    `I'd like to enquire about ${totalQty} item${totalQty > 1 ? "s" : ""}:`,
    ``,
  ];

  items.forEach((item, index) => {
    lines.push(
      `${index + 1}. *${item.name}*`,
      `   SKU: ${item.sku}${item.colour ? ` · Colour: ${item.colour}` : ""}`,
      `   ${formatPrice(item.price)} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`,
      `   ${SITE_URL}/product/${item.slug}`,
      ``,
    );
  });

  lines.push(
    `*Estimated total: ${formatPrice(total)}*`,
    ``,
    `Please confirm availability and the final price.`,
  );

  return link(lines.join("\n"), shop);
}

/** Share this product with a friend, rather than with the shop. */
export function shareProductLink(product: Product) {
  return `https://wa.me/?text=${encodeURIComponent(
    `${product.name} — ${formatPrice(product.price)}\n${SITE_URL}/product/${product.slug}`,
  )}`;
}
