import api from './api';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  roles: string[];
  active_role: string | null;
  financials: {
    walletBalance: number;
    sellerIncome: number;
    driverEarnings: number;
  };
}

/**
 * Returned by every registration entry point.
 *
 * The message is deliberately identical whether or not the address already has an account,
 * so the UI must never treat it as a signal about account existence. The timings drive the
 * OTP screen's expiry notice and resend countdown.
 */
export interface RegistrationChallengeResponse {
  message: string;
  expires_in_seconds: number;
  resend_available_in_seconds: number;
}

export interface VerifyRegistrationResponse {
  message: string;
  user_id: string;
  email: string;
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

  updateProfile: async (data: { full_name?: string; avatar_url?: string }): Promise<UserProfileResponse> => {
    const response = await api.put<UserProfileResponse>('/users/me', data);
    return response.data;
  },

  /**
   * Opens a registration. This does NOT create the account: the backend stages the details
   * and emails a one-time code, and the account only exists once verifyRegistration succeeds.
   */
  register: async (
    full_name: string,
    email: string,
    password: string,
    roles?: string[]
  ): Promise<RegistrationChallengeResponse> => {
    const payload: Record<string, unknown> = {
      full_name,
      email,
      password,
    };
    if (roles && roles.length > 0) {
      payload.roles = roles;
    }

    const response = await api.post<RegistrationChallengeResponse>('/auth/register', payload);
    return response.data;
  },

  /** Redeems the emailed code and creates the account. No session is issued on success. */
  verifyRegistration: async (email: string, code: string): Promise<VerifyRegistrationResponse> => {
    const response = await api.post<VerifyRegistrationResponse>('/auth/register/verify', {
      email,
      code,
    });
    return response.data;
  },

  /** Requests a replacement code. Rejected with 429 while the cooldown is still running. */
  resendRegistrationOtp: async (email: string): Promise<RegistrationChallengeResponse> => {
    const response = await api.post<RegistrationChallengeResponse>('/auth/register/resend', {
      email,
    });
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
