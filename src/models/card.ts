import mongoose, { Document, Model, Types } from 'mongoose';

export interface ICard extends Document {
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    required: [true, 'Поле "name" обязательно для заполнения'],
    minlength: [2, 'Минимальная длина поля "name" - 2 символа'],
    maxlength: [30, 'Максимальная длина поля "name" - 30 символов'],
  },
  link: {
    type: String,
    required: [true, 'Поле "link" обязательно для заполнения'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле "owner" обязательно для заполнения'],
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Card: Model<ICard> = mongoose.model<ICard>('card', cardSchema);
