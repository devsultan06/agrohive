import { http } from "../../lib/fetch";

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export const requestForgotPassword = async (
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordResponse> => {
  const response = await http.post<ForgotPasswordResponse>(
    "/api/v1/auth/forgot-password",
    payload,
  );

  console.log("Forgot Password Request Response:", response);

  if (!response.success) {
    throw new Error(response.message || "Forgot password request failed");
  }

  return response.data;
};
