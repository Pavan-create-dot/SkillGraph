import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/axios';
import type { Skill } from './useSkills';

export interface SkillEdge {
  id: string;
  parentSkillId: string;
  childSkillId: string;
}

export interface SkillGraphData {
  nodes: Skill[];
  edges: SkillEdge[];
}

export const useSkillGraph = () => {
  return useQuery({
    queryKey: ['skills', 'graph'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: SkillGraphData }>('/skills/graph');
      return response.data.data;
    },
  });
};
