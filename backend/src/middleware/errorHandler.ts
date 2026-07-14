import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error & { status?: number; statusCode?: number }, _req: Request, res: Response, _next: NextFunction): void {
  const status = err.status || err.statusCode || 500;
  console.error('Unhandled error:', err.message);
  res.status(status).json({ status, message: status === 500 ? 'Internal server error' : err.message });
}
