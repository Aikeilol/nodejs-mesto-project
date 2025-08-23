import { Request, Response } from 'express';
import {
  BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK,
} from '../constants/status-codes';
import { User } from '../models';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(OK).json(users);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Ошибка при получении пользователей', error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(NOT_FOUND).json({ message: 'Пользователь не найден' });
    }

    return res.status(OK).json(user);
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(BAD_REQUEST).json({ message: 'Некорректный ID пользователя' });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Ошибка при получении пользователя', error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;

    if (!name || !about || !avatar) {
      return res.status(400).json({
        message: 'Поля (name, about, avatar) обязательны для заполнения',
      });
    }

    const user = new User({ name, about, avatar });
    const savedUser = await user.save();

    return res.status(CREATED).json(savedUser);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(BAD_REQUEST).json({
        message: 'Ошибка валидации',
      });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Ошибка при создании пользователя', error });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { name, about } = req.body;

    if (!name || !about) {
      return res.status(BAD_REQUEST).json({
        message: 'Поля (name, about) обязательны для заполнения',
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(NOT_FOUND).json({ message: 'Пользователь не найден' });
    }

    return res.status(OK).json(user);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Ошибка при обновлении профиля', error });
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(BAD_REQUEST).json({
        message: 'Поле avatar обязательно для заполнения',
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(NOT_FOUND).json({ message: 'Пользователь не найден' });
    }

    return res.status(OK).json(user);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Ошибка при обновлении аватара', error });
  }
};
