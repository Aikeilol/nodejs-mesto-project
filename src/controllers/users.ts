import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import {
  BAD_REQUEST, CREATED, NOT_FOUND, OK, UNAUTHORIZED,
} from '../constants/status-codes';
import { AuthRequest } from '../types';
import { User } from '../models';
import { avatarRegex } from '../models/user';

const JWT_SECRET = 'secret-key';
const JWT_EXPIRES_IN = '7d';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    return res.status(OK).json(users);
  } catch (error) {
    return next(error);
  }
};

export const getUserById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(NOT_FOUND).json({ message: 'Пользователь не найден' });
    }

    return res.status(OK).json(user);
  } catch (error) {
    return next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    if (!email || !password) {
      return res.status(BAD_REQUEST).json({
        message: 'Поля (email, password) обязательны для заполнения',
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(BAD_REQUEST).json({ message: 'Некорректный формат email' });
    }

    if (password.length < 6) {
      return res.status(BAD_REQUEST).json({ message: 'Неверный пароль' });
    }

    if (avatar && !avatarRegex.test(avatar)) {
      res.status(BAD_REQUEST).json({ message: 'Некорректный URL аватара' });
    }

    const user = new User({
      name, about, avatar, password, email,
    });
    const savedUser = (await user.save());

    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      about: savedUser.about,
      avatar: savedUser.avatar,
      email: savedUser.email,
    };

    return res.status(CREATED).json(userResponse);
  } catch (error) {
    return next(error);
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
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
    return next(error);
  }
};

export const getUsersMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;

    const user = await User.findById(
      userId,
    );

    if (!user) {
      return res.status(NOT_FOUND).json({ message: 'Пользователь не найден' });
    }

    return res.status(OK).json(user);
  } catch (error) {
    return next(error);
  }
};

export const updateUserAvatar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(BAD_REQUEST).json({
        message: 'Поле avatar обязательно для заполнения',
      });
    }

    if (!avatarRegex.test(avatar)) {
      res.status(BAD_REQUEST).json({ message: 'Некорректный URL аватара' });
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
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(BAD_REQUEST).json({
        message: 'Email и пароль обязательны для заполнения',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(UNAUTHORIZED).json({ message: 'Неправильные почта или пароль' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(UNAUTHORIZED).json({ message: 'Неправильные почта или пароль' });
    }

    const token = jwt.sign(
      { _id: user._id?.toString() },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 604800000, // 7 дней
      secure: true,
      sameSite: 'strict',
    });

    const savedUser = user.toObject();
    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      about: savedUser.about,
      avatar: savedUser.avatar,
      email: savedUser.email,
    };

    return res.status(OK).json({
      message: 'Успешная авторизация',
      user: userResponse,
    });
  } catch (error) {
    return next(error);
  }
};
