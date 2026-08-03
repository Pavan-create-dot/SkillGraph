import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/auth.validator';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { body } = registerSchema.parse({ body: req.body });
  const result = await authService.register(body);

  res.status(201).json(new ApiResponse(201, 'Account created successfully', result));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { body } = loginSchema.parse({ body: req.body });
  const result = await authService.login(body);

  res.status(200).json(ApiResponse.ok('Logged in successfully', result));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const accessToken =
    authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const { refreshToken } = req.body;

  await authService.logout(accessToken, refreshToken);

  res.status(200).json(ApiResponse.ok('Logged out successfully'));
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { body } = refreshTokenSchema.parse({ body: req.body });
  const tokens = await authService.refreshToken(body);

  res.status(200).json(ApiResponse.ok('Token refreshed successfully', tokens));
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { credential } = req.body as { credential: string };

  if (!credential) {
    return res.status(400).json({ success: false, message: 'Google credential token is required' });
  }

  // Import dynamically to avoid breaking the build if google-auth-library is not installed
  const { OAuth2Client } = await import('google-auth-library');
  const env = (await import('../config/env')).env;

  const clientId = env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ success: false, message: 'Google Sign-In is not configured on this server' });
  }

  const client = new OAuth2Client(clientId);

  let payload: { email?: string; name?: string; given_name?: string; family_name?: string };
  try {
    const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });
    payload = ticket.getPayload() ?? {};
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid Google token' });
  }

  if (!payload.email) {
    return res.status(400).json({ success: false, message: 'Google account has no email' });
  }

  const name = payload.name || `${payload.given_name ?? ''} ${payload.family_name ?? ''}`.trim() || payload.email.split('@')[0];
  const result = await authService.googleLogin(payload.email, name);

  return res.status(200).json(ApiResponse.ok('Google login successful', result));
});

