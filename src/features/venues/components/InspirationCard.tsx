import { Link } from "react-router";

import { VenueImage } from "./VenueImage";
import type { Venue } from "../types/venue.ts";
import { VenueRating } from "./VenueRating.tsx";

interface InspirationCardProps {
  venue: Venue;
}

export function InspirationCard({ venue }: InspirationCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow duration-200 hover:shadow-lg">
      <Link to={`/venues/${venue.id}`}>
        <div className="relative">
          <VenueImage media={venue.media} name={venue.name} />
          {venue.rating > 0 && (
            <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-gray-900 shadow-sm">
              <VenueRating rating={venue.rating} />
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="wrap-break-words text-lg font-semibold">
            {venue.name}
          </h2>
          <p className="text-sm text-gray-600">
            {venue.location?.city}, {venue.location?.country}
          </p>
        </div>
      </Link>
    </article>
  );
}
