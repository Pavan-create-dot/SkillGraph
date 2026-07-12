// API base types shared across frontend

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  statusCode: number;
  timestamp: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export type Role = 'ADMIN' | 'USER';

export type SkillDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string | null;
  difficulty: SkillDifficulty;
  createdAt: string;
  updatedAt: string;
}

export interface CareerGoal {
  id: string;
  name: string;
  description: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: User;
  tokens: AuthTokens;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
