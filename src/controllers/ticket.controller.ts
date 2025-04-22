import { Request, Response } from 'express';
import { Ticket } from '@models/ticket.model';
import { publishToQueue } from '@config/rabbit';
import { redis } from '@config/redis'; // ✅ updated to match your file
import { sendSuccessResponse, sendErrorResponse } from '@common/helpers/response';
import { MESSAGES } from '@common/constants/messages';
import { HTTP_STATUS } from '@common/constants/httpStatus';

// Create a new support ticket
export const createTicket = async (req: Request, res: Response) => {
  try {
    const {id: userId, email: userEmail}= (req as any).user;
  //  console.log(userId, userEmail);
    const { subject, description } = req.body;

    const ticket = await Ticket.create({ subject, description, user: userId });

    // 🔁 Notify via RabbitMQ
    await publishToQueue('ticket_created', {
      ticketId: ticket._id,
      subject: ticket.subject,
      // userId,
      userEmail
    });

    // 🚀 Cache in Redis (keep only 10 most recent)
    await redis.lpush('recent_tickets', JSON.stringify(ticket));
    await redis.ltrim('recent_tickets', 0, 9);

     sendSuccessResponse(res, MESSAGES.TICKET.CREATED, ticket, HTTP_STATUS.CREATED);
  } catch (error:any) {
    sendErrorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// Get all tickets of the current user
export const getUserTickets = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const tickets = await Ticket.find({ user: userId });
    sendSuccessResponse(res, MESSAGES.TICKET.FETCHED, tickets, HTTP_STATUS.OK);
  } catch (error: any) {
     sendErrorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// Get a specific ticket by ID (only if owned by current user)
export const getTicketById = async (req: Request, res: Response):Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const ticket = await Ticket.findOne({ _id: req.params.id, user: userId });

    if (!ticket) {
       sendErrorResponse(res, MESSAGES.TICKET.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
       return;
    }

    sendSuccessResponse(res, MESSAGES.TICKET.FETCHED, ticket, HTTP_STATUS.OK);
  } catch (error:any) {
    sendErrorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// Get the most recent 10 tickets from Redis
export const getRecentTickets = async (_req: Request, res: Response) => {
  try {
    const cached = await redis.lrange('recent_tickets', 0, 9); // ✅ using redis here
    const tickets = cached.map((t: string) => JSON.parse(t));
    sendSuccessResponse(res, MESSAGES.TICKET.FETCHED, tickets, HTTP_STATUS.OK);
  } catch (error:any) {
    sendErrorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
