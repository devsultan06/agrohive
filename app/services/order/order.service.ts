import { http } from "../../lib/fetch";

export const orderService = {
  getMyOrders: () => http.get<any[]>("/orders/me"),
  getOrderDetails: (id: string) => http.get<any>(`/orders/${id}`),
  createOrder: (data: {
    items: { productId: string; quantity: number }[];
    shippingAddress?: string;
    shippingPhone?: string;
  }) => http.post<any>("/orders", data),
};
