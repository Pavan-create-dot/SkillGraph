import { Request, Response, NextFunction } from 'express';
import { Role } from '../types';
import { ApiError } from '../utils/ApiError';

/**
 * Role-based access control middleware.
 * Must be used AFTER the authenticate middleware.
 *
 * @param roles - One or more roles permitted to access the route
 */
export const authorize = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('You must be logged in to access this resource'));
    }

    if (!roles.includes(req.user.role as Role)) {
      return next(
        ApiError.forbidden(
          `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`,
        ),
      );
    }

    next();
  };
};
