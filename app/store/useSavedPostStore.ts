import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Post {
  id: string;
  user: {
    name: string;
    avatar: any;
  };
  date: string;
  content: string;
  image?: any;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
}

interface SavedPostState {
  savedPosts: Post[];
  toggleSavePost: (post: Post) => void;
  isPostSaved: (postId: string) => boolean;
}

export const useSavedPostStore = create<SavedPostState>()(
  persist(
    (set, get) => ({
      savedPosts: [],
      toggleSavePost: (post) =>
        set((state) => {
          const isSaved = state.savedPosts.some((p) => p.id === post.id);
          if (isSaved) {
            return {
              savedPosts: state.savedPosts.filter((p) => p.id !== post.id),
            };
          } else {
            return {
              savedPosts: [...state.savedPosts, { ...post, isSaved: true }],
            };
          }
        }),
      isPostSaved: (postId) => {
        return get().savedPosts.some((p) => p.id === postId);
      },
    }),
    {
      name: "saved-posts-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
