import express, {
  Application, NextFunction, Request, Response,
} from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import notFoundHandler from './middleware/notFoundHandler';

const app: Application = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/mestodb';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '68a9d013c7bcfe614c28ef7a',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', notFoundHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
