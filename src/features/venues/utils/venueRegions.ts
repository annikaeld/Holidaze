import { byCountry, byIso } from "country-code-lookup";

export const regions = [
  { value: "nordic", label: "Nordic countries" },
  { value: "europe", label: "Europe" },
  { value: "asia", label: "Asia" },
  { value: "americas", label: "Americas" },
  { value: "africa", label: "Africa" },
  { value: "oceania", label: "Oceania" },
  { value: "other", label: "Other" },
] as const;

export type VenueRegion = (typeof regions)[number]["value"];

const nordicCountries = new Set([
  "norway",
  "sweden",
  "denmark",
  "finland",
  "iceland",
]);

export function isNordicCountry(country: string | null): boolean {
  return nordicCountries.has(country?.trim().toLowerCase() ?? "");
}

export function getContinentRegion(
  continent: string | null,
): VenueRegion | null {
  const value = continent?.trim().toLowerCase();

  switch (value) {
    case "europe":
      return "europe";

    case "asia":
      return "asia";

    case "africa":
      return "africa";

    case "north america":
    case "south america":
    case "central america":
    case "america":
    case "americas":
      return "americas";

    case "oceania":
    case "australia":
      return "oceania";

    default:
      return null;
  }
}

export function getCountryRegion(country: string | null): VenueRegion | null {
  if (!country?.trim()) return null;

  const value = country.trim();

  const match =
    byCountry(value) ?? (/^[a-z]{2,3}$/i.test(value) ? byIso(value) : null);

  if (!match) return null;

  return getContinentRegion(match.continent);
}

export function getVenueRegion(
  country: string | null,
  continent: string | null,
): VenueRegion {
  return getCountryRegion(country) ?? getContinentRegion(continent) ?? "other";
}
