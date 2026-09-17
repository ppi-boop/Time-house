import { cn } from "@/lib/utils";

/**
 * The admin forms are plain HTML posted to server actions, so these are just
 * labelled inputs — no client state, nothing to hydrate.
 */

const inputClass =
  "mt-1.5 w-full rounded-[var(--radius-sm)] border border-line bg-surface px-3.5 py-3 text-sm text-fg transition-colors " +
  "placeholder:text-fg-subtle focus-visible:border-accent focus-visible:outline-none sm:py-2.5";

export function Field({
  label,
  name,
  hint,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; hint?: string }) {
  return (
    <label className={cn("block min-w-0", className)}>
      <span className="text-xs tracking-[0.12em] text-fg-muted uppercase">{label}</span>
      <input name={name} className={inputClass} {...props} />
      {hint && <span className="mt-1.5 block text-xs text-fg-subtle">{hint}</span>}
    </label>
  );
}

export function TextArea({
  label,
  name,
  hint,
  className,
  rows = 4,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
  hint?: string;
}) {
  return (
    <label className={cn("block min-w-0", className)}>
      <span className="text-xs tracking-[0.12em] text-fg-muted uppercase">{label}</span>
      <textarea name={name} rows={rows} className={cn(inputClass, "leading-relaxed")} {...props} />
      {hint && <span className="mt-1.5 block text-xs text-fg-subtle">{hint}</span>}
    </label>
  );
}

export function Select({
  label,
  name,
  hint,
  children,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
  hint?: string;
}) {
  return (
    <label className={cn("block min-w-0", className)}>
      <span className="text-xs tracking-[0.12em] text-fg-muted uppercase">{label}</span>
      <select name={name} className={cn(inputClass, "cursor-pointer")} {...props}>
        {children}
      </select>
      {hint && <span className="mt-1.5 block text-xs text-fg-subtle">{hint}</span>}
    </label>
  );
}

export function Toggle({
  label,
  name,
  defaultChecked,
  hint,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 shrink-0 accent-[var(--brand)]"
      />
      <span className="min-w-0">
        <span className="block text-sm text-fg">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-fg-subtle">{hint}</span>}
      </span>
    </label>
  );
}

/** A titled block, so long forms stay readable. */
export function Fieldset({
  legend,
  description,
  children,
  className,
}: {
  legend: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset
      className={cn(
        "rounded-[var(--radius-lg)] border border-line bg-surface p-5 sm:p-6 lg:p-7",
        className,
      )}
    >
      <legend className="px-2 text-xs tracking-[0.14em] text-accent-ink uppercase">
        {legend}
      </legend>
      {description && <p className="mb-4 text-xs leading-relaxed text-fg-subtle">{description}</p>}
      <div className="space-y-4 sm:space-y-5">{children}</div>
    </fieldset>
  );
}
