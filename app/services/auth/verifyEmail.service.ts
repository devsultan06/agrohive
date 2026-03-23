import { http } from "../../lib/fetch";
import * as SecureStore from "expo-secure-store";

export interface VerifyEmailPayload {
  email: string;
  code: string;
  fcmToken?: string;
}

export interface VerifyEmailResponse {
  access_token: string;
  refresh_token: string;
}

export const requestVerifyEmail = async (
  payload: VerifyEmailPayload,
): Promise<VerifyEmailResponse> => {
  const response = await http.post<VerifyEmailResponse>(
    "/api/v1/auth/verify",
    payload,
  );

  console.log("Verify Request Response:", response);

  if (!response.success) {
    throw new Error(response.message || "Verification request failed");
  }

  // Store tokens in SecureStore for automatic login after verification
  if (response.data.access_token) {
    await SecureStore.setItemAsync("token", response.data.access_token);
  }
  if (response.data.refresh_token) {
    await SecureStore.setItemAsync("refreshToken", response.data.refresh_token);
  }

  return response.data;
};
