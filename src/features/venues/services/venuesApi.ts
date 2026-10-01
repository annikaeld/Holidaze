import type { ApiResponse, Venue } from "../types/venue";

const API_URL = "https://v2.api.noroff.dev/holidaze/venues";

export async function getVenues(): Promise<ApiResponse<Venue[]>> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Could not fetch Venues");
  }

  const result: ApiResponse<Venue[]> = await response.json();

  return result;
}

export async function getVenue(id: string): Promise<Venue> {
  const response = await fetch(`${API_URL}/${id}`);

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
