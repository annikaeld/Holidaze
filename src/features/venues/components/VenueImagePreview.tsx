import { useState } from "react";
import { ImageOff } from "lucide-react";

interface VenueImagePreviewProps {
  url: string;
  hasValidationError: boolean;
}

export function VenueImagePreview({
  url,
  hasValidationError,
}: VenueImagePreviewProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (!url.startsWith("https://")) return null;

  const hasError = failedUrl === url;

  return (
    <div className="mt-4">
      <div className="flex aspect-4/3 w-full max-w-sm items-center justify-center overflow-hidden rounded-lg border border-border bg-placeholder">
        {hasError ? (
          <ImageOff
            size={32}
            className="text-placeholder-foreground"
            aria-hidden="true"
          />
        ) : (
          <img
            key={url}
            src={url}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setFailedUrl(url)}
          />
        )}
      </div>

      {hasError && !hasValidationError && (
        <p role="alert" className="mt-2 text-sm text-error">
          Unable to preview this image.
        </p>
      )}
    </div>
  );
}
