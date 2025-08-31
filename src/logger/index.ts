import winston from 'winston';
import path from 'path';

const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

export const requestLogger = winston.createLogger({
  level: 'info',
  format: jsonFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../../request.log'),
      level: 'info',
    }),
  ],
});

export const errorLogger = winston.createLogger({
  level: 'error',
  format: jsonFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../../error.log'),
      level: 'error',
    }),
  ],
});
