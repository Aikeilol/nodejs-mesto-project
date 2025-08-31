import { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  AppError,
} from '../errors';
import { errorLogger } from '../logger';
import {
  BAD_REQUEST,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} from '../constants/status-codes';

interface ErrorResponse {
  message: string;
  errors?: string[];
  stack?: string;
}

const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
) => {
  let statusCode = INTERNAL_SERVER_ERROR;
  let message = 'Внутренняя ошибка сервера';
  let errors: string[] | undefined;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = BAD_REQUEST;
    message = 'Ошибка валидации';
    errors = Object.values(error.errors).map((err) => err.message);
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = BAD_REQUEST;
    message = 'Некорректный идентификатор';
  } else if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    statusCode = CONFLICT;
    message = 'Пользователь с таким email уже существует';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = UNAUTHORIZED;
    message = 'Неверный токен';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = UNAUTHORIZED;
    message = 'Токен истек';
  }

  const errorResponse: ErrorResponse = { message };

  if (errors) {
    errorResponse.errors = errors;
  }

  errorLogger.error('Error handled', {
    message: error.message,
    statusCode,
    url: req.originalUrl,
    method: req.method,
    stack: error.stack,
  });

  res.status(statusCode).json(errorResponse);
};

export default errorHandler;
