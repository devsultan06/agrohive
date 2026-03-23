import { http } from "../../lib/fetch";

export interface ResendOtpPayload {
  email: string;
}

export interface ResendOtpResponse {
  message: string;
}

export const requestResendOtp = async (
  payload: ResendOtpPayload,
): Promise<ResendOtpResponse> => {
  const response = await http.post<ResendOtpResponse>(
    "/api/v1/auth/resend-otp",
    payload,
  );

  console.log("Resend OTP Request Response:", response);

  if (!response.success) {
    throw new Error(response.message || "Resend OTP request failed");
  }

  return response.data;
};
