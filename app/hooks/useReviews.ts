import { useQuery } from "@tanstack/react-query";
import { getProductReviews } from "../services/products/reviews.service";

export const useReviews = (productId: string) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => getProductReviews(productId),
    enabled: !!productId,
  });
};
