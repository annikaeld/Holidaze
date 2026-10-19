import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import { useRef, useState } from "react";

import type { VenueMedia } from "../types/venue";

interface VenueGalleryProps {
  media: VenueMedia[];
  name: string;
}

export function VenueGallery({ media, name }: VenueGalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <div className="md:hidden">
        <Swiper
          className="venue-gallery"
          modules={[Navigation, Pagination]}
          navigation={media.length > 1}
          pagination={media.length > 1 ? { type: "fraction" } : false}
        >
          {media.map((image, index) => (
            <SwiperSlide key={`${image.url}-${index}`}>
              <GalleryImage image={image} name={name} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="relative hidden md:block">
        <div className="grid aspect-16/9 grid-cols-[2fr_1fr] gap-2">
          <div>{media[0] && <GalleryImage image={media[0]} name={name} />}</div>

          <div className="grid grid-rows-2 gap-2">
            {media.slice(1, 3).map((image, index) => (
              <GalleryImage
                key={`${image.url}-${index}`}
                image={image}
                name={name}
              />
            ))}
          </div>
        </div>

        {media.length > 3 && (
          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            className="btn-gallery-open"
          >
            Vis alle bilder ({media.length})
          </button>
        )}
      </div>
      <dialog ref={dialogRef} className="venue-gallery-dialog">
        <button
          type="button"
          className="btn-gallery-close"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close gallery"
        >
          ✕
        </button>

        <Swiper
          className="venue-gallery"
          modules={[Navigation, Pagination]}
          navigation={media.length > 1}
          pagination={media.length > 1 ? { type: "fraction" } : false}
        >
          {media.map((image, index) => (
            <SwiperSlide key={`${image.url}-${index}`}>
              <GalleryImage image={image} name={name} />
            </SwiperSlide>
          ))}
        </Swiper>
      </dialog>
    </>
  );
}

function GalleryImage({ image, name }: { image: VenueMedia; name: string }) {
  const [imageError, setImageError] = useState(false);

  if (!image.url || imageError) {
    return (
      <div className="flex aspect-4/3 w-full items-center justify-center bg-placeholder text-placeholder-foreground md:aspect-auto md:h-full">
        No image available
      </div>
    );
  }

  return (
    <img
      src={image.url}
      alt={image.alt || name}
      className="aspect-4/3 w-full object-cover md:aspect-auto md:h-full"
      onError={() => setImageError(true)}
    />
  );
}
