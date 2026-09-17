"use client";

import { create } from "zustand";

/**
 * The product page's sticky buy bar owns the bottom of the screen on mobile.
 * The floating WhatsApp button, the back-to-top button and the toasts all read
 * this so they move out of its way instead of stacking on top of it.
 */
interface BottomBarState {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const useBottomBar = create<BottomBarState>((set) => ({
  visible: false,
  setVisible: (visible) => set({ visible }),
}));
