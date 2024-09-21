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
  app.use('/api/user', userRouter);
  app.use('/api/search', searchRouter);
  app.use('/api/community', communityRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/concert', concertRouter);
  app.use('/api/profile', profileRouter);
  app.use('/api/squad', squadRouter);
  app.use('/api/report', reportRouter);
  app.use('/api/mypage', myPageRouter);
};

export default integRoutes;