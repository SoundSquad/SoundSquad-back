import { Request, Response, NextFunction } from 'express';
import { getUserNum } from '../utils/typeCheck';
import logger from '../config/loggerConfig';

export const authenticateUser = ( req: Request, res: Response, next: NextFunction ) => {
  const sessionUserNum = ( req.session as any ).user?.user_num;
  const requestUserNum = getUserNum(req);
  
  if (sessionUserNum === undefined) {
    logger.info('authenticateUser - 401 ', sessionUserNum );
    return res.status(401).json({ message: "접속 상태가 아닙니다." });
  }

  if (sessionUserNum !== requestUserNum) {
    logger.info('authenticateUser - 403 ', sessionUserNum );
    return res.status(403).json({ message: "접근 권한이 없습니다." });
  }

  logger.info('authenticateUser - 100 ', sessionUserNum );
  next();
};

export const authenticateAdmin = ( req: Request, res: Response, next: NextFunction )=>{
  const sessionUserNum = ( req.session as any ).user?.user_num;
  const requestUserNum = getUserNum(req);
  
  if ( sessionUserNum === undefined ) {
    logger.info('authenticateAdmin - 401 ', sessionUserNum );
    return res.status(401).json({ message: "접속 상태가 아닙니다." });
  }

  if ( sessionUserNum !== requestUserNum ) {
    logger.info('authenticateAdmin - 403 ', sessionUserNum );
    return res.status(403).json({ message: "접근 권한이 없습니다." });
  }

  if ( sessionUserNum !== 1 ){
    logger.info('authenticateAdmin - 403 ', sessionUserNum );
    return res.status(403).json({ message: "접근 권한이 없습니다." });
  }

  logger.info('authenticateAdmin - 100 ', sessionUserNum );
  next();
}