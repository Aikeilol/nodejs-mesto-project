import express, {
  Application,
} from 'express';
// import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import notFoundHandler from './middleware/notFoundHandler';
import { createUser, login } from './controllers/users';
import logRequests from './middleware/requestLogger';
import logErrors from './middleware/errorLogger';
import errorHandler from './middleware/errorHandler';

const app: Application = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/mestodb';
// отключить корс
// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(logRequests);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.post('/signin', login);
app.post('/signup', createUser);
app.use('*path', notFoundHandler);

app.use(logErrors);
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
