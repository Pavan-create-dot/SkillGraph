import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axios';
import type { Skill } from './useSkills';
import type { SkillEdge } from './useSkillGraph';

// ── Types ────────────────────────────────────────────────────────────────────

export interface RoadmapGenerateInput {
  topic: string;
  currentLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  goalType: 'GET_JOB' | 'SIDE_PROJECT' | 'CURIOSITY' | 'ACADEMIC';
  hoursPerWeek: number;
}

export interface RoadmapStatus {
  hasRoadmap: boolean;
  topic: string | null;
}

export interface MyRoadmap {
  topic: string;
  nodes: Skill[];
  edges: SkillEdge[];
}

// ── Hooks ────────────────────────────────────────────────────────────────────

/** Check if the current user already has a roadmap */
export const useRoadmapStatus = () => {
  return useQuery({
    queryKey: ['roadmap', 'status'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: RoadmapStatus }>('/roadmap/status');
      return response.data.data;
    },
  });
};

/** Get the user's personal roadmap (skills + edges) */
export const useMyRoadmap = (enabled = true) => {
  return useQuery({
    queryKey: ['roadmap', 'mine'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: MyRoadmap }>('/roadmap/mine');
      return response.data.data;
    },
    enabled,
    retry: false,
  });
};

/** Generate a new roadmap via Gemini AI */
export const useGenerateRoadmap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RoadmapGenerateInput) => {
      const response = await apiClient.post<{ data: { roadmapTitle: string; skillCount: number } }>(
        '/roadmap/generate',
        input,
      );
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate all roadmap and skills queries so graph reloads
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
};
