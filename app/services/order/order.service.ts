import { http } from "../../lib/fetch";

export const orderService = {
  getMyOrders: () => http.get<any[]>("/api/v1/orders/me"),
  getOrderDetails: (id: string) => http.get<any>(`/api/v1/orders/${id}`),
  createOrder: (data: {
    items: { productId: string; quantity: number }[];
    shippingAddress?: string;
    shippingPhone?: string;
  }) => http.post<any>("/api/v1/orders", data),
  initiatePayment: (orderId: string) =>
    http.post<any>(`/api/v1/orders/${orderId}/payment/initiate`),
};
