import { NextFunction, Request, Response } from 'express';
import {
  BAD_REQUEST, CREATED, NOT_FOUND, OK,
} from '../constants/status-codes';
import { Card } from '../models';
import { AuthRequest } from '../types';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find().populate('owner').populate('likes');
    return res.status(OK).json(cards);
  } catch (error) {
    return next(error);
  }
};

export const createCard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user?._id;

    if (!name || !link) {
      return res.status(BAD_REQUEST).json({
        message: 'Поля (name, link) обязательны для заполнения',
      });
    }

    const card = new Card({ name, link, owner: ownerId });
    const savedCard = await card.save();
    await savedCard.populate('owner');

    return res.status(CREATED).json(savedCard);
  } catch (error) {
    return next(error);
  }
};

export const deleteCard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const userId = req.user?._id;

    const card = await Card.findById(cardId);

    if (!card || card.owner.toString() !== userId) {
      return res.status(NOT_FOUND).json({ message: 'Карточка не найдена' });
    }

    await Card.findByIdAndDelete(cardId);
    return res.status(OK).json({ message: 'Карточка успешно удалена' });
  } catch (error) {
    return next(error);
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
      return res.status(NOT_FOUND).json({ message: 'Карточка не найдена' });
    }

    return res.status(OK).json(card);
  } catch (error) {
    return next(error);
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
      return res.status(BAD_REQUEST).json({ message: 'Карточка не найдена' });
    }

    return res.status(OK).json(card);
  } catch (error) {
    return next(error);
  }
};
