import { http } from "../../lib/fetch";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string | null;
  rating: number;
}

export interface ProductQuery {
  category?: string;
  search?: string;
}

export const getProducts = async (query?: ProductQuery): Promise<Product[]> => {
  const params: Record<string, string | number | boolean> = {};
  if (query?.category && query.category !== "All products") {
    params.category = query.category;
  }
  if (query?.search) {
    params.search = query.search;
  }

  const response = await http.get<Product[]>("/api/v1/products", params);

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch products");
  }

  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await http.get<Product>(`/api/v1/products/${id}`);

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch product");
  }

  return response.data;
};
