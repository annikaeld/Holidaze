import { useEffect, useRef, useState } from "react";
import { formatVenueDescription } from "../utils/formatVenueDescription";

interface VenueDescriptionProps {
  description: string;
}

export function VenueDescription({ description }: VenueDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const formattedDescription = formatVenueDescription(description);

  useEffect(() => {
    const element = descriptionRef.current;
    if (!element) return;

    const checkTruncation = () => {
      if (isExpanded) return;

      setIsTruncated(element.scrollHeight > element.clientHeight + 1);
    };

    const observer = new ResizeObserver(checkTruncation);

    observer.observe(element);
    checkTruncation();

    return () => observer.disconnect();
  }, [formattedDescription, isExpanded]);

  return (
    <div>
      <p
        ref={descriptionRef}
        className={`whitespace-pre-line ${isExpanded ? "" : "line-clamp-6"}`}
      >
        {formattedDescription}
      </p>
      {isTruncated && (
        <button
          type="button"
          className="btn-description-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
