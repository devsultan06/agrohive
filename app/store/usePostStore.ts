import { create } from "zustand";

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

interface PostState {
  posts: Post[];
  draftContent: string;
  addPost: (post: Post) => void;
  toggleLike: (postId: string) => void;
  getPostsByUser: (userName: string) => Post[];
  setDraftContent: (content: string) => void;
  clearDraftContent: () => void;
}

// Initial Mock Data
const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    user: {
      name: "Suarau uthman",
      avatar: require("../assets/icon.png"), // Placeholder
    },
    date: "Jul 21",
    content:
      "Hello, fellow farmers! 🌱\nI'm offering my trusted precision agriculture drone for sale. This drone has been a game-changer for monitoring crop health, optimizing irrigation, and improving yields. It's in excellent condition, and I'm only selling it because I've upgraded to a newer mode...",
    image: require("../assets/r2.png"), // Drone image
    likes: 10,
    comments: 6,
    isLiked: false,
    isSaved: false,
  },
  {
    id: "2",
    user: {
      name: "Ibrahim Yusuf",
      avatar: require("../assets/icon.png"), // Placeholder
    },
    date: "Jul 22",
    content:
      "Just installed a new smart irrigation system on my tomato farm. The water savings have been incredible so far! Has anyone else tried drip irrigation for vegetables? Would love to hear your experiences.",
    image: require("../assets/drone_sprayer.png"), // Irrigation image placeholder
    likes: 24,
    comments: 12,
    isLiked: true,
    isSaved: false,
  },
  {
    id: "3",
    user: {
      name: "AGBOHOR Boluwa",
      avatar: { uri: "https://i.pravatar.cc/150?img=12" }, // Using avatar from profile
    },
    date: "Just now",
    content:
      "Excited to join the AgroHive community! Looking forward to sharing insights and learning from everyone here. 🌾🚜",
    likes: 5,
    comments: 2,
    isLiked: false,
    isSaved: false,
  },
  {
    id: "4",
    user: {
      name: "AGBOHOR Boluwa",
      avatar: { uri: "https://i.pravatar.cc/150?img=12" }, // Using avatar from profile
    },
    date: "Just now",
    content:
      "Excited to join the AgroHive community! Looking forward to sharing insights and learning from everyone here. 🌾🚜",
    likes: 5,
    comments: 2,
    isLiked: false,
    isSaved: false,
  },
];

export const usePostStore = create<PostState>((set, get) => ({
  posts: INITIAL_POSTS,
  draftContent: "",
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  toggleLike: (postId) =>
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
    })),
  getPostsByUser: (userName) => {
    return get().posts.filter((post) => post.user.name === userName);
  },
  setDraftContent: (content) => set({ draftContent: content }),
  clearDraftContent: () => set({ draftContent: "" }),
}));
