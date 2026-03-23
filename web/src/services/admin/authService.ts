import { http } from "../../lib/fetch";
import { ADMIN_TOKEN_KEY, ADMIN_USER_KEY } from "../../config";

export interface AdminLoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export const authService = {
  async adminLogin(
    email: string,
    password: string,
  ): Promise<AdminLoginResponse> {
    const response = await http.post<AdminLoginResponse>("/auth/admin/login", {
      email,
      password,
    });

    if (!response.success) {
      throw new Error(response.message || "Login failed");
    }

    const data = response.data;

    // Save to local storage
    localStorage.setItem(ADMIN_TOKEN_KEY, data.access_token);
    localStorage.setItem("agrohive_admin_refresh_token", data.refresh_token);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));

    return data;
  },

  logout() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem("agrohive_admin_refresh_token");
    localStorage.removeItem(ADMIN_USER_KEY);
    window.location.href = "/admin/login";
  },

  getUser() {
    const user = localStorage.getItem(ADMIN_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
