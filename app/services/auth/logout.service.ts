import { http } from "../../lib/fetch";
import * as SecureStore from "expo-secure-store";

/**
 * Signs out the user by clearing local storage and optionally informing the backend.
 */
export const requestLogout = async (): Promise<void> => {
  try {
    // 1. Inform the backend (optional, but good for security)
    // We don't necessarily need to wait for this or handle errors if it fails,
    // as the local logout is more critical for the UI.
    await http.post("/api/v1/auth/logout").catch((err) => {
      console.warn("Backend logout failed:", err);
    });
  } finally {
    // 2. Clear tokens from SecureStore
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("refreshToken");
  }
};
