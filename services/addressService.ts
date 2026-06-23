import api from './api';

export interface AddressRequest {
  full_address: string;
}

export interface AddressResponse {
  id: number;
  buyer_id: string;
  full_address: string;
}

export const addressService = {
  getAddresses: async (): Promise<AddressResponse[]> => {
    const response = await api.get('/buyer/addresses');
    return response.data;
  },

  addAddress: async (data: AddressRequest): Promise<AddressResponse> => {
    const response = await api.post('/buyer/addresses', data);
    return response.data;
  }
};
