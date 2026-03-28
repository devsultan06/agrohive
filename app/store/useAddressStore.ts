import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addressService, Address } from "../services/address/address.service";

interface AddressState {
  addresses: Address[];
  selectedAddress: Address | null;
  loading: boolean;
  syncAddresses: () => Promise<void>;
  addAddress: (address: Partial<Address>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  selectAddress: (address: Address) => Promise<void>;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: [],
      selectedAddress: null,
      loading: false,

      syncAddresses: async () => {
        try {
          set({ loading: true });
          const res = await addressService.getAddresses();
          const items = res.data || [];
          set({
            addresses: items,
            selectedAddress: items.find((a) => a.isDefault) || items[0] || null,
          });
        } catch (err) {
          console.error("Sync addresses error:", err);
        } finally {
          set({ loading: false });
        }
      },

      addAddress: async (data) => {
        try {
          const res = await addressService.createAddress(data);
          const newAddress = res.data;
          set((state) => ({
            addresses: [newAddress, ...state.addresses],
            selectedAddress: newAddress.isDefault
              ? newAddress
              : state.selectedAddress || newAddress,
          }));
        } catch (err) {
          console.error("Add address error:", err);
          throw err;
        }
      },

      updateAddress: async (id, data) => {
        try {
          const res = await addressService.updateAddress(id, data);
          const updated = res.data;
          set((state) => ({
            addresses: state.addresses.map((a) => (a.id === id ? updated : a)),
            selectedAddress:
              state.selectedAddress?.id === id
                ? updated
                : state.selectedAddress,
          }));
        } catch (err) {
          console.error("Update address error:", err);
          throw err;
        }
      },

      deleteAddress: async (id) => {
        try {
          await addressService.deleteAddress(id);
          set((state) => {
            const newAddresses = state.addresses.filter((a) => a.id !== id);
            return {
              addresses: newAddresses,
              selectedAddress:
                state.selectedAddress?.id === id
                  ? newAddresses[0] || null
                  : state.selectedAddress,
            };
          });
        } catch (err) {
          console.error("Delete address error:", err);
          throw err;
        }
      },

      selectAddress: async (address) => {
        try {
          await addressService.setDefault(address.id);
          set({ selectedAddress: { ...address, isDefault: true } });
          // Optionally trigger a full sync to update isDefault across others
          get().syncAddresses();
        } catch (err) {
          console.error("Select address error:", err);
        }
      },
    }),
    {
      name: "address-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
