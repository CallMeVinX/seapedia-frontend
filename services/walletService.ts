import api from './api';

export interface WalletTransactionResponse {
  id: number;
  amount: number;
  transaction_type: string;
  description?: string;
  created_at: string;
}

export interface WalletResponse {
  id: number;
  balance: number;
  transactions: WalletTransactionResponse[];
}

export interface TopUpRequest {
  amount: number;
}

export const walletService = {
  getWallet: async (): Promise<WalletResponse> => {
    const response = await api.get('/buyer/wallet');
    return response.data;
  },

  topUp: async (data: TopUpRequest): Promise<WalletResponse> => {
    const response = await api.post('/buyer/wallet/topup', data);
    return response.data;
  }
};
