import { Express } from 'express'; // Application ? 
import userRouter from './Ruser';
import searchRouter from './Rsearch';
import communityRouter from './Rcommunity';
import adminRouter from './Radmin';
import myPageRouter from './Rmypage';
import concertRouter from './Rconcert';
import profileRouter from './Rprofile';
import squadRouter from './Rsquad';
import reportRouter from './Rreport';

const integRoutes = ( app : Express ): void => {
  app.use('/user', userRouter);
  app.use('/search', searchRouter);
  app.use('/community', communityRouter);
  app.use('/admin', adminRouter);
  app.use('/concert', concertRouter);
  app.use('/profile', profileRouter);
  app.use('/squad', squadRouter);
  app.use('/report', reportRouter);
  app.use('/mypage', myPageRouter);
};

export default integRoutes;