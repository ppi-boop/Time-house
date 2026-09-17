import { cn } from "@/lib/utils";

/**
 * Google Maps in an iframe — no API key needed for the embed `q=` form.
 * Lazy-loaded so it never blocks the page.
 */
export function MapEmbed({
  name,
  address,
  className,
}: {
  name: string;
  address: string;
  className?: string;
}) {
  const query = encodeURIComponent(`${name}, ${address}`);

  return (
    <iframe
      title={`Map showing ${name} at ${address}`}
      src={`https://maps.google.com/maps?q=${query}&z=16&output=embed`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={cn("min-w-0", className ?? "h-full min-h-[22rem] w-full grayscale-[0.35] contrast-[1.05]")}
    />
  );
}
