import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axios';

export interface Progress {
  id: string;
  userId: string;
  skillId: string;
  mastery: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

export const useProgress = () => {
  return useQuery({
    queryKey: ['progress'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Progress[] }>('/progress');
      return response.data.data;
    },
  });
};

export const useUpsertProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ skillId, mastery, status }: { skillId: string; mastery: number; status: string }) => {
      const response = await apiClient.put<{ data: Progress }>(`/progress/${skillId}`, {
        mastery,
        status,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });
};
