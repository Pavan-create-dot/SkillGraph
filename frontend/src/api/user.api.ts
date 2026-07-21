import type { ApiResponse, User } from '../types';
import apiClient from './axios';

export interface UpdateProfilePayload {
  name: string;
  email: string;
}

export const userApi = {
  updateProfile: async (payload: UpdateProfilePayload): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.put<ApiResponse<User>>('/users/profile', payload);
    return data;
  },
};

export default userApi;
