import { http } from "../../lib/fetch";

export interface UserProfileResponse {
  id: string;
  email: string;
  fullName: string;
  username: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  isVerified: boolean;
  provider: string;
  isFollowing?: boolean;
  _count?: {
    followers: number;
    following: number;
  };
}

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  location?: string;
  bio?: string;
  image?: { uri: string; name: string; type: string };
}

export const getMyProfile = async (): Promise<UserProfileResponse> => {
  const response = await http.get<UserProfileResponse>("/api/v1/users/me");
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch profile");
  }
  return response.data;
};

export const getUserProfile = async (
  userId: string,
): Promise<UserProfileResponse> => {
  const response = await http.get<UserProfileResponse>(
    `/api/v1/users/${userId}`,
  );
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch user profile");
  }
  return response.data;
};

export const toggleFollow = async (
  userId: string,
): Promise<{ following: boolean }> => {
  const response = await http.post<{ following: boolean }>(
    `/api/v1/users/${userId}/follow`,
    {},
  );
  if (!response.success) {
    throw new Error(response.message || "Failed to toggle follow status");
  }
  return response.data;
};

export const updateMyProfile = async (
  payload: UpdateProfilePayload,
): Promise<{ message: string; user: UserProfileResponse }> => {
  const formData = new FormData();
  if (payload.fullName) formData.append("fullName", payload.fullName);
  if (payload.phone) formData.append("phone", payload.phone);
  if (payload.location) formData.append("location", payload.location);
  if (payload.bio) formData.append("bio", payload.bio);

  if (payload.image) {
    formData.append("image", payload.image as any);
  }

  const response = await http.patch<{
    message: string;
    user: UserProfileResponse;
  }>("/api/v1/users/me", formData);

  if (!response.success) {
    throw new Error(response.message || "Failed to update profile");
  }

  return response.data;
};

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<{ message: string }> => {
  const response = await http.post<{ message: string }>(
    "/api/v1/users/change-password",
    payload,
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to change password");
  }

  return response.data;
};

export const deleteMyAccount = async (): Promise<{ message: string }> => {
  const response = await http.del<{ message: string }>("/api/v1/users/me");

  if (!response.success) {
    throw new Error(response.message || "Failed to delete account");
  }

  return response.data;
};
