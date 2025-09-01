import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  CREATED, OK,
} from '../constants/status-codes';
import { AuthRequest } from '../types';
import { User } from '../models';
import {
  AuthError,
  NotFoundError,
} from '../errors';

const JWT_SECRET = 'secret-key';
const JWT_EXPIRES_IN = '7d';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.status(OK).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.status(OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    const user = new User({
      name, about, avatar, password, email,
    });
    const savedUser = await user.save();

    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      about: savedUser.about,
      avatar: savedUser.avatar,
      email: savedUser.email,
    };

    res.status(CREATED).json(userResponse);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.status(OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUsersMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.status(OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserAvatar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.status(OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AuthError('Неправильные почта или пароль');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AuthError('Неправильные почта или пароль');
    }

    const token = jwt.sign(
      { _id: user._id?.toString() },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 604800000,
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    };

    res.status(OK).json({
      message: 'Успешная авторизация',
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};
