import { Request, Response } from 'express';
import { Reply } from '../models/reply.model';
import { sendSuccessResponse, sendErrorResponse } from '../common/helpers/response';
import { MESSAGES } from '../common/constants/messages';
import { HTTP_STATUS } from '../common/constants/httpStatus';

export const addReply = async (req: Request, res: Response):Promise<void> => {
  try{
  const userId = (req as any).user.id;
  const { message } = req.body;
  const { ticketId } = req.params;

  const reply = await Reply.create({
    message,
    user: userId,
    ticket: ticketId,
  });

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