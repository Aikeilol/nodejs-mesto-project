import mongoose, { Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Поле "name" обязательно для заполнения'],
    minlength: [2, 'Минимальная длина поля "name" - 2 символа'],
    maxlength: [30, 'Максимальная длина поля "name" - 30 символов'],
  },
  about: {
    type: String,
    required: [true, 'Поле "about" обязательно для заполнения'],
    minlength: [2, 'Минимальная длина поля "about" - 2 символа'],
    maxlength: [200, 'Максимальная длина поля "about" - 200 символов'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле "avatar" обязательно для заполнения'],
  },
});

export const User: Model<IUser> = mongoose.model<IUser>('user', userSchema);
