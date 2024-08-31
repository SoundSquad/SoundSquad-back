import { Request, Response, NextFunction } from 'express';

export const getUserNum = (req: Request): number | undefined => {
  if (typeof req.body.user_num === 'number') {
    return req.body.user_num;
  }
  if (typeof req.body.user_num === 'string') {
    return parseInt(req.body.user_num, 10);
  }
  if (typeof req.query.user_num === 'string') {
    return parseInt(req.query.user_num, 10);
  }
  return undefined;
}
