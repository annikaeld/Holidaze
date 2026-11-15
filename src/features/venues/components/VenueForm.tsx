import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { venueSchema, type VenueFormData } from "../schemas/venueSchema";
import { useState } from "react";
import { Star, X } from "lucide-react";
import { VenueImagePreview } from "./VenueImagePreview";
import { VenuePreviewDialog } from "./VenuePreviewDialog";

interface VenueFormProps {
  onSubmit: (data: VenueFormData) => void;
  isPending: boolean;
  initialValues?: VenueFormData;
  submitLabel?: string;
}

export function VenueForm({
  onSubmit,
  isPending,
  initialValues,
  submitLabel = "Create venue",
}: VenueFormProps) {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: initialValues ?? {
      name: "",
      description: "",
      price: undefined,
      maxGuests: undefined,
      rating: 0,
      media: [{ url: "", alt: "" }],
      meta: {
        wifi: false,
        parking: false,
        breakfast: false,
        pets: false,
      },
      location: {
        country: "",
        city: "",
        address: "",
      },
    },
  });

  const rating = useWatch({
    control,
    name: "rating",
  });
  const [images, setImages] = useState(() =>
    (initialValues?.media?.length
      ? initialValues.media
      : [{ url: "", alt: "" }]
    ).map((image, index) => ({
      id: index,
      ...image,
    })),
  );

  const [nextImageId, setNextImageId] = useState(images.length);
  const [previewData, setPreviewData] = useState<VenueFormData | null>(null);

  function updateImages(updatedImages: typeof images) {
    setImages(updatedImages);

    setValue(
      "media",
      updatedImages.map(({ url, alt }) => ({ url, alt })),
      { shouldDirty: true },
    );
  }

  function addImage() {
    updateImages([...images, { id: nextImageId, url: "", alt: "" }]);
    setNextImageId((current) => current + 1);
  }

  function removeImage(id: number) {
    updateImages(images.filter((image) => image.id !== id));
  }

  function updateImage(id: number, field: "url" | "alt", value: string) {
    updateImages(
      images.map((image) =>
        image.id === id ? { ...image, [field]: value } : image,
      ),
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <h2>Tell us about your place</h2>

      <div>
        <label htmlFor="venue-name">Venue name</label>
        <input
          id="venue-name"
          type="text"
          {...register("name")}
          aria-invalid={Boolean(errors.name)}
          className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
        {errors.name && (
          <p role="alert" className="mt-1 text-sm text-error">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="venue-description">Description</label>
        <textarea
          id="venue-description"
          rows={5}
          {...register("description")}
          aria-invalid={Boolean(errors.description)}
          className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
        {errors.description && (
          <p role="alert" className="mt-1 text-sm text-error">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium" id="venue-rating-label">
          Venue rating
        </label>

        <div
          className="mt-2 flex items-center gap-2"
          role="group"
          aria-labelledby="venue-rating-label"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setValue("rating", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
              aria-pressed={rating === value}
              className="cursor-pointer rounded-md p-1 text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              <Star
                size={28}
                fill={value <= rating ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </button>
          ))}

          <span className="ml-2 text-sm text-muted-foreground">
            {rating === 0 ? "Select rating" : `${rating} / 5`}
          </span>
        </div>

        {errors.rating && (
          <p role="alert" className="mt-1 text-sm text-error">
            {errors.rating.message}
          </p>
        )}
      </div>

      <div className="space-y-4 border-t border-border pt-6">
        <h2>Price and capacity</h2>

        <div>
          <label htmlFor="venue-price">Price per night</label>
          <input
            id="venue-price"
            type="number"
            min="1"
            {...register("price", { valueAsNumber: true })}
            aria-invalid={Boolean(errors.price)}
            className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />
          {errors.price && (
            <p role="alert" className="mt-1 text-sm text-error">
              {errors.price.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="venue-guests">Maximum guests</label>
          <input
            id="venue-guests"
            type="number"
            min="1"
            step="1"
            placeholder="Number of guests"
            {...register("maxGuests", { valueAsNumber: true })}
            aria-invalid={Boolean(errors.maxGuests)}
            className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />
          {errors.maxGuests && (
            <p role="alert" className="mt-1 text-sm text-error">
              {errors.maxGuests.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 border-t border-border pt-6">
        <h2>Amenities</h2>

        <p className="text-sm text-muted-foreground">
          What does your place offer?
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              {...register("meta.wifi")}
              className="size-4 accent-primary"
            />
            Wi-Fi
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              {...register("meta.parking")}
              className="size-4 accent-primary"
            />
            Parking
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              {...register("meta.breakfast")}
              className="size-4 accent-primary"
            />
            Breakfast
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              {...register("meta.pets")}
              className="size-4 accent-primary"
            />
            Pets allowed
          </label>
        </div>
      </div>

      <div className="space-y-4 border-t border-border pt-6">
        <h2>Where is your place?</h2>

        <div>
          <label htmlFor="venue-country">Country</label>
          <input
            id="venue-country"
            type="text"
            {...register("location.country")}
            aria-invalid={Boolean(errors.location?.country)}
            className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />
          {errors.location?.country && (
            <p role="alert" className="mt-1 text-sm text-error">
              {errors.location.country.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="venue-city">City or area (optional)</label>
          <input
            id="venue-city"
            type="text"
            {...register("location.city")}
            className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the nearest town, village or region, if applicable.
          </p>
        </div>

        <div>
          <label htmlFor="venue-address">Street address (optional)</label>
          <input
            id="venue-address"
            type="text"
            {...register("location.address")}
            className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />
        </div>
      </div>

      <div className="space-y-4 border-t border-border pt-6">
        <h2>Photos</h2>

        <p className="text-sm text-muted-foreground">
          Add image URLs and describe each image.
        </p>

        {images.map((image, index) => (
          <div
            key={image.id}
            className="space-y-3 rounded-lg border border-card-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <h3>Image {index + 1}</h3>

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="cursor-pointer text-sm text-error"
                >
                  Remove
                </button>
              )}
            </div>

            <div>
              <label htmlFor={`image-url-${image.id}`}>Image URL</label>

              <div className="relative mt-2">
                <input
                  id={`image-url-${image.id}`}
                  type="url"
                  value={image.url}
                  onBlur={() => void trigger(`media.${index}.url`)}
                  onChange={(event) =>
                    updateImage(image.id, "url", event.target.value)
                  }
                  placeholder="https://example.com/image.jpg"
                  aria-invalid={Boolean(errors.media?.[index]?.url)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 pr-11 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                />

                {image.url && (
                  <button
                    type="button"
                    onClick={() => updateImage(image.id, "url", "")}
                    aria-label={`Clear image ${index + 1} URL`}
                    className="absolute inset-y-0 right-2 flex w-9 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                )}
              </div>

              {errors.media?.[index]?.url && (
                <p role="alert" className="mt-1 text-sm text-error">
                  {errors.media[index]?.url?.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={`image-alt-${image.id}`}>Alt text</label>
              <input
                id={`image-alt-${image.id}`}
                type="text"
                value={image.alt}
                onBlur={() => void trigger(`media.${index}.alt`)}
                onChange={(event) =>
                  updateImage(image.id, "alt", event.target.value)
                }
                placeholder="Describe the image"
                aria-invalid={Boolean(errors.media?.[index]?.alt)}
                className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              />

              {errors.media?.[index]?.alt && (
                <p role="alert" className="mt-1 text-sm text-error">
                  {errors.media[index]?.alt?.message}
                </p>
              )}
            </div>
            <VenueImagePreview
              url={image.url}
              hasValidationError={Boolean(errors.media?.[index]?.url)}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addImage}
          className="cursor-pointer font-medium text-primary hover:underline"
        >
          + Add another image
        </button>

        {errors.media?.root && (
          <p role="alert" className="text-sm text-error">
            {errors.media.root.message}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setPreviewData(getValues())}
          className="cursor-pointer rounded-full border border-border px-6 py-3 font-medium hover:bg-field-active"
        >
          Preview venue
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary btn-primary-compact"
        >
          {isPending ? "Saving..." : submitLabel}
        </button>
      </div>
      {previewData && (
        <VenuePreviewDialog
          data={previewData}
          onClose={() => setPreviewData(null)}
        />
      )}
    </form>
  );
}
