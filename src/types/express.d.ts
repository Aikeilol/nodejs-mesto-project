/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import { Express } from 'express';

declare global {
  namespace Express {
    interface User {
      _id: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export { };
