import { Request, Response } from 'express';
import { Reply } from '@models/reply.model';
import { sendSuccessResponse, sendErrorResponse } from '@common/helpers/response';
import { MESSAGES } from '@common/constants/messages';
import { HTTP_STATUS } from '@common/constants/httpStatus';
import { publishToQueue } from '@config/rabbit';
import { Ticket } from '@models/ticket.model';
//import { User } from '@models/user.model';

export const addReply = async (req: Request, res: Response):Promise<void> => {
  try{
    const {id: userId, email: userEmail}= (req as any).user;
  const { message } = req.body;
  const { ticketId } = req.params;

  const reply = await Reply.create({
    message,
    user: userId,
    ticket: ticketId,
  });

  await publishToQueue('ticket_replied', {
        ticketId: ticketId,
        replyMessage: message,
        userEmail: userEmail,
      });

//   const ticket = await Ticket.findById(ticketId).populate('user');

//   if (!ticket) {
//     sendErrorResponse(res, 'Ticket not found', HTTP_STATUS.NOT_FOUND);
//     return;
//   }

//   const user = ticket.user as any; // cast to `any` for now
// const userEmail = user?.email;

// if (!userEmail) {
//   console.warn('❌ No email found for ticket user');
// } else {
//   await publishToQueue('ticket_replied', {
//     ticketId: ticket._id,
//     replyMessage: message,
//     userEmail: userEmail,
//   });
// }
  //res.status(201).json(reply);
  sendSuccessResponse(res, MESSAGES.REPLY.ADDED, reply, HTTP_STATUS.CREATED)
   }catch (error: any) {
     sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
     return;
  }
};

export const getReplies = async (req: Request, res: Response):Promise<void> => {
  try {
    const { ticketId } = req.params;
    const replies = await Reply.find({ ticket: ticketId }).populate('user', 'name');

     sendSuccessResponse(res, MESSAGES.REPLY.FETCHED, replies, HTTP_STATUS.OK);
     return;
  } catch (error: any) {
    sendErrorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    return;
  }
};