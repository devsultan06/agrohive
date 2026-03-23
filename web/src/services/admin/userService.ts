import { http } from "../../lib/fetch";
import { ADMIN_USER_KEY } from "../../config";

export interface UpdateUserPayload {
  fullName?: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  location: string | null;
  phone: string | null;
  isVerified: boolean;
  avatarUrl: string | null;
  _count?: {
    posts: number;
    followers: number;
  };
}

export interface AdminUsersFilter {
  verified?: string;
  search?: string;
}

export const userService = {
  async getMe() {
    // We already have /api/v1 in our fetch.ts config, so we just use /users/me
    const response = await http.get<UserProfile>("/users/me");
    return response.data;
  },

  async updateMe(payload: UpdateUserPayload, image?: File) {
    let response;

    if (image) {
      const formData = new FormData();
      if (payload.fullName) formData.append("fullName", payload.fullName);
      if (payload.bio) formData.append("bio", payload.bio);
      if (payload.phone) formData.append("phone", payload.phone);
      if (payload.location) formData.append("location", payload.location);
      formData.append("image", image);

      response = await http.patch<UserProfile>("/users/me", formData);
    } else {
      response = await http.patch<UserProfile>("/users/me", payload);
    }

    if (response.success) {
      // Update local storage
      const currentUser = JSON.parse(
        localStorage.getItem(ADMIN_USER_KEY) || "{}",
      );
      localStorage.setItem(
        ADMIN_USER_KEY,
        JSON.stringify({ ...currentUser, ...response.data }),
      );
    }

    return response.data;
  },

  async admin_getAllUsers(filter: AdminUsersFilter = {}) {
    const params = new URLSearchParams();
    if (filter.verified) params.append("verified", filter.verified);
    if (filter.search) params.append("search", filter.search);

    const response = await http.get<UserProfile[]>(
      `/users/admin/all?${params.toString()}`,
    );
    return response.data;
  },

  async admin_toggleVerification(userId: string) {
    const response = await http.patch<UserProfile>(
      `/users/admin/${userId}/toggle-verify`,
      {},
    );
    return response.data;
  },
};
