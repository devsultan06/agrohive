import { http } from "../../lib/fetch";

export const orderService = {
  getMyOrders: () => http.get<any[]>("/orders/me"),
  getOrderDetails: (id: string) => http.get<any>(`/orders/${id}`),
};
