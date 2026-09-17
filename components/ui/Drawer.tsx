"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** A slide-in panel. Used for the mobile nav and the product filters. */
export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

export function DrawerContent({
  children,
  side = "right",
  title,
  description,
  className,
}: {
  children: React.ReactNode;
  side?: "left" | "right" | "bottom";
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-green-deep/50 backdrop-blur-sm data-[state=closed]:animate-[fade-out_200ms_ease] data-[state=open]:animate-[fade-in_200ms_ease]" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 flex flex-col bg-surface shadow-[var(--shadow-float)]",
          side === "right" &&
            "inset-y-0 right-0 h-full w-[min(88vw,26rem)] border-l border-line data-[state=closed]:animate-[slide-out-right_260ms_ease] data-[state=open]:animate-[slide-in-right_260ms_ease]",
          side === "left" &&
            "inset-y-0 left-0 h-full w-[min(88vw,22rem)] border-r border-line data-[state=closed]:animate-[slide-out-left_260ms_ease] data-[state=open]:animate-[slide-in-left_260ms_ease]",
          side === "bottom" &&
            "inset-x-0 bottom-0 max-h-[85vh] rounded-t-[var(--radius-xl)] border-t border-line data-[state=closed]:animate-[slide-out-bottom_260ms_ease] data-[state=open]:animate-[slide-in-bottom_260ms_ease]",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <DialogPrimitive.Title className="text-xs font-semibold uppercase tracking-[0.2em] text-fg">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Close
            aria-label="Close"
            className="-mr-2 rounded-full p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>
        </div>
        {description ? (
          <DialogPrimitive.Description className="sr-only">
            {description}
          </DialogPrimitive.Description>
        ) : (
          <DialogPrimitive.Description className="sr-only">
            {title}
          </DialogPrimitive.Description>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
