import { http } from "../../lib/fetch";
import { Product } from "./products.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const getMyFavorites = async (): Promise<Product[]> => {
  const response = await http.get<Product[]>("/api/v1/favorites");
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch favorites");
  }
  return response.data;
};

export const toggleFavorite = async (
  productId: string,
): Promise<{ isFavorite: boolean }> => {
  const response = await http.post<
    { isFavorite: boolean },
    { productId: string }
  >("/api/v1/favorites/toggle", { productId });
  if (!response.success) {
    throw new Error(response.message || "Failed to toggle favorite");
  }
  return response.data;
};

export const clearAllFavorites = async (): Promise<{ message: string }> => {
  const response = await http.del<{ message: string }>(
    "/api/v1/favorites/clear",
  );
  if (!response.success) {
    throw new Error(response.message || "Failed to clear favorites");
  }
  return response.data;
};

// Hooks for convenience
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => toggleFavorite(productId),
    // Optimistic update
    onMutate: async (productId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["favorites"] });

      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData<Product[]>([
        "favorites",
      ]);

      // Optimistically update to the new value
      if (previousFavorites) {
        const isCurrentlyFavorite = previousFavorites.some(
          (f) => f.id === productId,
        );

        if (isCurrentlyFavorite) {
          // Remove from favorites
          queryClient.setQueryData(
            ["favorites"],
            previousFavorites.filter((f) => f.id !== productId),
          );
        } else {
          // Try to add it from products cache
          const allProducts =
            queryClient.getQueryData<Product[]>(["products"]) || [];
          const productToAdd = allProducts.find((p) => p.id === productId);

          if (productToAdd) {
            queryClient.setQueryData(
              ["favorites"],
              [...previousFavorites, productToAdd],
            );
          }
        }
      }

      return { previousFavorites };
    },
    // If mutation fails, roll back to snapshot
    onError: (err, productId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorites"], context.previousFavorites);
      }
    },
    // Always refetch to sync with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

export const useClearFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearAllFavorites,
    onSuccess: () => {
      queryClient.setQueryData(["favorites"], []);
    },
  });
};
