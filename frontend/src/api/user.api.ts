import type { ApiResponse, User } from '../types';
import apiClient from './axios';

export interface UpdateProfilePayload {
  name: string;
  email: string;
  targetRole?: string | null;
}

export const userApi = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.get<ApiResponse<User>>('/users/profile');
    return data;
  },
  updateProfile: async (payload: UpdateProfilePayload): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.put<ApiResponse<User>>('/users/profile', payload);
    return data;
  },
};

export default userApi;
