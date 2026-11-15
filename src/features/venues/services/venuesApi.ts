import type { ApiResponse, Venue } from "../types/venue";
import type { VenueFormData } from "../schemas/venueSchema";

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

export async function createVenue(
  data: VenueFormData,
  accessToken: string,
): Promise<Venue> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorResponse = await response.json().catch(() => null);

    throw new Error(
      errorResponse?.errors?.[0]?.message ||
        "Could not create venue. Please try again.",
    );
  }

  const result: ApiResponse<Venue> = await response.json();

  return result.data;
}

export async function getManagedVenues(
  name: string,
  accessToken: string,
): Promise<Venue[]> {
  const url = `https://v2.api.noroff.dev/holidaze/profiles/${encodeURIComponent(name)}/venues`;

  async function getPage(page: number): Promise<ApiResponse<Venue[]>> {
    const response = await fetch(`${url}?page=${page}&_bookings=true`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Could not load your venues.");
    }

    return response.json();
  }

  const firstPage = await getPage(1);
  const pageCount = firstPage.meta.pageCount;

  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) => getPage(index + 2)),
  );

  return [
    ...firstPage.data,
    ...remainingPages.flatMap((result) => result.data),
  ];
}

export async function updateVenue(
  id: string,
  data: VenueFormData,
  accessToken: string,
): Promise<Venue> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorResponse = await response.json().catch(() => null);

    throw new Error(
      errorResponse?.errors?.[0]?.message ||
        "Could not update venue. Please try again.",
    );
  }

  const result: ApiResponse<Venue> = await response.json();

  return result.data;
}

export async function deleteVenue(
  id: string,
  accessToken: string,
): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
    },
  });

  if (!response.ok) {
    const errorResponse = await response.json().catch(() => null);

    throw new Error(
      errorResponse?.errors?.[0]?.message ||
        "Could not delete venue. Please try again.",
    );
  }
}
