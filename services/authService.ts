import api from './api';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  full_name: string;
  roles: string[];
  active_role: string | null;
  financials: {
    walletBalance: number;
    sellerIncome: number;
    driverEarnings: number;
  };
}

export interface RegisterResponse {
  message: string;
}

export const authService = {
  login: async (email: string, password: string, remember_me: boolean = false): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
      remember_me,
    });
    return response.data;
  },

  getMe: async (): Promise<UserProfileResponse> => {
    const response = await api.get<UserProfileResponse>('/users/me');
    return response.data;
  },

  register: async (
    full_name: string,
    email: string,
    password: string,
    roles?: string[]
  ): Promise<RegisterResponse> => {
    const payload: any = {
      full_name,
      email,
      password,
    };
    if (roles && roles.length > 0) {
      payload.roles = roles;
    }

    const response = await api.post<RegisterResponse>('/auth/register', payload);
    return response.data;
  },

  getAvailableRoles: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/auth/roles');
    return response.data;
  },

  selectRole: async (role: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/select-role', { chosen_role: role });
    return response.data;
  },

  addRole: async (role: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/add-role', { role });
    return response.data;
  },
  
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/logout');
    return response.data;
  },
};
