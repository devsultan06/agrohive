import { http } from "../../lib/fetch";

export interface Address {
  id: string;
  label: string;
  fullName: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

export const addressService = {
  getAddresses: () => http.get<Address[]>("/addresses"),
  createAddress: (data: Partial<Address>) =>
    http.post<Address>("/addresses", data),
  updateAddress: (id: string, data: Partial<Address>) =>
    http.patch<Address>(`/addresses/${id}`, data),
  deleteAddress: (id: string) => http.del(`/addresses/${id}`),
  setDefault: (id: string) => http.patch(`/addresses/${id}/default`),
};
