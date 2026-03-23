import { useQuery } from "@tanstack/react-query";
import { getMyFavorites } from "../services/products/favorites.service";

export const useFavorites = () => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getMyFavorites,
  });
};
