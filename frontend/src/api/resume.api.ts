import type { ApiResponse, ParsedResume, ResumeAnalysis } from '../types';
import apiClient from './axios';

export interface ResumeData {
  resumeText: string | null;
  parsed: ParsedResume | null;
  analysis: ResumeAnalysis | null;
  targetRole: string;
}

export const resumeApi = {
  getResume: async (): Promise<ApiResponse<ResumeData>> => {
    const { data } = await apiClient.get<ApiResponse<ResumeData>>('/resume');
    return data;
  },
  analyzeResume: async (resumeText: string): Promise<ApiResponse<ResumeData>> => {
    const { data } = await apiClient.post<ApiResponse<ResumeData>>('/resume/analyze', { resumeText });
    return data;
  },
};

export default resumeApi;
