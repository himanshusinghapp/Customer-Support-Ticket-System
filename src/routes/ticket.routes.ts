import { Router } from 'express';
import {
  createTicket,
  getUserTickets,
  getTicketById,
  getRecentTickets
} from '../controllers/ticket.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createTicket);
router.get('/', authenticate, getUserTickets);
router.get('/recent', authenticate, getRecentTickets);
router.get('/:id', authenticate, getTicketById);

export default router;
