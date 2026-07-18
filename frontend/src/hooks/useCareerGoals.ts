import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axios';

export interface CareerGoal {
  id: string;
  name: string;
  description: string | null;
}

export const useCareerGoals = () => {
  return useQuery({
    queryKey: ['career-goals'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: CareerGoal[] }>('/career-goals');
      return response.data.data;
    },
  });
};

export const useUpdateSelectedCareerGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (careerGoalId: string | null) => {
      const response = await apiClient.put('/users/career-goal', { careerGoalId });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate user profile so the selectedCareerGoalId is updated if we fetch it
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
};
