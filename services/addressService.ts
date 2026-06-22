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
  getAddresses: async (token: string): Promise<AddressResponse[]> => {
    const response = await api.get('/buyer/addresses', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  addAddress: async (data: AddressRequest, token: string): Promise<AddressResponse> => {
    const response = await api.post('/buyer/addresses', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
