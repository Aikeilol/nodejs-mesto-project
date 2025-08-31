import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UNAUTHORIZED } from '../constants/status-codes';

const JWT_SECRET = 'secret-key';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(UNAUTHORIZED).json({ message: 'Необходима авторизация' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
    req.user = { _id: decoded._id };
    return next();
  } catch (error) {
    return res.status(UNAUTHORIZED).json({ message: 'Неверный или просроченный токен' });
  }
};
