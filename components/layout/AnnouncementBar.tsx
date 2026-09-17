import { Clock, RefreshCcw, Sparkles } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { getSettings } from "@/lib/db/content";

/** The icons cycle in this order, whatever the shop writes. */
const ICONS = [WhatsAppIcon, Clock, RefreshCcw, Sparkles];

/**
 * A slow ticker rather than a static line — it carries four messages in the
 * space of one and stops on hover so it can actually be read.
 */
export async function AnnouncementBar() {
  const { announcements } = await getSettings();
  if (announcements.length === 0) return null;

  return (
    <div className="marquee relative overflow-hidden bg-green-deep text-champagne">
      <div className="marquee-track py-2.5">
        {/* Two identical runs; the animation slides by exactly one. */}
        {[0, 1].map((run) => (
          <ul key={run} className="flex shrink-0 items-center" aria-hidden={run === 1}>
            {announcements.map((text, index) => {
              const Icon = ICONS[index % ICONS.length];
              return (
              <li key={text} className="flex items-center gap-2.5 px-8">
                <Icon className="size-3.5 shrink-0 text-gold-light" />
                <span className="text-[0.6875rem] tracking-[0.16em] whitespace-nowrap uppercase">
                  {text}
                </span>
              </li>
              );
            })}
          </ul>
        ))}
      </div>

      {/* Fade the ends so messages arrive and leave rather than snapping. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-green-deep to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-green-deep to-transparent" />
    </div>
  );
}
