import { useEffect, useRef } from "react";
import { X, Users, Wifi, CarFront, Coffee, PawPrint } from "lucide-react";
import { VenueGallery } from "./VenueGallery";
import { VenueDescription } from "./VenueDescription";
import type { VenueFormData } from "../schemas/venueSchema";

interface VenuePreviewDialogProps {
  data: VenueFormData;
  onClose: () => void;
}

export function VenuePreviewDialog({ data, onClose }: VenuePreviewDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();

    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  const images = data.media.filter((image) => image.url.startsWith("https://"));

  const location = [data.location.city, data.location.country]
    .filter(Boolean)
    .join(", ");

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="venue-preview-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-0 z-60 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto rounded-2xl border border-card-border bg-surface p-4 text-foreground shadow-xl backdrop:bg-black/60 sm:p-6"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 id="venue-preview-title">Venue preview</h2>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="cursor-pointer rounded-md p-2 text-foreground hover:bg-placeholder"
        >
          <X size={22} aria-hidden="true" />
        </button>
      </div>

      <h1 className="mb-4">{data.name || "Your venue name"}</h1>

      {images.length > 0 && (
        <VenueGallery media={images} name={data.name || "Venue preview"} />
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        {data.rating > 0 && <span>★ {data.rating} / 5</span>}

        {data.maxGuests > 0 && (
          <span className="flex items-center gap-2">
            <Users size={18} aria-hidden="true" />
            Up to {data.maxGuests} guests
          </span>
        )}
      </div>

      <div className="mt-6 space-y-8">
        <section>
          <h2 className="mb-3">About this place</h2>
          <VenueDescription description={data.description} />
        </section>

        <section>
          <h2 className="mb-3">Price per night</h2>
          <p>{data.price > 0 ? `${data.price} NOK` : "Not set"}</p>
        </section>

        <section>
          <h2 className="mb-4">What this place offers</h2>

          <ul className="grid grid-cols-2 gap-4">
            {data.meta.wifi && (
              <li className="flex items-center gap-2">
                <Wifi aria-hidden="true" /> Wi-Fi
              </li>
            )}
            {data.meta.parking && (
              <li className="flex items-center gap-2">
                <CarFront aria-hidden="true" /> Parking
              </li>
            )}
            {data.meta.breakfast && (
              <li className="flex items-center gap-2">
                <Coffee aria-hidden="true" /> Breakfast
              </li>
            )}
            {data.meta.pets && (
              <li className="flex items-center gap-2">
                <PawPrint aria-hidden="true" /> Pets allowed
              </li>
            )}
          </ul>
        </section>

        <section>
          <h2 className="mb-3">Where you'll be staying</h2>
          <p>{location || "Location not entered"}</p>
        </section>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="btn-primary btn-primary-compact"
        >
          Back to editing
        </button>
      </div>
    </dialog>
  );
}
