import { http } from "../../lib/fetch";
import * as SecureStore from "expo-secure-store";

export interface LoginRequestPayload {
  email: string;
  password?: string;
}

export interface LoginRequestResponse {
  access_token: string;
  refresh_token: string;
}

export const requestLogin = async (
  payload: LoginRequestPayload,
): Promise<LoginRequestResponse> => {
  const response = await http.post<LoginRequestResponse>(
    "/api/v1/auth/login",
    payload,
  );

  console.log("Login Request Response:", response);

  if (!response.success) {
    throw new Error(response.message || "Login failed");
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
