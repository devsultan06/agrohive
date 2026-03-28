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
  getAddresses: () => http.get<Address[]>("/api/v1/addresses"),
  createAddress: (data: Partial<Address>) =>
    http.post<Address>("/api/v1/addresses", data),
  updateAddress: (id: string, data: Partial<Address>) =>
    http.patch<Address>(`/api/v1/addresses/${id}`, data),
  deleteAddress: (id: string) => http.del(`/api/v1/addresses/${id}`),
  setDefault: (id: string) => http.patch(`/api/v1/addresses/${id}/default`),
};
