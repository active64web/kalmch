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
    const errorText = await response.text().catch(() => "");
    let errorMessage = `API Request failed with status ${response.status}`;
    let errors: Record<string, string[]> | undefined;

    if (errorText) {
      try {
        const errorData = JSON.parse(errorText);
        if (errorData && typeof errorData === "object") {
          if (errorData.message) errorMessage = errorData.message;
          if (errorData.errors && typeof errorData.errors === "object") {
            errors = errorData.errors;
            const messages = Object.values(errorData.errors)
              .flat()
              .filter((msg): msg is string => typeof msg === "string");
            if (messages.length > 0) {
              errorMessage = messages.join(" - ");
            }
          }
        }
      } catch {
        errorMessage = errorText;
      }
    }

    throw new ApiError(errorMessage, response.status, errors);
  }

  // Handle empty bodies (e.g. 204 No Content or empty 200 responses)
  const rawText = await response.text().catch(() => "");
  if (!rawText || !rawText.trim()) {
    return { success: true } as T;
  }

  try {
    return JSON.parse(rawText) as T;
  } catch {
    return { success: true, message: rawText } as unknown as T;
  }
}
