import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium " +
  "transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-luxe " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 disabled:active:scale-100 " +
  "[&_svg]:shrink-0 [&_svg]:size-[1.05em]";

const variants = {
  /** Deep green — the main action on any screen. */
  primary:
    "shine bg-brand text-on-brand shadow-[var(--shadow-soft)] hover:bg-brand-hover hover:shadow-[var(--shadow-lift)] hover:-translate-y-0.5",
  /** Gold gradient — used where the primary would compete with a green ground. */
  gold: "shine bg-linear-to-br from-gold-light via-gold to-gold-light bg-size-[200%_200%] bg-position-[0%_50%] text-green-deep shadow-[var(--shadow-gold)] hover:bg-position-[100%_50%] hover:-translate-y-0.5",
  /** Hairline outline — the secondary action beside a primary. */
  outline:
    "border border-line-strong bg-transparent text-fg hover:border-accent hover:bg-surface-2 hover:-translate-y-0.5",
  /** On a dark green panel. */
  onDark:
    "border border-gold-light/40 bg-white/5 text-champagne backdrop-blur-sm hover:border-gold-light hover:bg-gold-light hover:text-green-deep hover:-translate-y-0.5",
  ghost: "text-fg-muted hover:bg-surface-2 hover:text-fg",
  link: "h-auto p-0 text-fg underline-offset-4 hover:text-accent-ink hover:underline",
} as const;

const sizes = {
  sm: "h-9 rounded-full px-4 text-[0.6875rem] tracking-[0.12em] uppercase",
  md: "h-11 rounded-full px-6 text-xs tracking-[0.14em] uppercase",
  lg: "h-14 rounded-full px-6 text-xs tracking-[0.14em] uppercase sm:px-8 sm:text-[0.8125rem]",
  icon: "size-11 rounded-full",
  /** Square-ish icon button for dense rows (card overlays, toolbars). */
  iconSm: "size-9 rounded-full",
} as const;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Render as the child element (e.g. a Link) while keeping the styles. */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
