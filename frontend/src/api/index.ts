import apiClient from './axios';
import type { ApiResponse, PaginatedResponse, Skill, CareerGoal } from '../types';

export const skillsApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
  }): Promise<ApiResponse<PaginatedResponse<Skill>>> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Skill>>>('/skills', {
      params,
    });
    return data;
  },

  getCategories: async (): Promise<ApiResponse<string[]>> => {
    const { data } = await apiClient.get<ApiResponse<string[]>>('/skills/categories');
    return data;
  },
};

export const careerGoalsApi = {
  list: async (): Promise<ApiResponse<CareerGoal[]>> => {
    const { data } = await apiClient.get<ApiResponse<CareerGoal[]>>('/career-goals');
    return data;
  },

  select: async (careerGoalId: string): Promise<ApiResponse<CareerGoal>> => {
    const { data } = await apiClient.post<ApiResponse<CareerGoal>>('/career-goals/select', {
      careerGoalId,
    });
    return data;
  },
};

export default { skillsApi, careerGoalsApi };
