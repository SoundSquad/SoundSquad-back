import express, { Express, NextFunction, Request, Response } from 'express';
import logger from './config/loggerConfig';

import sequelize  from './models';
import cors from 'cors';
import session,{ MemoryStore } from 'express-session';
import router from './routes/Rindex';

import app from './config/winstonConfig';
import { log } from 'console';

const PORT: string | number = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',   
    methods: ['Get','Post','Delete','Patch'],
    credentials: true
}));

// app.use(cors({
//   origin : ['http://ex.com', 'http://ex2.com'],
//   methods: ['Get','Post'],
//   allowedHeaders : ['Content-Type','Authorization']
// }))

const today = new Date()
const expireDate = new Date()
expireDate.setDate(today.getDate() + 1)
const sessionStore = new MemoryStore();

app.use(session({
    secret : process.env.COOKIE_SECRET || 'default_secret_session_key ' , 
    resave : false, 
    saveUninitialized : false, 
    cookie : {
        httpOnly :true,
        secure : false,  
        maxAge: 24 * 60 * 60 * 1000
    }    
}));

app.use((req, res, next) => {
    if (req.sessionStore && typeof req.sessionStore.all === 'function') {
        req.sessionStore.all((err, sessions) => {
            const sessionUserNum = ( req.session as any ).user?.user_num;
            console.log('sessionUserNum >>>> ', sessionUserNum);
            
            if (err) {
                logger.error('세션 조회 중 오류 발생:', err);
                console.error('세션 조회 중 오류 발생:', err);
            } else {
                console.log('전체 세션 데이터:', sessions);
                console.log('활성 세션 수:', Object.keys(sessions || {}).length);
            }
            next();
        });
    } else {
        next();
    }
});

router(app);

app.get('*', (req: Request, res: Response) => {

    logger.info('홈 페이지 방문');
    res.status(404).json({ msg : ' how can you get here ? '});
});

const startServer = async () => {
    try {
        await sequelize.sequelize.authenticate();
        logger.info(`Database connected!`);
        console.log('Database connected!');

        app.listen(PORT, () => {
            logger.info(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
        console.error('Unable to connect to the database:', error);
    }
};

startServer();