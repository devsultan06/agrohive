import { http } from "../../lib/fetch";

export type NotificationType =
  | "FOLLOW"
  | "LIKE"
  | "COMMENT"
  | "ORDER_UPDATE"
  | "PROMOTION"
  | "SYSTEM"
  | "WELCOME";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: any;
  createdAt: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await http.get<Notification[]>("/api/v1/notifications");
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch notifications");
  }
  return response.data;
};

export const markAsRead = async (id: string): Promise<void> => {
  const response = await http.patch<{ success: boolean }>(
    `/api/v1/notifications/${id}/read`,
  );
  if (!response.success) {
    throw new Error(response.message || "Failed to mark notification as read");
  }
};

export const markAllAsRead = async (): Promise<void> => {
  const response = await http.patch<{ success: boolean }>(
    "/api/v1/notifications/read-all",
  );
  if (!response.success) {
    throw new Error(response.message || "Failed to mark all as read");
  }
};

export const deleteNotification = async (id: string): Promise<void> => {
  const response = await http.del<{ success: boolean }>(
    `/api/v1/notifications/${id}`,
  );
  if (!response.success) {
    throw new Error(response.message || "Failed to delete notification");
  }
};

export const clearAllNotifications = async (): Promise<void> => {
  const response = await http.del<{ success: boolean }>(
    "/api/v1/notifications",
  );
  if (!response.success) {
    throw new Error(response.message || "Failed to clear notifications");
  }
};
