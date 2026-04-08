import { http } from "../../lib/fetch";

export const notificationService = {
  sendToAll: async (data: {
    type: string;
    title: string;
    message: string;
    target: string;
  }) => {
    const response = await http.post("/notifications/admin/send", data);

    if (!response.success) {
      throw new Error(response.message || "Failed to send notification");
    }

    return response.data;
  },
};
