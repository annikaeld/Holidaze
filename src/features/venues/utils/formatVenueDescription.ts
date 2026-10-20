export function formatVenueDescription(description: string): string {
  const textarea = document.createElement("textarea");

  const cleanedDescription = description
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  textarea.innerHTML = cleanedDescription;

  return textarea.value;
}
