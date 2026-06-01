import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../errors/ApiError.js';

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      next(ApiError.unauthorized('Missing authorization token'));
      return;
    }

    const token = header.slice(7);
    jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
};
