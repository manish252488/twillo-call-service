import { Request, Response, NextFunction } from 'express';

export const responseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;

  res.json = function (body: any) {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      if (body && typeof body === 'object' && 'success' in body) {
        return originalJson.call(this, body);
      }
      return originalJson.call(this, {
        success: true,
        data: body,
      });
    }

    return originalJson.call(this, body);
  };

  next();
};

