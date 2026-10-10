import { useState } from "react";
import type { VenueMedia } from "../types/venue";

interface VenueImageProps {
  media: VenueMedia[];
  name: string;
}

export function VenueImage({ media, name }: VenueImageProps) {
  const [imageError, setImageError] = useState(false);
  const image = media?.[0];
  return image?.url && !imageError ? (
    <img
      className="aspect-4/3 w-full object-cover"
      src={image.url}
      alt={image.alt || name}
      onError={() => setImageError(true)}
    />
  ) : (
    <div className="flex aspect-4/3 items-center justify-center bg-gray-100 text-gray-500">
      No image available
    </div>
  );
}
