import type {
  RegisterData,
  RegisterResponse,
  LoginData,
  LoginResponse,
} from "../types/auth";

const API_URL = "https://v2.api.noroff.dev/auth";

export async function registerUser(
  userData: RegisterData,
): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorResponse = await response.json().catch(() => null);

    const errorMessage =
      errorResponse?.errors?.[0]?.message ||
      errorResponse?.message ||
      "Could not register user";

    throw new Error(errorMessage);
  }

  return response.json();
}

export async function loginUser(userData: LoginData): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorResponse = await response.json().catch(() => null);

    const errorMessage =
      errorResponse?.errors?.[0]?.message ||
      errorResponse?.message ||
      "Could not log in";

    throw new Error(errorMessage);
  }

  return response.json();
}

export async function getHolidazeProfile(
  name: string,
  accessToken: string,
): Promise<{ venueManager: boolean }> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE}/holidaze/profiles/${encodeURIComponent(name)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Could not retrieve user profile");
  }

  const result = await response.json();

  return {
    venueManager: result.data.venueManager,
  };
}
