import apiClient from './axios';
import type { ApiResponse, AuthResult, AuthTokens, User } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<ApiResponse<AuthResult>> => {
    const { data } = await apiClient.post<ApiResponse<AuthResult>>('/auth/register', payload);
    return data;
  },

  login: async (payload: LoginPayload): Promise<ApiResponse<AuthResult>> => {
    const { data } = await apiClient.post<ApiResponse<AuthResult>>('/auth/login', payload);
    return data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.post<ApiResponse<null>>('/auth/logout');
    return data;
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthTokens>> => {
    const { data } = await apiClient.post<ApiResponse<AuthTokens>>('/auth/refresh', {
      refreshToken,
    });
    return data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.get<ApiResponse<User>>('/users/profile');
    return data;
  },
};

export default authApi;
