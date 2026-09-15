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

export interface ForgotPasswordResponse {
  message: string;
  expires_in_seconds: number;
  resend_available_in_seconds: number;
}

export interface VerifyResetCodeResponse {
  message: string;
  reset_token: string;
  expires_in_seconds: number;
}

export interface ResetPasswordResponse {
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

  /** Initiates password reset for a registered email address. */
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', {
      email,
    });
    return response.data;
  },

  /**
   * Tahap 2: Memverifikasi kode PIN 6 digit ke backend sebelum membuka form ganti password baru.
   * Menghasilkan reset_token jika kode valid.
   */
  verifyResetCode: async (email: string, code: string): Promise<VerifyResetCodeResponse> => {
    const response = await api.post<VerifyResetCodeResponse>('/auth/reset-password/verify', {
      email,
      code,
    });
    return response.data;
  },

  /**
   * Tahap 3: Memperbarui kata sandi menggunakan reset_token (rekomendasi best-practice)
   * atau kombinasi email + code (backward-compatibility).
   */
  resetPassword: async (
    tokenOrEmail: string,
    newPasswordOrCode: string,
    newPasswordLegacy?: string
  ): Promise<ResetPasswordResponse> => {
    let payload: Record<string, string>;
    if (newPasswordLegacy !== undefined) {
      payload = {
        email: tokenOrEmail,
        code: newPasswordOrCode,
        new_password: newPasswordLegacy,
      };
    } else {
      payload = {
        reset_token: tokenOrEmail,
        new_password: newPasswordOrCode,
      };
    }
    const response = await api.post<ResetPasswordResponse>('/auth/reset-password', payload);
    return response.data;
  },

  /** Requests a replacement OTP for an ongoing password reset challenge. */
  resendResetPasswordOtp: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = await api.post<ForgotPasswordResponse>('/auth/reset-password/resend', {
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
