import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { validateCreateCard, validateId } from '../middleware/validation';

const router = Router();

router.get('/', auth, getCards);
router.post('/', auth, validateCreateCard, createCard);
router.delete('/:cardId', auth, validateId, deleteCard);
router.put('/:cardId/likes', auth, validateId, likeCard);
router.delete('/:cardId/likes', auth, validateId, dislikeCard);

export default router;
