import { http } from "../../lib/fetch";

export interface ResetPasswordPayload {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export const requestResetPassword = async (
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponse> => {
  const response = await http.post<ResetPasswordResponse>(
    "/api/v1/auth/reset-password",
    payload,
  );

  console.log("Reset Password Request Response:", response);

  if (!response.success) {
    throw new Error(response.message || "Reset password request failed");
  }

  return response.data;
};
