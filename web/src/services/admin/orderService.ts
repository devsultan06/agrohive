import { http } from "../../lib/fetch";
import type { OrderStatus } from "../../types/api";

export const orderService = {
  getAllOrders: (params?: { status?: OrderStatus; search?: string }) =>
    http.get<any[]>("/orders/admin/all", params),

  getOrderDetails: (id: string) => http.get<any>(`/orders/${id}`),

  updateOrderStatus: (id: string, status: OrderStatus) =>
    http.patch<any>(`/orders/admin/${id}/status`, { status }),
};
