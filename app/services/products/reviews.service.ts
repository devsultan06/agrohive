import { http } from "../../lib/fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    fullName: string;
    avatarUrl?: string;
  };
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment: string;
}

export const getProductReviews = async (
  productId: string,
): Promise<Review[]> => {
  const response = await http.get<Review[]>(
    `/api/v1/reviews/product/${productId}`,
  );
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch reviews");
  }
  return response.data;
};

export const createProductReview = async (
  payload: CreateReviewPayload,
): Promise<Review> => {
  const response = await http.post<Review, CreateReviewPayload>(
    "/api/v1/reviews",
    payload,
  );
  if (!response.success) {
    throw new Error(response.message || "Failed to submit review");
  }
  return response.data;
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createProductReview(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.productId],
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
    },
  });
};
