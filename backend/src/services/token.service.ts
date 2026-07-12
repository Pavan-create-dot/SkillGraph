import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload, Role, TokenPair } from '../types';
import { ApiError } from '../utils/ApiError';

export class TokenService {
  generateAccessToken(payload: { id: string; email: string; role: Role }): string {
    return jwt.sign(
      {
        sub: payload.id,
        email: payload.email,
        role: payload.role,
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
    );
  }

  generateRefreshToken(payload: { id: string; email: string; role: Role }): string {
    return jwt.sign(
      {
        sub: payload.id,
        email: payload.email,
        role: payload.role,
      },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
    );
  }

  generateTokenPair(payload: { id: string; email: string; role: Role }): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw ApiError.unauthorized('Access token has expired');
      }
      throw ApiError.unauthorized('Invalid access token');
    }
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw ApiError.unauthorized('Refresh token has expired. Please log in again.');
      }
      throw ApiError.unauthorized('Invalid refresh token');
    }
  }
}

export const tokenService = new TokenService();
