import { Request, Response, NextFunction } from 'express';

export const getUserNum = (req: Request): number | undefined => {
  const user_num = req.query.user_num || req.body.user_num;
  
  if (typeof user_num === 'number') {
    return user_num;
  }
  if (typeof user_num === 'string') {
    return parseInt(user_num, 10);
  }
  if (typeof user_num === 'string') {
    return parseInt(user_num, 10);
  }
  return undefined;
}
