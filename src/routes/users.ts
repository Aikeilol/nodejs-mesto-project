import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getUsersMe,
} from '../controllers/users';

const router = Router();

router.get('/me', auth, getUsersMe);
router.get('/', auth, getUsers);
router.get('/:userId', auth, getUserById);
router.patch('/me', auth, updateUserProfile);
router.patch('/me/avatar', auth, updateUserAvatar);

export default router;
