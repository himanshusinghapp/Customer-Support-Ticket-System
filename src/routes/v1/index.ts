import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import ticketRoutes from './ticket.routes';
import replyRoutes from './reply.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tickets', ticketRoutes);
router.use('/replies', replyRoutes);

export default router;
