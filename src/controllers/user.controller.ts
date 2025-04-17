import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { sendSuccessResponse, sendErrorResponse } from '../common/helpers/response';
import { MESSAGES } from '../common/constants/messages';
import { HTTP_STATUS } from '../common/constants/httpStatus';

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id;

  const user = await User.findById(userId).select('-password');
  if (!user){
  sendErrorResponse(res, MESSAGES.USER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return;
  }

  sendSuccessResponse(res, MESSAGES.USER.PROFILE_FETCHED, user);
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      sendErrorResponse(res, MESSAGES.USER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
      return;
    }

    sendSuccessResponse(res, MESSAGES.USER.PROFILE_UPDATED, updatedUser);
  } catch (error: any) {
    sendErrorResponse(res, MESSAGES.COMMON.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
