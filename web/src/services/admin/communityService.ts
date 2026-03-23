import { http } from "../../lib/fetch";

export interface CommunityPost {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    fullName: string;
    username: string;
    avatarUrl: string | null;
  };
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  hasImage?: boolean; // Virtual for UI
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface CommunityStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalBookmarks: number;
}

export interface TopContributor {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
  postsCount: number;
}

export const communityService = {
  getPosts: async (params?: {
    search?: string;
    hasImage?: boolean;
    sortBy?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.hasImage) queryParams.append("hasImage", "true");
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);

    const res = await http.get<CommunityPost[]>(
      `/api/v1/posts?${queryParams.toString()}`,
    );
    return res.data;
  },

  getStats: async () => {
    const res = await http.get<CommunityStats>("/api/v1/posts/stats");
    return res.data;
  },

  getTopContributors: async () => {
    const res = await http.get<TopContributor[]>(
      "/api/v1/posts/top-contributors",
    );
    return res.data;
  },

  deletePost: async (id: string) => {
    const res = await http.del<{ success: boolean; message: string }>(
      `/api/v1/posts/${id}`,
    );
    return res.data;
  },

  createPost: async (content: string, image?: File | null) => {
    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    const res = await http.post<CommunityPost>("/api/v1/posts", formData);
    return res.data;
  },

  getPost: async (id: string) => {
    const res = await http.get<CommunityPost & { comments: any[] }>(
      `/api/v1/posts/${id}`,
    );
    return res.data;
  },

  addComment: async (postId: string, content: string) => {
    const res = await http.post<any>(`/api/v1/posts/${postId}/comment`, {
      content,
    });
    return res.data;
  },
};
