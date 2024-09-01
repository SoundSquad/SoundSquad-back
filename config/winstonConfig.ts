import express from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';
import path from 'path';

const app = express();
const logDir = path.join(__dirname, '..', 'logs');

// KST 시간으로 포맷팅하는 함수
const formatTimestamp = () => {
  return new Date().toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/[/]/g, '-');
};

const jsonFileTransport = new winston.transports.File({
  filename: path.join(logDir, 'requests.log'),
  format: winston.format.combine(
    winston.format.timestamp({
      format: formatTimestamp
    }),
    winston.format.json()
  )
});

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: formatTimestamp
    }),
    winston.format.printf(({ timestamp, level, message, meta }) => {
      return `${timestamp} ${level}: ${message} ${JSON.stringify(meta)}`;
    })
  )
});

app.use(expressWinston.logger({
  transports: [
    jsonFileTransport,
    ...(process.env.NODE_ENV !== 'production' ? [consoleTransport] : [])
  ],
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; },
  dynamicMeta: (req, res) => {
    return {
      timestamp: formatTimestamp()
    };
  }
}));

export default app;