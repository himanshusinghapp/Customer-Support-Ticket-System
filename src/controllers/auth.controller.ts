import { Request, Response } from 'express';
import { signup, login } from '../services/auth.service';
import { signupSchema, loginSchema } from '../middleware/auth.validator';
import { sendSuccessResponse, sendErrorResponse } from '../common/helpers/response';
import { MESSAGES } from '../common/constants/messages';
import { HTTP_STATUS } from '../common/constants/httpStatus';

export const signupHandler = async (req: Request, res: Response): Promise<void> => {
  const { error } = signupSchema.validate(req.body);
  if (error){
    sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    return;
  } 

  try {
    const token = await signup(req.body.name, req.body.email, req.body.password);
    //res.status(201).json({ token });
    sendSuccessResponse(res, MESSAGES.USER.CREATED, {token}, HTTP_STATUS.CREATED)
  } catch (err: any) {
    //res.status(400).json({ message: err.message });
    sendErrorResponse(res, err.message, HTTP_STATUS.BAD_REQUEST);
  }
};

export const loginHandler = async (req: Request, res: Response): Promise<void> => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    //res.status(400).json({ message: error.message });
    sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    return;
  }
  try {
    const token = await login(req.body.email, req.body.password);
    //res.status(200).json({ token });
    sendSuccessResponse(res, MESSAGES.USER.LOGIN_SUCCESS, {token}, HTTP_STATUS.OK)
  } catch (err: any) {
   // res.status(401).json({ message: err.message });
   sendErrorResponse(res, err.message, HTTP_STATUS.UNAUTHORIZED);
  }
};
