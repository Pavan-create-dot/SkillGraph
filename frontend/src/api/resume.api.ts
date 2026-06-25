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

  /** Analyze via file upload (PDF or TXT). */
  analyzeResumeFile: async (file: File): Promise<ApiResponse<ResumeData>> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post<ApiResponse<ResumeData>>('/resume/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /** Analyze via raw text (backward compat / plain-text fallback). */
  analyzeResume: async (resumeText: string): Promise<ApiResponse<ResumeData>> => {
    const { data } = await apiClient.post<ApiResponse<ResumeData>>('/resume/analyze', { resumeText });
    return data;
  },
};

export default resumeApi;
