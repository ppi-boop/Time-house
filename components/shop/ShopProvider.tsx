"use client";

import { createContext, useContext, useMemo } from "react";
import { STORE, WHATSAPP_NUMBER } from "@/lib/constants";
import type { ShopSettings } from "@/lib/db/content";

/**
 * Shop details for the client half of the site.
 *
 * Server components just await getSettings(). The header, the mobile menu and
 * every WhatsApp button are client components, though, and they need the same
 * live values — so the root layout reads the settings once and hands them down
 * through here rather than each component fetching for itself.
 */

/** Only the fields the browser actually needs; the rest stays on the server. */
export type PublicShop = Pick<
  ShopSettings,
  "name" | "logo" | "whatsapp" | "phone" | "email" | "tagline"
>;

const ShopContext = createContext<PublicShop | null>(null);

export function ShopProvider({
  shop,
  children,
}: {
  shop: PublicShop;
  children: React.ReactNode;
}) {
  // The object identity changes on every server render otherwise, which would
  // re-render every consumer on each navigation.
  const value = useMemo(() => shop, [shop]);
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

/**
 * The shop front always has a provider. The admin panel does not — it renders
 * outside that shell — yet it still uses the logo, so falling back to the
 * configured defaults is better than crashing a page over a wordmark.
 */
const FALLBACK: PublicShop = {
  name: STORE.name,
  logo: null,
  whatsapp: WHATSAPP_NUMBER,
  phone: STORE.phone,
  email: STORE.email,
  tagline: STORE.tagline,
};

export function useShop(): PublicShop {
  return useContext(ShopContext) ?? FALLBACK;
}
