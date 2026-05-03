import type { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';

export const errorsMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const boomError = Boom.isBoom(error) ? error : Boom.boomify(error);
  const payload = {
    ...boomError.output.payload,
    message: boomError.message,
  };
  return res.status(boomError.output.statusCode).json(payload);
};