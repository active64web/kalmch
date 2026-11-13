/**
 * Base API client helper for external services and server-side calls.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ch-library.eladrabarakelkhyam.com";

export interface ApiClientOptions extends RequestInit {
  token?: string;
}

export class ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  if (options.token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${options.token}`;
  }

  const restOptions = { ...options };
  delete restOptions.token;

  const response = await fetch(url, {
    ...restOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage =
      errorData.message || `API Request failed with status ${response.status}`;

    // Extract detailed validation errors if available (Laravel format)
    if (errorData.errors && typeof errorData.errors === "object") {
      const messages = Object.values(errorData.errors)
        .flat()
        .filter((msg): msg is string => typeof msg === "string");
      if (messages.length > 0) {
        errorMessage = messages.join(" - ");
      }
    }

    throw new ApiError(errorMessage, response.status, errorData.errors);
  }

  return response.json();
}
