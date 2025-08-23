import { Request, Response } from 'express';
import {
  BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK,
} from '../constants/status-codes';
import { Card } from '../models';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find().populate('owner').populate('likes');
    return res.status(OK).json(cards);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Ошибка при получении карточек', error });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const ownerId = (req as any).user._id;

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
    return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Ошибка при создании карточки', error });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const userId = (req as any).user._id;

    const card = await Card.findById(cardId);

    if (!card || card.owner.toString() !== userId) {
      return res.status(NOT_FOUND).json({ message: 'Карточка не найдена' });
    }

    await Card.findByIdAndDelete(cardId);
    return res.status(OK).json({ message: 'Карточка успешно удалена' });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Ошибка при удалении карточки', error });
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const userId = (req as any).user._id;

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
    return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Ошибка при добавлении лайка', error });
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const userId = (req as any).user._id;

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
    return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Ошибка при удалении лайка', error });
  }
};
