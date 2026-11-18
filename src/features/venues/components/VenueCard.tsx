import { Link, useSearchParams } from "react-router";
import { Users } from "lucide-react";
import { VenueImage } from "./VenueImage";
import type { Venue } from "../types/venue.ts";
import { VenueRating } from "./VenueRating.tsx";

interface VenueCardProps {
  venue: Venue;
  from?: "home";
}

export function VenueCard({ venue, from }: VenueCardProps) {
  const [searchParams] = useSearchParams();
  const formattedPrice = new Intl.NumberFormat("en-NO", {
    maximumFractionDigits: 2,
  }).format(venue.price);
  return (
    <article className="group relative overflow-hidden rounded-lg border-[0.5px] border-card-border bg-card text-card-foreground shadow-sm shadow-shadow transition-shadow duration-200 hover:shadow-lg">
      <Link
        data-venue-id={venue.id}
        to={{
          pathname: `/venues/${venue.id}`,
          search: searchParams.toString(),
        }}
        state={from ? { from } : undefined}
        className="block rounded-lg focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-focus-ring"
      >
        <div className="relative">
          <VenueImage media={venue.media} name={venue.name} />
          {venue.rating > 0 && (
            <div className="absolute right-3 top-3 rounded-full bg-card px-3 py-1 text-card-foreground shadow-sm">
              <VenueRating rating={venue.rating} />
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="line-clamp-2 min-h-14 wrap-anywhere text-lg font-semibold">
            {venue.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {[venue.location?.city, venue.location?.country]
              .map((value) => value?.trim())
              .filter(Boolean)
              .join(", ") ||
              venue.location?.continent?.trim() ||
              "Location not available"}
          </p>

          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="text-base font-semibold text-card-foreground">
              NOK {formattedPrice}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                / night
              </span>
            </p>
            <p className="ml-auto inline-flex items-center gap-1 whitespace-nowrap text-sm text-muted-foreground">
              <Users size={16} aria-hidden="true" />
              <span>
                <span className="sr-only">Up to </span>
                {venue.maxGuests} {venue.maxGuests === 1 ? "guest" : "guests"}
              </span>
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
