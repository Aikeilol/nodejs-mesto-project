/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import { Express } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
      };
    }
  }
}

export { };
