import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';
import { tokenService } from './token.service';
import { hashPassword, comparePassword } from '../utils/hashPassword';
import { ApiError } from '../utils/ApiError';
import { Role, TokenPair } from '../types';
import { RegisterInput, LoginInput, RefreshTokenInput } from '../validators/auth.validator';
import { blacklistedTokenRepository } from '../repositories/blacklistedToken.repository';

export interface AuthResult {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
  tokens: TokenPair;
}

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResult> {
    const emailExists = await userRepository.existsByEmail(input.email);

    if (emailExists) {
      throw ApiError.conflict('An account with this email address already exists');
    }

    const hashedPassword = await hashPassword(input.password);

    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: Role.USER,
    });

    const tokens = tokenService.generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role as Role,
    });

    return { user, tokens };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await userRepository.findByEmailWithPassword(input.email);

    if (!user) {
      // Use same error to prevent email enumeration
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(input.password, user.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const tokens = tokenService.generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role as Role,
    });

    const safeUser = { ...user };
    delete (safeUser as { password?: string }).password;

    return { user: safeUser, tokens };
  }

  async refreshToken(input: RefreshTokenInput): Promise<TokenPair> {
    const isRevoked = await blacklistedTokenRepository.isBlacklisted(input.refreshToken);
    if (isRevoked) {
      throw ApiError.unauthorized('Token has been revoked');
    }

    const payload = tokenService.verifyRefreshToken(input.refreshToken);

    const user = await userRepository.findById(payload.sub);

    if (!user) {
      throw ApiError.unauthorized('User associated with this token no longer exists');
    }

    return tokenService.generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role as Role,
    });
  }

  async logout(accessToken: string | null, refreshToken: string | null): Promise<void> {
    const now = new Date();

    if (accessToken) {
      try {
        const decoded = jwt.decode(accessToken) as { exp?: number };
        const expiresAt =
          decoded && decoded.exp
            ? new Date(decoded.exp * 1000)
            : new Date(now.getTime() + 15 * 60 * 1000);
        await blacklistedTokenRepository.add(accessToken, expiresAt);
      } catch {
        // Safe catch-all
      }
    }

    if (refreshToken) {
      try {
        const decoded = jwt.decode(refreshToken) as { exp?: number };
        const expiresAt =
          decoded && decoded.exp
            ? new Date(decoded.exp * 1000)
            : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        await blacklistedTokenRepository.add(refreshToken, expiresAt);
      } catch {
        // Safe catch-all
      }
    }
  }
}

export const authService = new AuthService();
