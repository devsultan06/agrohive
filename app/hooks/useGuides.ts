import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchGuides,
  incrementGuideViews,
} from "../services/community/guide.service";

export const useGuides = (search?: string) => {
  return useQuery({
    queryKey: ["farming-guides", search],
    queryFn: () => fetchGuides(search),
  });
};

export const useIncrementViews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: incrementGuideViews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farming-guides"] });
    },
  });
};
