import { http } from "../../lib/fetch";

export interface PostUser {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
}

export interface PostComment {
  id: string;
  content: string;
  createdAt: string;
  user: PostUser;
}

export interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: PostUser;
  isLiked: boolean;
  isBookmarked: boolean;
  isFollowing: boolean;
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  comments?: PostComment[];
}

export const getPosts = async (): Promise<Post[]> => {
  const response = await http.get<Post[]>("/api/v1/posts");
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch posts");
  }
  return response.data;
};

export const getPostById = async (id: string): Promise<Post> => {
  const response = await http.get<Post>(`/api/v1/posts/${id}`);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch post");
  }
  return response.data;
};

export const getBookmarkedPosts = async (): Promise<Post[]> => {
  const response = await http.get<Post[]>("/api/v1/posts/bookmarks");
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch bookmarked posts");
  }
  return response.data;
};

export const getUserPosts = async (userId: string): Promise<Post[]> => {
  const response = await http.get<Post[]>(`/api/v1/posts/user/${userId}`);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch user posts");
  }
  return response.data;
};

export const createPost = async (
  content: string,
  image?: any,
): Promise<Post> => {
  const formData = new FormData();
  formData.append("content", content);
  if (image) {
    formData.append("image", image);
  }

  const response = await http.post<Post>("/api/v1/posts", formData);

  if (!response.success) {
    throw new Error(response.message || "Failed to create post");
  }

  return response.data;
};

export const toggleLike = async (id: string): Promise<{ liked: boolean }> => {
  const response = await http.post<{ liked: boolean }>(
    `/api/v1/posts/${id}/like`,
    {},
  );
  if (!response.success) {
    throw new Error(response.message || "Failed to like post");
  }
  return response.data;
};

export const toggleBookmark = async (
  id: string,
): Promise<{ bookmarked: boolean }> => {
  const response = await http.post<{ bookmarked: boolean }>(
    `/api/v1/posts/${id}/bookmark`,
    {},
  );
  if (!response.success) {
    throw new Error(response.message || "Failed to bookmark post");
  }
  return response.data;
};

export const addComment = async (
  id: string,
  content: string,
): Promise<PostComment> => {
  const response = await http.post<PostComment>(`/api/v1/posts/${id}/comment`, {
    content,
  });
  if (!response.success) {
    throw new Error(response.message || "Failed to add comment");
  }
  return response.data;
};
