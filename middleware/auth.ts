import { Request, Response, NextFunction } from 'express';

export const authenticateUser = ( req: Request, res: Response, next: NextFunction ) => {
  const sessionUserNum = ( req.session as any ).user?.user_num;
  const requestUserNum = req.body.user_num;

  if (sessionUserNum === undefined) {
    return res.status(401).json({ message: "접속 상태가 아닙니다." });
  }

  if (sessionUserNum !== requestUserNum) {
    return res.status(403).json({ message: "접근 권한이 없습니다." });
  }

  next();
};

export const authenticateAdmin = ( req: Request, res: Response, next: NextFunction )=>{
  const sessionUserNum = ( req.session as any ).user?.user_num;
  const requestUserNum = req.body.user_num;

  if ( sessionUserNum === undefined ) {
    return res.status(401).json({ message: "접속 상태가 아닙니다." });
  }

  if ( sessionUserNum !== requestUserNum ) {
    return res.status(403).json({ message: "접근 권한이 없습니다." });
  }

  if ( sessionUserNum !== 1 ){
    return res.status(403).json({ message: "접근 권한이 없습니다." });
  }

  next();
}