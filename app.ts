import express, { Express, Request, Response } from 'express';
import logger from './config/loggerConfig';
import sequelize from './models';
import cors from 'cors';
import session from 'express-session';
import router from './routes/Rindex';

export function createApp(): Express {
    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors());

    const today = new Date()
    const expireDate = new Date()
    expireDate.setDate(today.getDate() + 1)

    app.use(session({
        secret: process.env.COOKIE_SECRET || 'default_secret_session_key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            expires: expireDate
        }
    }));

    app.get('/', (req, res) => {
        logger.info('홈 페이지 방문');
        res.send('hello');
    })

    router(app);

    app.get('*', (req: Request, res: Response) => {
        logger.info('404 페이지 방문');
        res.status(404).json({ msg: 'how can you get here?' });
    });

    return app;
}

export const app = createApp();

export async function startServer(app: Express, port: string | number = process.env.PORT || 3000) {
    try {
        await sequelize.sequelize.authenticate();
        logger.info(`Database connected!`);
        console.log('Database connected!');
        
        return app.listen(port, () => {
            logger.info(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
        console.error('Unable to connect to the database:', error);
        throw error;
    }
}

// 서버를 직접 실행할 때만 호출
if (require.main === module) {
    startServer(app);
}