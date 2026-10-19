import { useState } from "react";
import type { VenueMedia } from "../types/venue";
import { getOptimizedImageUrl } from "../utils/getOptimizedImageUrl";

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
      src={getOptimizedImageUrl(image.url)}
      alt={image.alt || name}
      loading="lazy"
      decoding="async"
      onError={() => setImageError(true)}
    />
  ) : (
    <div className="flex aspect-4/3 items-center justify-center bg-placeholder text-placeholder-foreground">
      No image available
    </div>
  );
}
