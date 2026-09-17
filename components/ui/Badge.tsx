import { cn } from "@/lib/utils";

const tones = {
  gold: "border-gold/35 bg-gold/12 text-accent-ink backdrop-blur-sm",
  green: "border-transparent bg-brand text-on-brand shadow-[var(--shadow-soft)]",
  muted: "border-line bg-surface/70 text-fg-subtle backdrop-blur-sm",
  danger: "border-transparent bg-fg/85 text-surface backdrop-blur-sm",
} as const;

export function Badge({
  children,
  tone = "gold",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[0.625rem] font-semibold tracking-[0.14em] uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
