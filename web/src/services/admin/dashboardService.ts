import { http } from "../../lib/fetch";

export interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  activeListings: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number[];
  monthlyLabels: string[];
}

export interface CategoryStat {
  name: string;
  count: number;
  percentage: number;
}

export interface RecentUser {
  id: string;
  fullName: string;
  email: string;
  isVerified: boolean;
  avatarUrl: string | null;
  _count: {
    posts: number;
    favorites: number;
  };
}

export const dashboardService = {
  async getGeneralStats() {
    const response = await http.get<DashboardStats>(
      "/users/admin/stats/general",
    );
    return response.data;
  },

  async getCategoryStats() {
    const response = await http.get<CategoryStat[]>(
      "/products/admin/stats/categories",
    );
    return response.data;
  },

  async getRecentUsers() {
    const response = await http.get<RecentUser[]>(
      "/users/admin/stats/recent-users?limit=4",
    );
    return response.data;
  },
};
