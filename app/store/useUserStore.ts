import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string | null;
}

interface UserState {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        name: "AGBOHOR Boluwa",
        email: "boluwa@agrohive.com",
        phone: "+234 812 345 6789",
        location: "Lagos, Nigeria",
        bio: "Passionate about sustainable farming and modern agricultural technology.",
        avatar: "https://i.pravatar.cc/150?img=12",
      },
      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
