import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: any;
  rating: number;
  category?: string;
  description?: string;
}

interface FavoriteState {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (product) =>
        set((state) => ({
          favorites: [...state.favorites, product],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((item) => item.id !== id),
        })),
      toggleFavorite: (product) => {
        const { favorites } = get();
        const exists = favorites.some((item) => item.id === product.id);
        if (exists) {
          set((state) => ({
            favorites: state.favorites.filter((item) => item.id !== product.id),
          }));
        } else {
          set((state) => ({
            favorites: [...state.favorites, product],
          }));
        }
      },
      isFavorite: (id) => {
        return get().favorites.some((item) => item.id === id);
      },
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "favorite-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
