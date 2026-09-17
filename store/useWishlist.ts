"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistState {
  slugs: string[];
  hydrated: boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  setHydrated: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set) => ({
      slugs: [],
      hydrated: false,
      toggle: (slug) =>
        set((state) => ({
          slugs: state.slugs.includes(slug)
            ? state.slugs.filter((s) => s !== slug)
            : [slug, ...state.slugs],
        })),
      remove: (slug) =>
        set((state) => ({ slugs: state.slugs.filter((s) => s !== slug) })),
      clear: () => set({ slugs: [] }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "time-house-wishlist",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ slugs: state.slugs }) as WishlistState,
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
