import type { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler<
  Params = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
  Locals extends Record<string, unknown> = Record<string, unknown>
> = (
  req: Request<Params, ResBody, ReqBody, ReqQuery, Locals>,
  res: Response<ResBody, Locals>,
  next: NextFunction
) => Promise<void>;

export const asyncHandler = <
  Params = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
  Locals extends Record<string, unknown> = Record<string, unknown>
>(
  fn: AsyncRequestHandler<Params, ResBody, ReqBody, ReqQuery, Locals>
): RequestHandler<Params, ResBody, ReqBody, ReqQuery, Locals> =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
