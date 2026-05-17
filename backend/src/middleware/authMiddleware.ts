import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { ENV } from '../config/env';
import { JWT_COOKIE_NAME, UserRole } from '../constants';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

const jwtPayloadSchema = z.object({
  id: z.string(),
  role: z.nativeEnum(UserRole),
});

export const protect = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies[JWT_COOKIE_NAME] as string | undefined;

    if (!token) throw ApiError.unauthorized('Authentication required');

    const raw = jwt.verify(token, ENV.JWT_SECRET);
    const result = jwtPayloadSchema.safeParse(raw);

    if (!result.success) throw ApiError.unauthorized('Invalid token');

    req.user = { id: result.data.id, role: result.data.role };
    next();
  }
);
