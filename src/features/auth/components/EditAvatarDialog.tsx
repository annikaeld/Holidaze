import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageOff, X } from "lucide-react";
import {
  avatarSchema,
  type AvatarFormData,
} from "@/features/auth/schemas/avatarSchema";

interface EditAvatarDialogProps {
  currentAvatar?: {
    url: string;
    alt?: string;
  } | null;
  onClose: () => void;
  onSave: (data: AvatarFormData) => Promise<void>;
  isPending: boolean;
}

export function EditAvatarDialog({
  currentAvatar,
  onClose,
  onSave,
  isPending,
}: EditAvatarDialogProps) {
  const [imageError, setImageError] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    dialog.showModal();

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, []);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<AvatarFormData>({
    resolver: zodResolver(avatarSchema),
    mode: "onChange",
    defaultValues: {
      url: currentAvatar?.url ?? "",
      alt: currentAvatar?.alt ?? "",
    },
  });

  const avatarUrl = useWatch({
    control,
    name: "url",
  });

  async function onSubmit(data: AvatarFormData) {
    await onSave(data);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="edit-avatar-title"
      onCancel={(event) => {
        if (isPending) {
          event.preventDefault();
          return;
        }

        event.preventDefault();
        onClose();
      }}
      className="fixed inset-0 z-60 m-auto w-[calc(100%-2rem)] max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl border border-card-border bg-card p-6 text-card-foreground shadow-xl backdrop:bg-black/60"
    >
      <h2 id="edit-avatar-title">Change avatar</h2>

      <div className="mt-6 flex justify-center">
        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-border bg-placeholder">
          {avatarUrl && !imageError ? (
            <img
              key={avatarUrl}
              src={avatarUrl}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
          ) : (
            <ImageOff
              size={32}
              className="text-placeholder-foreground"
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-4"
        noValidate
      >
        <div>
          <label htmlFor="avatar-url" className="font-semibold">
            Avatar image URL
          </label>

          <div className="relative mt-2">
            <input
              id="avatar-url"
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register("url", {
                onChange: () => setImageError(false),
              })}
              aria-invalid={Boolean(errors.url)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 pr-11 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            />

            {avatarUrl && (
              <button
                type="button"
                onClick={() => {
                  setValue("url", "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setImageError(false);
                }}
                aria-label="Clear avatar URL"
                className="absolute inset-y-0 right-2 flex w-9 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X size={18} aria-hidden="true" />
              </button>
            )}
          </div>

          {errors.url && (
            <p role="alert" className="mt-1 text-sm text-error">
              {errors.url.message}
            </p>
          )}

          {avatarUrl && imageError && !errors.url && (
            <p role="alert" className="mt-1 text-sm text-error">
              Unable to preview this image.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="avatar-alt" className="font-semibold">
            Alt text
          </label>

          <input
            id="avatar-alt"
            type="text"
            placeholder="Describe your avatar"
            {...register("alt")}
            aria-invalid={Boolean(errors.alt)}
            className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />

          {errors.alt && (
            <p role="alert" className="mt-1 text-sm text-error">
              {errors.alt.message}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="w-full cursor-pointer rounded-full border border-border px-4 py-2 font-medium hover:bg-field-active disabled:cursor-not-allowed sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending || imageError}
            className="btn-primary w-full sm:w-auto"
          >
            {isPending ? "Saving..." : "Save avatar"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
