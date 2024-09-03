import express, { Express, Request, Response } from 'express';
import logger from './config/loggerConfig';

import sequelize  from './models';
import cors from 'cors';
import session from 'express-session';
import router from './routes/Rindex';

import app from './config/winstonConfig';

const PORT: string | number = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const today = new Date()
const expireDate = new Date()
expireDate.setDate(today.getDate() + 1)

app.use(session({
    secret : process.env.COOKIE_SECRET || 'default_secret_session_key ' , 
    resave : false, 
    saveUninitialized : false, 
    cookie : {
      httpOnly :true,
      secure : false,
      expires : expireDate
    }    
}));

app.get('/',(req,res)=>{
    logger.info('홈 페이지 방문');
    res.send('hello');
})

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