import { http } from "../../lib/fetch";
import * as SecureStore from "expo-secure-store";

export interface GoogleLoginPayload {
  idToken: string;
  fcmToken?: string;
}

export interface GoogleLoginResponse {
  access_token: string;
  refresh_token: string;
}

export const requestGoogleLogin = async (
  payload: GoogleLoginPayload,
): Promise<GoogleLoginResponse> => {
  const response = await http.post<GoogleLoginResponse>(
    "/api/v1/auth/google-login",
    payload,
  );

  if (!response.success) {
    throw new Error(response.message || "Google login failed");
  }

  // Store tokens in SecureStore
  if (response.data.access_token) {
    await SecureStore.setItemAsync("token", response.data.access_token);
  }
  if (response.data.refresh_token) {
    await SecureStore.setItemAsync("refreshToken", response.data.refresh_token);
  }

  return response.data;
};
