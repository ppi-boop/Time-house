import { BadgeCheck, MessageCircle, RefreshCcw, Store } from "lucide-react";
import { getSettings } from "@/lib/db/content";

/** The icons cycle in this order, whatever the shop writes. */
const ICONS = [BadgeCheck, MessageCircle, RefreshCcw, Store];

export async function TrustBar() {
  const { trustPoints } = await getSettings();
  if (trustPoints.length === 0) return null;

  return (
    <section className="border-y border-line bg-surface-2">
      <div className="container-luxe">
        <ul className="grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:py-10">
          {trustPoints.map((point, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <li
                key={point.title}
                className="flex gap-4 rounded-[var(--radius-md)] border border-transparent bg-surface p-5 transition-[border-color,box-shadow,transform] duration-400 ease-luxe hover:-translate-y-1 hover:border-line hover:shadow-[var(--shadow-soft)]"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/12 text-accent-ink">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-medium">{point.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">{point.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
