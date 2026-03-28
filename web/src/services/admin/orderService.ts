import { http } from "../../lib/fetch";
import type { OrderStatus } from "../../types/api";

export const orderService = {
  getAllOrders: async (params?: { status?: OrderStatus; search?: string }) => {
    const res = await http.get<any[]>("/orders/admin/all", params);
    return res.data;
  },

  getOrderDetails: async (id: string) => {
    const res = await http.get<any>(`/orders/${id}`);
    return res.data;
  },

  updateOrderStatus: async (id: string, status: OrderStatus) => {
    const res = await http.patch<any>(`/orders/admin/${id}/status`, { status });
    return res.data;
  },
};
