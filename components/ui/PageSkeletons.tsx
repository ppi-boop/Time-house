import { Skeleton, ProductCardSkeleton } from "@/components/ui/Skeleton";

/** Shared shape for the two listing routes, so navigation paints immediately. */
export function ListingSkeleton({ withBanner = false }: { withBanner?: boolean }) {
  return (
    <>
      {withBanner && <Skeleton className="h-56 w-full lg:h-72" />}

      <div className="container-luxe py-10 lg:py-14">
        {!withBanner && (
          <div className="mb-10 max-w-2xl space-y-4">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-11 w-full max-w-md" />
            <Skeleton className="h-4 w-full max-w-lg" />
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
          <div className="hidden space-y-8 lg:block">
            {[5, 3, 6, 4].map((rows, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-3 w-20" />
                {Array.from({ length: rows }).map((_, r) => (
                  <Skeleton key={r} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </div>

          <div>
            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1 rounded-full" />
              <Skeleton className="h-12 w-40 rounded-full" />
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-9 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ProductSkeleton() {
  return (
    <div className="container-luxe py-8 lg:py-12">
      <Skeleton className="h-3 w-64" />
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="aspect-4/5 w-full rounded-[var(--radius-lg)]" />
        <div className="space-y-5 lg:py-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-12 w-full max-w-md" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <div className="space-y-3 pt-6">
            <Skeleton className="h-14 w-full rounded-full" />
            <Skeleton className="h-14 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
