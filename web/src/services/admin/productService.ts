import { http } from "../../lib/fetch";

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string | null;
  rating: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const productService = {
  async getProducts(params?: { category?: string; search?: string }) {
    const response = await http.get<Product[]>("/products", params);
    return response.data;
  },

  async getProduct(id: string) {
    const response = await http.get<Product>(`/products/${id}`);
    return response.data;
  },

  async createProduct(payload: CreateProductPayload, image?: File) {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("description", payload.description);
    formData.append("price", payload.price.toString());
    formData.append("category", payload.category);
    formData.append("stock", payload.stock.toString());
    formData.append("isActive", payload.isActive.toString());

    if (image) {
      formData.append("image", image);
    }

    const response = await http.post<Product>("/products", formData);
    return response.data;
  },

  async updateProduct(
    id: string,
    payload: Partial<CreateProductPayload>,
    image?: File,
  ) {
    const formData = new FormData();
    if (payload.name) formData.append("name", payload.name);
    if (payload.description)
      formData.append("description", payload.description);
    if (payload.price !== undefined)
      formData.append("price", payload.price.toString());
    if (payload.category) formData.append("category", payload.category);
    if (payload.stock !== undefined)
      formData.append("stock", payload.stock.toString());
    if (payload.isActive !== undefined)
      formData.append("isActive", payload.isActive.toString());

    if (image) {
      formData.append("image", image);
    }

    const response = await http.patch<Product>(`/products/${id}`, formData);
    return response.data;
  },

  async deleteProduct(id: string) {
    const response = await http.del(`/products/${id}`);
    return response.data;
  },

  async getInventoryStats() {
    const response = await http.get<
      { name: string; stock: number; sold: number }[]
    >("/products/admin/stats/inventory");
    return response.data;
  },
};
