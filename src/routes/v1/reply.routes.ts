import { Router } from 'express';
import { addReply, getReplies } from '@controllers/reply.controller';
import { authenticate } from '@middleware/auth.middleware';

const router = Router();

router.post('/:ticketId/reply', authenticate, addReply);
router.get('/:ticketId/replies', authenticate, getReplies);

export default router;
