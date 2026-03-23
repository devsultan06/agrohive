import { http } from "../../lib/fetch";

export interface FarmingGuide {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  views: number;
  isActive: boolean;
  createdAt: string;
}

export const guideService = {
  getGuides: async (params?: { search?: string }) => {
    const res = await http.get<FarmingGuide[]>("/api/v1/guides", params);
    return res.data;
  },

  getStats: async () => {
    const res = await http.get<{
      totalVideos: number;
      totalViews: number;
      published: number;
    }>("/api/v1/guides/stats");
    return res.data;
  },

  createGuide: async (payload: any, video?: File, thumbnail?: File) => {
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });

    if (video) formData.append("video", video);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    const res = await http.post<FarmingGuide>("/api/v1/guides", formData);
    return res.data;
  },

  updateGuide: async (
    id: string,
    payload: any,
    video?: File,
    thumbnail?: File,
  ) => {
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });

    if (video) formData.append("video", video);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    const res = await http.patch<FarmingGuide>(
      `/api/v1/guides/${id}`,
      formData,
    );
    return res.data;
  },

  deleteGuide: async (id: string) => {
    const res = await http.del<{ message: string }>(`/api/v1/guides/${id}`);
    return res.data;
  },
};
