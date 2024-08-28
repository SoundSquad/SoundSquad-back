import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === 'server' ? '../.env.server' : '../.env';

dotenv.config({
  path: path.resolve(__dirname, envFile),
});

interface DbConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';
  port?: string;
}

interface Config {
  development: DbConfig;
  server: DbConfig;
  [key: string]: DbConfig;  // 인덱스 시그니처 추가
}

const config: Config = {
  development: {
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || '',
    host: process.env.DB_HOST || '',
    dialect: (process.env.DB_DIALECT as DbConfig['dialect']) || 'mysql',
  },
  server: {
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || '',
    host: process.env.DB_HOST || '',
    dialect: (process.env.DB_DIALECT as DbConfig['dialect']) || 'mysql',
    port: process.env.DB_PORT,
  },
};

export default config;