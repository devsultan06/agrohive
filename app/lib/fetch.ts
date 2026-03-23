import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import {
  ApiResponse,
  BackendErrorResponse,
  CustomError,
} from "../types/auth/api";

export const BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

const buildUrl = (
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>,
) => {
  // 1. Clean the base URL (ensure it ends with /)
  let cleanBaseUrl = BASE_URL?.endsWith("/") ? BASE_URL : `${BASE_URL}/`;

  // 2. Clean the endpoint (ensure it doesn't start with /)
  let cleanEndpoint = endpoint.startsWith("/")
    ? endpoint.substring(1)
    : endpoint;

  // 3. 🚨 SMART FIX: Deduplicate manual API prefixes 🚨
  // If base already has /api/v1 and endpoint starts with it, pull it out of the endpoint
  if (
    cleanBaseUrl.includes("/api/v1/") &&
    cleanEndpoint.startsWith("api/v1/")
  ) {
    cleanEndpoint = cleanEndpoint.replace("api/v1/", "");
  }

  const url = new URL(cleanEndpoint, cleanBaseUrl);

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
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
}

// ✅ Main request for Expo app
const request = async <T, B = unknown>(
  method: string,
  endpoint: string,
  options?: RequestOptions<B>,
): Promise<ApiResponse<T>> => {
  const token = await SecureStore.getItemAsync("token"); // Expo-safe storage

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
  let retryCount = 0;
  const MAX_RETRIES = 1;

  try {
    response = await fetch(url, config);

    // ✅ Handle Token Refresh (401 Unauthorized)
    if (
      response.status === 401 &&
      endpoint !== "/api/v1/auth/login" &&
      endpoint !== "/api/v1/auth/refresh"
    ) {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (refreshToken) {
        try {
          // Attempt to refresh
          const refreshUrl = buildUrl("/api/v1/auth/refresh");
          const refreshResponse = await fetch(refreshUrl, {
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
              await SecureStore.setItemAsync("token", newTokens.access_token);
              if (newTokens.refresh_token) {
                await SecureStore.setItemAsync(
                  "refreshToken",
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
          // If refresh fails, let it fall through to the 401 error handling below
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

    // If still 401 (unauthorized) after refresh attempt, we might want to redirect to login
    // or handle it in the global state
    if (response.status === 401) {
      // Potentially clear tokens here or let the app state handle logout
      // await SecureStore.deleteItemAsync("token");
      // await SecureStore.deleteItemAsync("refreshToken");
    }

    throw error;
  }

  // If the backend returns the object directly (no .data wrapper),
  // we use the whole object as the data.
  const responseData =
    (data as ApiResponse<T>).data !== undefined
      ? (data as ApiResponse<T>).data
      : (data as T);

  return {
    success: (data as { success?: boolean })?.success ?? true,
    data: responseData as T,
    rawData: data as T, // full parsed body
    message: (data as { message?: string })?.message,
    meta: (data as { meta?: any })?.meta,
    requestId: (data as { requestId?: string })?.requestId,
    status: response.status,
  };
};

export const http = {
  get: <T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>,
  ) => request<T>("GET", endpoint, { params }),
  post: <T, B = unknown>(endpoint: string, body?: B) =>
    request<T, B>("POST", endpoint, { body }),
  put: <T, B = unknown>(endpoint: string, body?: B) =>
    request<T, B>("PUT", endpoint, { body }),
  patch: <T, B = unknown>(endpoint: string, body?: B) =>
    request<T, B>("PATCH", endpoint, { body }),
  del: <T>(endpoint: string) => request<T>("DELETE", endpoint),
};
