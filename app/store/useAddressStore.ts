import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Address {
  id: string;
  label: string;
  fullName: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

interface AddressState {
  addresses: Address[];
  selectedAddress: Address | null;
  addAddress: (address: Address) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  selectAddress: (address: Address) => void;
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: "1",
    label: "Home",
    fullName: "Suarau Uthman",
    address: "123 Lekki Phase 1, Lagos, Nigeria",
    phone: "+234 812 345 6789",
    isDefault: true,
  },
  {
    id: "2",
    label: "Office",
    fullName: "Suarau Uthman",
    address: "45 Victory Estate, Ikeja, Lagos, Nigeria",
    phone: "+234 812 345 6789",
    isDefault: false,
  },
];

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: INITIAL_ADDRESSES,
      selectedAddress: INITIAL_ADDRESSES[0],
      addAddress: (address) =>
        set((state) => ({
          addresses: [...state.addresses, address],
          // If it's the first address or marked as default, select it
          selectedAddress:
            state.addresses.length === 0 || address.isDefault
              ? address
              : state.selectedAddress,
        })),
      updateAddress: (address) =>
        set((state) => {
          const newAddresses = state.addresses.map((a) =>
            a.id === address.id ? address : a,
          );
          return {
            addresses: newAddresses,
            selectedAddress:
              state.selectedAddress?.id === address.id
                ? address
                : state.selectedAddress,
          };
        }),
      deleteAddress: (id) =>
        set((state) => {
          const newAddresses = state.addresses.filter((a) => a.id !== id);
          return {
            addresses: newAddresses,
            selectedAddress:
              state.selectedAddress?.id === id
                ? newAddresses[0] || null
                : state.selectedAddress,
          };
        }),
      selectAddress: (address) => set({ selectedAddress: address }),
    }),
    {
      name: "address-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
