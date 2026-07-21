import { createContext } from 'react';
import type { ApiResponse, User } from '../types';

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<ApiResponse<User>>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
