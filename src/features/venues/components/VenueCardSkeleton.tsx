export function VenueCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-lg border-[0.5px] border-card-border bg-card shadow-sm"
    >
      <div className="aspect-4/3 w-full animate-pulse bg-placeholder" />

      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-placeholder" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-placeholder" />

        <div className="pt-2">
          <div className="h-5 w-1/3 animate-pulse rounded bg-placeholder" />
        </div>
      </div>
    </div>
  );
}
