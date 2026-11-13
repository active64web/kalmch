import { apiClient, ApiError } from "../config/api-client";
import type { ApiMessageResponse, User } from "../types/auth.types";
import type {
  ChangePasswordPayload,
  ProfileApiResponse,
  UpdateProfilePayload,
} from "../types/profile.types";

async function sendProfileMutation<T>(
  endpoint: string,
  token: string,
  body: Record<string, unknown>
): Promise<T> {
  const methods = ["PUT", "PATCH", "POST"] as const;
  let lastError: unknown;

  for (const method of methods) {
    try {
      return await apiClient<T>(endpoint, {
        method,
        token,
        body: JSON.stringify(body),
      });
    } catch (err) {
      lastError = err;
      if (err instanceof ApiError && err.statusCode === 405) {
        continue;
      }
      throw err;
    }
  }

  throw lastError;
}

export function extractUserFromProfileResponse(
  response: ProfileApiResponse
): User | undefined {
  if (response.user && typeof response.user === "object") {
    return response.user;
  }

  if (response.data && typeof response.data === "object") {
    if ("user" in response.data && response.data.user) {
      return response.data.user;
    }
    if ("email" in response.data && "name" in response.data) {
      return response.data as User;
    }
  }

  return undefined;
}

export const profileService = {
  /**
   * Fetch authenticated user profile
   * Endpoint: GET /api/profile
   */
  async getProfile(token: string): Promise<ProfileApiResponse> {
    return apiClient<ProfileApiResponse>("/api/profile", {
      method: "GET",
      token,
      cache: "no-store",
    });
  },

  /**
   * Update authenticated user profile (name, email)
   * Endpoint: PUT/PATCH/POST /api/profile
   */
  async updateProfile(
    token: string,
    payload: UpdateProfilePayload
  ): Promise<ProfileApiResponse> {
    return sendProfileMutation<ProfileApiResponse>("/api/profile", token, {
      name: payload.name.trim(),
      email: payload.email.trim(),
    });
  },

  /**
   * Change authenticated user password
   * Endpoint: PUT/PATCH/POST /api/profile/password
   */
  async changePassword(
    token: string,
    payload: ChangePasswordPayload
  ): Promise<ApiMessageResponse> {
    return sendProfileMutation<ApiMessageResponse>(
      "/api/profile/password",
      token,
      {
        current_password: payload.current_password,
        password: payload.password,
        password_confirmation: payload.password_confirmation,
      }
    );
  },
};

