import { Link } from "react-router";

import { VenueImage } from "./VenueImage";
import type { Venue } from "../types/venue.ts";
import { VenueRating } from "./VenueRating.tsx";

interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-shadow duration-200 hover:shadow-lg">
      <Link to={`/venues/${venue.id}`}>
        <div className="relative">
          <VenueImage media={venue.media} name={venue.name} />
          {venue.rating > 0 && (
            <div className="absolute right-3 top-3 rounded-full bg-card px-3 py-1 text-card-foreground shadow-sm">
              <VenueRating rating={venue.rating} />
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="wrap-break-words text-lg font-semibold">
            {venue.name}
          </h2>
        </div>
      </Link>
    </article>
  );
}
