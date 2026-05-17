import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError';

type RequestTarget = 'body' | 'query' | 'params';

export const validateRequest = (schema: ZodSchema, target: RequestTarget = 'body'): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = result.error.errors.map(
        (e) => `${e.path.join('.') || target}: ${e.message}`
      );
      return next(ApiError.validation('Validation failed', errors));
    }

    if (target === 'body') req.body = result.data;
    else if (target === 'query') req.query = result.data as typeof req.query;
    else if (target === 'params') req.params = result.data as typeof req.params;

    next();
  };
