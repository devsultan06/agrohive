import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../services/users/profile.service";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: getMyProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};
