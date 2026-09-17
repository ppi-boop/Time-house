import { getSearchIndex } from "@/lib/navigation";

/**
 * The search index is ~40KB of product text. Serving it here instead of
 * embedding it in the layout keeps it out of every page's payload — the palette
 * fetches it once, the first time someone opens it.
 */
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const index = await getSearchIndex();

  return Response.json(index, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
