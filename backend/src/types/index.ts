import { Request } from 'express';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}


export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}
