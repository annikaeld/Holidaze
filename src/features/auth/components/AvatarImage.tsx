import { useState } from "react";
import { UserRound } from "lucide-react";

interface AvatarImageProps {
  url?: string;
  alt?: string;
  size?: "sm" | "lg";
}

export function AvatarImage({ url, alt = "", size = "sm" }: AvatarImageProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const imageFailed = Boolean(url && failedUrl === url);

  const sizeClass = size === "lg" ? "h-24 w-24" : "h-8 w-8";

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-placeholder ${sizeClass}`}
    >
      {url && !imageFailed ? (
        <img
          src={url}
          alt={alt}
          onError={() => setFailedUrl(url)}
          className="h-full w-full object-cover"
        />
      ) : (
        <UserRound
          size={size === "lg" ? 40 : 20}
          className="text-placeholder-foreground"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
