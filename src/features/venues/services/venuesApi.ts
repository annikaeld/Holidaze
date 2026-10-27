import type { ApiResponse, Venue } from "../types/venue";

const API_URL = "https://v2.api.noroff.dev/holidaze/venues";

export async function getVenues(page = 1): Promise<ApiResponse<Venue[]>> {
  const response = await fetch(`${API_URL}?page=${page}&_bookings=true`);

  if (!response.ok) {
    throw new Error("Could not fetch Venues");
  }

  const result: ApiResponse<Venue[]> = await response.json();

  return result;
}

export async function searchVenues(
  query: string,
  page = 1,
): Promise<ApiResponse<Venue[]>> {
  const response = await fetch(
    `${API_URL}/search?q=${encodeURIComponent(query)}&page=${page}&_bookings=true`,
  );

  if (!response.ok) {
    throw new Error("Could not search venues");
  }

  const result: ApiResponse<Venue[]> = await response.json();

  return result;
}

export async function getVenue(id: string): Promise<Venue> {
  const response = await fetch(`${API_URL}/${id}?_owner=true&_bookings=true`);

  if (response.status === 400) {
    throw new Error("Invalid venue ID");
  }
  if (response.status === 404) {
    throw new Error("Venue not found");
  }

  if (!response.ok) {
    throw new Error("Could not fetch venue");
  }

  const result: ApiResponse<Venue> = await response.json();

  return result.data;
}

export async function getAllVenues(query = ""): Promise<Venue[]> {
  const firstPage = query ? await searchVenues(query, 1) : await getVenues(1);

  const pageCount = firstPage.meta.pageCount;

  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      query ? searchVenues(query, index + 2) : getVenues(index + 2),
    ),
  );

  return [
    ...firstPage.data,
    ...remainingPages.flatMap((response) => response.data),
  ];
}
