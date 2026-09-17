"use client";

import { ArrowRight, Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/store/useToast";

/**
 * Confirmation for anything that happens without navigating — adding to the
 * enquiry list, saving to the wishlist. Sits above the WhatsApp button.
 */
export function Toaster() {
  const toasts = useToast((s) => s.toasts);
  const dismiss = useToast((s) => s.dismiss);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-4 bottom-24 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-28 sm:items-end"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex w-full max-w-md animate-[pop-in_320ms_var(--ease-out-quint)] items-center gap-3 rounded-[var(--radius-lg)] border border-line bg-surface p-3 shadow-[var(--shadow-float)]"
        >
          {toast.image ? (
            <span className="relative aspect-square w-12 shrink-0 overflow-hidden rounded-[var(--radius-xs)] bg-surface-2">
              <Image src={toast.image} alt="" fill sizes="48px" className="object-cover" />
            </span>
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-on-brand">
              <Check className="size-5" />
            </span>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-sm leading-snug font-medium text-balance text-fg">
              {toast.title}
            </p>
            {toast.description && (
              <p className="mt-0.5 truncate text-xs text-fg-subtle">{toast.description}</p>
            )}
          </div>

          {toast.action && (
            <Link
              href={toast.action.href}
              onClick={() => dismiss(toast.id)}
              className="group/act flex shrink-0 items-center gap-1.5 rounded-full bg-surface-2 px-3.5 py-2 text-[0.625rem] tracking-[0.12em] text-fg uppercase transition-colors hover:bg-brand hover:text-on-brand"
            >
              {toast.action.label}
              <ArrowRight className="size-3 transition-transform duration-300 ease-luxe group-hover/act:translate-x-0.5" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            aria-label="Dismiss"
            className="shrink-0 rounded-full p-1.5 text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
