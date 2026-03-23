import { create } from "zustand";
import * as postsService from "../services/posts/posts.service";
import { toggleFollow } from "../services/users/profile.service";

export interface Post {
  id: string;
  user: {
    name: string;
    avatar: any;
    username: string;
    id: string;
  };
  date: string;
  content: string;
  image?: any;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  isFollowing?: boolean;
  commentsList?: any[];
}

interface PostState {
  posts: Post[];
  bookmarks: Post[];
  isLoading: boolean;
  error: string | null;
  draftContent: string;
  fetchPosts: () => Promise<void>;
  fetchBookmarks: () => Promise<void>;
  addPost: (content: string, image?: any) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  toggleBookmark: (postId: string) => Promise<void>;
  toggleFollowAuthor: (userId: string) => Promise<void>;
  getPostsByUser: (userId: string) => Promise<Post[]>;
  setDraftContent: (content: string) => void;
  clearDraftContent: () => void;
}

const mapBackendPostToFrontend = (post: postsService.Post): Post => ({
  id: post.id,
  user: {
    name: post.user.fullName,
    username: post.user.username,
    id: post.user.id,
    avatar: post.user.avatarUrl ? { uri: post.user.avatarUrl } : null,
  },
  date: new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }),
  content: post.content,
  image: post.imageUrl ? { uri: post.imageUrl } : null,
  likes: post.likesCount,
  comments: post.commentsCount,
  isLiked: post.isLiked,
  isSaved: post.isBookmarked,
  isFollowing: post.isFollowing,
  commentsList: post.comments?.map((c: any) => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
    user: {
      id: c.user.id,
      name: c.user.fullName,
      username: c.user.username,
      avatar: c.user.avatarUrl ? { uri: c.user.avatarUrl } : null,
    },
  })),
});

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  bookmarks: [],
  isLoading: false,
  error: null,
  draftContent: "",

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const backendPosts = await postsService.getPosts();
      const mappedPosts = backendPosts.map(mapBackendPostToFrontend);
      set({ posts: mappedPosts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchBookmarks: async () => {
    set({ isLoading: true, error: null });
    try {
      const backendPosts = await postsService.getBookmarkedPosts();
      const mappedPosts = backendPosts.map(mapBackendPostToFrontend);
      set({ bookmarks: mappedPosts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addPost: async (content, image) => {
    set({ isLoading: true, error: null });
    try {
      const newPost = await postsService.createPost(content, image);
      const mappedPost = mapBackendPostToFrontend(newPost);
      set((state) => ({
        posts: [mappedPost, ...state.posts],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  toggleLike: async (postId) => {
    // Optimistic update
    const previousPosts = get().posts;
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      }),
    }));

    try {
      await postsService.toggleLike(postId);
    } catch (error: any) {
      // Rollback on error
      set({ posts: previousPosts, error: error.message });
    }
  },

  toggleBookmark: async (postId) => {
    // Optimistic update
    const previousPosts = get().posts;
    const previousBookmarks = get().bookmarks;

    set((state) => {
      const updatedPosts = state.posts.map((post) => {
        if (post.id === postId) {
          return { ...post, isSaved: !post.isSaved };
        }
        return post;
      });

      // Also update the bookmarks list optimistically
      let updatedBookmarks = [...state.bookmarks];
      const isCurrentlySaved = state.bookmarks.some((b) => b.id === postId);

      if (isCurrentlySaved) {
        updatedBookmarks = updatedBookmarks.filter((b) => b.id !== postId);
      } else {
        const postToAdd = updatedPosts.find((p) => p.id === postId);
        if (postToAdd) {
          updatedBookmarks = [postToAdd, ...updatedBookmarks];
        }
      }

      return {
        posts: updatedPosts,
        bookmarks: updatedBookmarks,
      };
    });

    try {
      await postsService.toggleBookmark(postId);
    } catch (error: any) {
      // Rollback on error
      set({
        posts: previousPosts,
        bookmarks: previousBookmarks,
        error: error.message,
      });
    }
  },

  toggleFollowAuthor: async (authorId) => {
    // Optimistic update
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.user.id === authorId) {
          return { ...post, isFollowing: !post.isFollowing };
        }
        return post;
      }),
    }));

    try {
      await toggleFollow(authorId);
    } catch (error: any) {
      console.error("Follow toggled failed:", error);
    }
  },

  getPostsByUser: async (userId) => {
    try {
      const backendPosts = await postsService.getUserPosts(userId);
      return backendPosts.map(mapBackendPostToFrontend);
    } catch (error: any) {
      set({ error: error.message });
      return [];
    }
  },

  setDraftContent: (content) => set({ draftContent: content }),
  clearDraftContent: () => set({ draftContent: "" }),
}));
