import { celebrate, Joi, Segments } from 'celebrate';

export const validateCreateUser = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
});

export const validateLogin = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export const validateUpdateProfile = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
});

export const validateUpdateAvatar = celebrate({
  [Segments.BODY]: Joi.object({
    avatar: Joi.string().uri().required(),
  }),
});

export const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri().required(),
  }),
});

export const validateId = celebrate({
  [Segments.PARAMS]: Joi.object({
    userId: Joi.string().hex().length(24),
    cardId: Joi.string().hex().length(24),
  }),
});
