import { Request, Response, NextFunction } from 'express';
import { NOT_FOUND } from '../constants/status-codes';

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(NOT_FOUND).json({ message: 'Not found' });
  next();
};

export default notFoundHandler;
