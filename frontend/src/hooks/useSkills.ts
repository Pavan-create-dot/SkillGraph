import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/axios';
import type { Skill } from '../types';
export type { Skill } from '../types';

interface PaginatedSkillsResponse {
  data: {
    data: Skill[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useSkills = (page: number = 1, limit: number = 20, category?: string) => {
  return useQuery({
    queryKey: ['skills', { page, limit, category }],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedSkillsResponse>('/skills', {
        params: { page, limit, category },
      });
      return response.data.data;
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['skills', 'categories'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: string[] }>('/skills/categories');
      return response.data.data;
    },
  });
};
