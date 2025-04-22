import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '@controllers/user.controller';
import { authenticate } from '@middleware/auth.middleware';

const router = Router();

router.get('/me', authenticate, getUserProfile);
router.patch('/me', authenticate, updateUserProfile);

export default router;
