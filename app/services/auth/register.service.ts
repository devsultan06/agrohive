import { http } from "../../lib/fetch";

export interface RegisterRequestPayload {
  email: string;
  password?: string;
  fullName?: string;
  phone?: string;
  location?: string;
  bio?: string;
  image?: { uri: string; name: string; type: string };
}

export interface RegisterRequestResponse {
  message: string;
  email: string;
}

export const requestRegister = async (
  payload: RegisterRequestPayload,
): Promise<RegisterRequestResponse> => {
  const formData = new FormData();
  formData.append("email", payload.email);
  if (payload.password) formData.append("password", payload.password);
  if (payload.fullName) formData.append("fullName", payload.fullName);
  if (payload.phone) formData.append("phone", payload.phone);
  if (payload.location) formData.append("location", payload.location);
  if (payload.bio) formData.append("bio", payload.bio);

  if (payload.image) {
    formData.append("image", payload.image as any);
  }

  const response = await http.post<RegisterRequestResponse>(
    "/api/v1/auth/register",
    formData,
  );

  console.log("Register Request Response:", response);

  if (!response.success) {
    throw new Error(response.message || "Registration request failed");
  }

  return response.data;
};
