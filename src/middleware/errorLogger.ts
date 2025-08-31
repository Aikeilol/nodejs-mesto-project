import { Request, Response, NextFunction } from 'express';
import { errorLogger } from '../logger';

const logErrors = (error: Error, req: Request, res: Response, next: NextFunction) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body,
    query: req.query,
    params: req.params,
    timestamp: new Date().toISOString(),
  };

  if (errorData.body && errorData.body.password) {
    errorData.body = { ...errorData.body, password: '***' };
  }

  errorLogger.error('Error', errorData);

  next(error);
};

export default logErrors;
