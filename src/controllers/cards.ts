import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  CREATED, OK,
} from '../constants/status-codes';
import { Card } from '../models';
import { AuthRequest } from '../types';
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from '../errors';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find().populate('owner').populate('likes');
    res.status(OK).json(cards);
  } catch (error) {
    next(error);
  }
};

export const createCard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user?._id;

    if (!name || !link) {
      throw new ValidationError('Поля (name, link) обязательны для заполнения');
    }

    const card = new Card({ name, link, owner: ownerId });
    const savedCard = await card.save();
    await savedCard.populate('owner');

    res.status(CREATED).json(savedCard);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new ValidationError('Ошибка валидации данных карточки'));
    } else {
      next(error);
    }
  }
};

export const deleteCard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const userId = req.user?._id;

    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    if (card.owner.toString() !== userId) {
      throw new ForbiddenError('Нельзя удалить чужую карточку');
    }

    await Card.findByIdAndDelete(cardId);
    res.status(OK).json({ message: 'Карточка успешно удалена' });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(new ValidationError('Некорректный идентификатор карточки'));
    } else {
      next(error);
    }
  }
};

export const likeCard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const userId = req.user?._id;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true, runValidators: true },
    ).populate(['owner', 'likes']);

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.status(OK).json(card);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(new ValidationError('Некорректный идентификатор карточки'));
    } else if (error instanceof mongoose.Error.ValidationError) {
      next(new ValidationError('Ошибка валидации данных'));
    } else {
      next(error);
    }
  }
};

export const dislikeCard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const userId = req.user?._id;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true, runValidators: true },
    ).populate(['owner', 'likes']);

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.status(OK).json(card);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(new ValidationError('Некорректный идентификатор карточки'));
    } else if (error instanceof mongoose.Error.ValidationError) {
      next(new ValidationError('Ошибка валидации данных'));
    } else {
      next(error);
    }
  }
};
