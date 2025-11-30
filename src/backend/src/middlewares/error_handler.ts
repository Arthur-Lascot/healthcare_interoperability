import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    req.log.warn({ err, path: req.path }, "AppError");
    res.statusCode = err.statusCode;
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  if (err.name === 'JsonWebTokenError') {
    req.log.warn({ err, path: req.path }, "JsonWebTokenError");
    res.statusCode = 401;
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    req.log.warn({ err, path: req.path }, "TokenExpiredError");
    res.statusCode = 401;
    return res.status(401).json({
      status: 'error',
      message: 'Token expired'
    });
  }

  req.log.error({ err, path: req.path }, "Unexpected error");
  res.statusCode = 500;
  return res.status(500).json({
    status: 'error',
    message: err.message, ...{ stack: err.stack }
  });
};