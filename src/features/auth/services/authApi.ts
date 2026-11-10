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
