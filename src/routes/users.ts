import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getUsersMe,
} from '../controllers/users';
import {
  validateUpdateProfile,
  validateUpdateAvatar,
  validateId,
} from '../middleware/validation';

const router = Router();

router.get('/me', auth, getUsersMe);
router.get('/', auth, getUsers);
router.get('/:userId', auth, validateId, getUserById);
router.patch('/me', auth, validateUpdateProfile, updateUserProfile);
router.patch('/me/avatar', auth, validateUpdateAvatar, updateUserAvatar);

export default router;
