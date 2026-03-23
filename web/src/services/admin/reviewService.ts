import { http } from "../../lib/fetch";

export interface ReviewStats {
  totalReviews: number;
  totalFavorites: number;
  productsReviewed: number;
  totalProducts: number;
  avgRating: number;
}

export interface AdminReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    fullName: string;
    avatarUrl: string | null;
  };
  product: {
    name: string;
    imageUrl: string | null;
  };
}

export interface MostFavoritedProduct {
  id: string;
  name: string;
  imageUrl: string | null;
  favoritesCount: number;
}

export const reviewService = {
  async getAdminStats() {
    const response = await http.get<ReviewStats>("/reviews/admin/stats");
    return response.data;
  },

  async getAllReviews(search?: string) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    const response = await http.get<AdminReview[]>(
      `/reviews/admin/all?${params.toString()}`,
    );
    return response.data;
  },

  async getMostFavorited(limit = 4) {
    const response = await http.get<MostFavoritedProduct[]>(
      `/reviews/admin/most-favorited?limit=${limit}`,
    );
    return response.data;
  },
};
