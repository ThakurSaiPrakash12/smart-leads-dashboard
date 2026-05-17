import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';

interface ErrorBody {
  success: false;
  message: string;
  errors?: string[];
  stack?: string;
}

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isDev = process.env.NODE_ENV === 'development';
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: string[] | undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => e.message);
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: unknown }).code === 11000
  ) {
    statusCode = 409;
    const field = Object.keys(
      (err as { code: unknown; keyValue: Record<string, unknown> }).keyValue ?? {}
    )[0];
    message = `${field ?? 'Field'} already exists`;
  } else if (err instanceof jwt.JsonWebTokenError) {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = 'Token has expired';
  }

  const body: ErrorBody = { success: false, message };
  if (errors) body.errors = errors;
  if (isDev && err instanceof Error) body.stack = err.stack;

  res.status(statusCode).json(body);
};
