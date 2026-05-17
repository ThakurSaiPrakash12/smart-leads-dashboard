import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { JWT_COOKIE_NAME, HTTP_STATUS } from '../constants';
import { ENV } from '../config/env';
import type { RegisterInput, LoginInput } from '../validators/auth.validators';

const COOKIE_MAX_AGE = ENV.COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

type RegisterRequest = Request<{}, {}, RegisterInput>;
type LoginRequest = Request<{}, {}, LoginInput>;

export const register = asyncHandler(async (req: RegisterRequest, res: Response): Promise<void> => {
  const user = await AuthService.register(req.body);
  res.status(HTTP_STATUS.CREATED).json(ApiResponse.ok(user, 'Account created successfully'));
});

export const login = asyncHandler(async (req: LoginRequest, res: Response): Promise<void> => {
  const { user, token } = await AuthService.login(req.body);
  const isSecureCookie = ENV.CLIENT_URL.startsWith('https://');
  res.cookie(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isSecureCookie,
    sameSite: isSecureCookie ? 'none' : 'lax',
    maxAge: COOKIE_MAX_AGE,
  });
  // Token stays in the cookie — not returned in body to avoid XSS exposure
  res.status(HTTP_STATUS.OK).json(ApiResponse.ok({ user }, 'Login successful'));
});

export const logout = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const isSecureCookie = ENV.CLIENT_URL.startsWith('https://');
  res.clearCookie(JWT_COOKIE_NAME, {
    httpOnly: true,
    secure: isSecureCookie,
    sameSite: isSecureCookie ? 'none' : 'lax',
  });
  res.status(HTTP_STATUS.OK).json(ApiResponse.ok(null, 'Logged out successfully'));
});

export const getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await AuthService.getMe(req.user!.id);
  res.status(HTTP_STATUS.OK).json(ApiResponse.ok(user, 'User retrieved successfully'));
});

