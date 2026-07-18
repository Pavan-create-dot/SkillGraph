import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/axios';
import type { Skill } from './useSkills';

export const usePrerequisites = (skillId: string | null) => {
  return useQuery({
    queryKey: ['graph', 'prerequisites', skillId],
    queryFn: async () => {
      if (!skillId) return [];
      const response = await apiClient.get<{ data: Skill[] }>(`/graph/prerequisites/${skillId}`);
      return response.data.data;
    },
    enabled: !!skillId,
  });
};

export const useSkillTree = (skillId: string | null) => {
  return useQuery({
    queryKey: ['graph', 'tree', skillId],
    queryFn: async () => {
      if (!skillId) return [];
      const response = await apiClient.get<{ data: Skill[] }>(`/graph/tree/${skillId}`);
      return response.data.data;
    },
    enabled: !!skillId,
  });
};

export const useTopologicalOrder = () => {
  return useQuery({
    queryKey: ['graph', 'topological-order'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Skill[] }>('/graph/topological-order');
      return response.data.data;
    },
  });
};

export const useShortestPath = (fromId: string | null, toId: string | null) => {
  return useQuery({
    queryKey: ['graph', 'path', fromId, toId],
    queryFn: async () => {
      if (!fromId || !toId) return [];
      const response = await apiClient.get<{ data: Skill[] }>(`/graph/path?from=${fromId}&to=${toId}`);
      return response.data.data;
    },
    enabled: !!fromId && !!toId,
  });
};
