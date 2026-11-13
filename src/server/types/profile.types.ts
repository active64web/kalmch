import type { User } from "./auth.types";

export interface UpdateProfilePayload {
  name: string;
  email: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ProfileApiResponse {
  success: boolean;
  message?: string;
  user?: User;
  data?: User | { user?: User };
}

export interface ProfileActionResult {
  success: boolean;
  message?: string;
  error?: string;
  user?: User;
  errors?: Record<string, string[]>;
}

