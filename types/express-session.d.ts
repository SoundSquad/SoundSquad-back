import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      user_id: string;
      user_num: number;
      admin: boolean;
      
    };
    loggedin?: boolean;
  }
}