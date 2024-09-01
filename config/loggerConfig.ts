import winston from 'winston';
import fs from 'fs';
import path from 'path';

const logDir = path.join(__dirname, '..', 'logs');
fs.existsSync(logDir) || fs.mkdirSync(logDir);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(info => {
      const date = new Date(info.timestamp);
      date.setHours(date.getHours() + 9);  // KST = UTC+9
      return `${date.toISOString().replace('T', ' ').substr(0, 19)} [${info.level}]: ${info.message}`;
    })
  ),
  transports: [
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(logDir, 'info.log'), 
      level: 'info' 
    }),
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log') 
    }),
  ],
});

// 개발 환경에서는 콘솔에도 로그 출력
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;