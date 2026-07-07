import { Skeleton } from "@/components/ui/skeleton";

export function ConcertCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-5">
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="mb-4 h-4 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div>
            <Skeleton className="mb-1 h-3 w-16" />
            <Skeleton className="h-6 w-12" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedConcertsSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Skeleton className="mb-2 h-10 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ConcertCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export function CategoryGridSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <Skeleton className="mx-auto mb-4 h-10 w-64" />
        <Skeleton className="mx-auto h-5 w-48" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6"
          >
            <Skeleton className="mb-3 h-12 w-12 rounded-full" />
            <Skeleton className="mb-1 h-5 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function SearchSkeleton() {
  return (
    <div className="relative z-10 mx-auto -mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-xl sm:p-6">
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="mb-1.5 h-4 w-16" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
          <div className="flex flex-col justify-end">
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
