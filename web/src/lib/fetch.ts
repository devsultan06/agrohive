import { API_URL, ADMIN_TOKEN_KEY } from "../config";
import type {
  ApiResponse,
  BackendErrorResponse,
  CustomError,
} from "../types/api";

const buildUrl = (
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>,
) => {
  // 1. Clean endpoint for concatenation
  let cleanEndpoint = endpoint.startsWith("/")
    ? endpoint.substring(1)
    : endpoint;

  // 2. SMART FIX: Deduplicate manual API prefixes
  // If base already has /api/v1 and endpoint starts with it, pull it out of the endpoint
  if (API_URL.includes("/api/v1") && cleanEndpoint.startsWith("api/v1/")) {
    cleanEndpoint = cleanEndpoint.replace("api/v1/", "");
  }

  const path = endpoint.startsWith("http")
    ? endpoint
    : `${API_URL}${API_URL.endsWith("/") ? "" : "/"}${cleanEndpoint}`;
  const url = new URL(path);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
};

interface RequestOptions<B = unknown> {
  body?: B;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

const request = async <T, B = unknown>(
  method: string,
  endpoint: string,
  options?: RequestOptions<B>,
): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  const url = buildUrl(endpoint, options?.params);

  const isFormData = options?.body instanceof FormData;

  const config: RequestInit = {
    method,
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
    body: (isFormData
      ? options.body
      : options?.body
        ? JSON.stringify(options.body)
        : undefined) as any,
  };

  let response: Response;

  try {
    response = await fetch(url, config);

    // Handle Token Refresh (401 Unauthorized)
    if (
      response.status === 401 &&
      !endpoint.includes("/auth/admin/login") &&
      !endpoint.includes("/auth/refresh")
    ) {
      const refreshToken = localStorage.getItem("agrohive_admin_refresh_token");

      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken}`,
            },
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const newTokens = refreshData.data || refreshData;

            if (newTokens.access_token) {
              localStorage.setItem(ADMIN_TOKEN_KEY, newTokens.access_token);
              if (newTokens.refresh_token) {
                localStorage.setItem(
                  "agrohive_admin_refresh_token",
                  newTokens.refresh_token,
                );
              }

              // Retry the original request with new token
              config.headers = {
                ...config.headers,
                Authorization: `Bearer ${newTokens.access_token}`,
              };
              response = await fetch(url, config);
            }
          }
        } catch (refreshErr) {
          console.error("Token refresh failed:", refreshErr);
        }
      }
    }
  } catch (err) {
    const error = new Error(
      "Network error. Please check your connection and try again.",
    ) as CustomError;
    error.code = "NETWORK_ERROR";
    error.status = 0;
    throw error;
  }

  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const errorData = data as BackendErrorResponse;
    const message =
      errorData?.error?.message || errorData?.message || "Request failed";

    const error = new Error(message) as CustomError;
    error.data = errorData;
    error.status = response.status;
    error.code = errorData?.error?.code;

    throw error;
  }

  const responseData =
    (data as ApiResponse<T>).data !== undefined
      ? (data as ApiResponse<T>).data
      : (data as T);

  return {
    success: (data as { success?: boolean })?.success ?? true,
    data: responseData as T,
    rawData: data as T,
    message: (data as { message?: string })?.message,
    status: response.status,
  };
};

export const http = {
  get: <T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
  ) => request<T>("GET", endpoint, { params }),
  post: <T, B = unknown>(endpoint: string, body?: B) =>
    request<T, B>("POST", endpoint, { body }),
  put: <T, B = unknown>(endpoint: string, body?: B) =>
    request<T, B>("PUT", endpoint, { body }),
  patch: <T, B = unknown>(endpoint: string, body?: B) =>
    request<T, B>("PATCH", endpoint, { body }),
  del: <T>(endpoint: string) => request<T>("DELETE", endpoint),
};
