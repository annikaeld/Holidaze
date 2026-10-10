import { Star } from "lucide-react";

export function VenueRating({ rating }: { rating: number }) {
  return (
    <div
      role="img"
      className="flex items-center gap-1"
      aria-label={`Rating: ${rating.toFixed(1)} out of 5`}
    >
      <Star aria-hidden="true" className="h-4 w-4 fill-current" />
      <span>{rating.toFixed(1)}</span>
    </div>
  );
}
