"use client";

import { create } from "zustand";

export interface Toast {
  id: number;
  title: string;
  description?: string;
  image?: string;
  /** Optional link rendered as the toast's action. */
  action?: { label: string; href: string };
}

interface ToastState {
  toasts: Toast[];
  push: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
}

let nextId = 0;

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = ++nextId;
    // Three at a time is plenty; older ones drop off the end.
    set((state) => ({ toasts: [{ ...toast, id }, ...state.toasts].slice(0, 3) }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4200);
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
