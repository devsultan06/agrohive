// This reads the URL from the .env file
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

// These keep your local storage consistent and avoid typos in the code
export const ADMIN_TOKEN_KEY = "agrohive_admin_token";
export const ADMIN_REFRESH_TOKEN_KEY = "agrohive_admin_refresh_token";
export const ADMIN_USER_KEY = "agrohive_admin_user";
