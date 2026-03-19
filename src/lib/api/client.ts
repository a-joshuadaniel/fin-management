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

  // Google Apps Script Web Apps redirect POST requests (302).
  // To avoid CORS preflight issues, we send the payload as a URL parameter
  // via GET request, which Apps Script handles via doGet().
  // For larger payloads we use POST with text/plain (no preflight).
  const payload = JSON.stringify({ action, ...data });

  try {
    // Try POST first (works for most deployed scripts)
    const response = await fetch(url, {
      method: "POST",
      body: payload,
      redirect: "follow",
    });

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      throw new ApiError("Invalid response from API: " + text.slice(0, 200));
    }

    if (result.error) {
      throw new ApiError(result.error);
    }

    return result.data as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;

    // If POST fails due to CORS/redirect, fall back to GET with payload in URL
    const encoded = encodeURIComponent(payload);
    const getUrl = `${url}?payload=${encoded}`;

    const response = await fetch(getUrl, {
      method: "GET",
      redirect: "follow",
    });

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      throw new ApiError("Invalid response from API: " + text.slice(0, 200));
    }

    if (result.error) {
      throw new ApiError(result.error);
    }

    return result.data as T;
  }
}
