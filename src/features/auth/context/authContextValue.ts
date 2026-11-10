import { createContext } from "react";
import type { LoginResponse } from "../types/auth";

export type AuthUser = LoginResponse["data"];

export interface AuthContextValue {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
