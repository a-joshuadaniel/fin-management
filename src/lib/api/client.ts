const API_URL_KEY = "fin-manager-api-url";

export function getApiUrl(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(API_URL_KEY);
}

export function setApiUrl(url: string): void {
  localStorage.setItem(API_URL_KEY, url);
}

export function clearApiUrl(): void {
  localStorage.removeItem(API_URL_KEY);
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  action: string,
  data?: Record<string, unknown>
): Promise<T> {
  const url = getApiUrl();
  if (!url) {
    throw new ApiError("API URL not configured. Go to Settings to set it up.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ action, ...data }),
  });

  if (!response.ok) {
    throw new ApiError(`API request failed: ${response.statusText}`, response.status);
  }

  const result = await response.json();

  if (result.error) {
    throw new ApiError(result.error);
  }

  return result.data as T;
}
