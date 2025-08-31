import { Request, Response, NextFunction } from 'express';
import { requestLogger } from '../logger';

const logRequests = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    const logData = {
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      params: req.params,
      body: req.body,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    };

    if (logData.body && logData.body.password) {
      logData.body = { ...logData.body, password: '***' };
    }

    requestLogger.info('Request', logData);
  });

  next();
};

export default logRequests;
