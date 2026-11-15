import { useState, type ReactNode } from "react";

interface OverviewCardProps {
  title: string;
  image?: {
    url: string;
    alt?: string;
  } | null;
  children: ReactNode;
  actions: ReactNode;
}

export function OverviewCard({
  title,
  image,
  children,
  actions,
}: OverviewCardProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const showImage = image?.url && failedUrl !== image.url;
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-card-border bg-card sm:flex-row">
      {showImage ? (
        <img
          src={image.url}
          alt={image.alt || title}
          onError={() => setFailedUrl(image.url)}
          className="aspect-video w-full object-cover sm:aspect-square sm:w-44 sm:shrink-0"
          loading="lazy"
        />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-placeholder text-placeholder-foreground sm:aspect-square sm:w-44 sm:shrink-0">
          <span className="text-sm">No image available</span>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-5">
        <div>
          <h2 className="text-xl font-semibold wrap-anywhere">{title}</h2>

          <div className="mt-3 space-y-2">{children}</div>
        </div>

        <div className="flex items-center justify-between gap-4">{actions}</div>
      </div>
    </article>
  );
}
