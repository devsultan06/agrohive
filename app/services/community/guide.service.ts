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

export const fetchGuides = async (search?: string) => {
  const res = await http.get<FarmingGuide[]>("/api/v1/guides", { search });
  return res.data;
};

export const incrementGuideViews = async (id: string) => {
  const res = await http.patch<FarmingGuide>(`/api/v1/guides/${id}/views`);
  return res.data;
};
