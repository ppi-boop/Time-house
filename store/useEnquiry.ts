"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { EnquiryItem, Product } from "@/types";

/**
 * The "cart". Nothing is ever checked out here — the list is only there so a
 * customer can gather a few pieces and send them to us as one WhatsApp message.
 */
interface EnquiryState {
  items: EnquiryItem[];
  hydrated: boolean;
  add: (product: Product, options?: { quantity?: number; colour?: string }) => void;
  remove: (productId: string, colour?: string) => void;
  setQuantity: (productId: string, quantity: number, colour?: string) => void;
  clear: () => void;
  setHydrated: () => void;
}

/** The same product in two colours is two lines on the message. */
const sameLine = (item: EnquiryItem, productId: string, colour?: string) =>
  item.productId === productId && (item.colour ?? "") === (colour ?? "");

export const useEnquiry = create<EnquiryState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,

      add: (product, options = {}) =>
        set((state) => {
          const colour = options.colour ?? product.colours[0];
          const quantity = Math.max(1, options.quantity ?? 1);
          const existing = state.items.find((i) => sameLine(i, product.id, colour));

          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, product.id, colour)
                  ? { ...i, quantity: Math.min(99, i.quantity + quantity) }
                  : i,
              ),
            };
          }

          const item: EnquiryItem = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            sku: product.sku,
            price: product.price,
            image: product.images[0],
            category: product.category,
            colour,
            quantity,
          };
          return { items: [...state.items, item] };
        }),

      remove: (productId, colour) =>
        set((state) => ({
          items: state.items.filter((i) => !sameLine(i, productId, colour)),
        })),

      setQuantity: (productId, quantity, colour) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              sameLine(i, productId, colour)
                ? { ...i, quantity: Math.min(99, Math.max(0, quantity)) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),

      clear: () => set({ items: [] }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "time-house-enquiry",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }) as EnquiryState,
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

export const selectCount = (state: EnquiryState) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);

/* No selectTotal here on purpose: the stored lines carry the price as it was
   when the piece was added, so the total is worked out in the enquiry list,
   after each line has been refreshed against the catalogue. */
