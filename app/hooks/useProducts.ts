import { useQuery } from "@tanstack/react-query";
import {
  getProducts,
  ProductQuery,
  Product,
} from "../services/products/products.service";

export { Product }; // Re-export for convenience until all consumers are updated

export const useProducts = (query?: ProductQuery) => {
  return useQuery<Product[]>({
    queryKey: ["products", query],
    queryFn: () => getProducts(query),
  });
};
