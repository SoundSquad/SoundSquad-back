import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

dotenv.config({
  path: path.resolve(__dirname, '..' ,envFile),
});

export const PORT: string | number = process.env.PORT || 3000;
export const COOKIE_SECRET: string = process.env.COOKIE_SECRET || 'default_secret_session_key';

interface DbConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';
}

interface Config {
  development: DbConfig;
  production: DbConfig;
  [key: string]: DbConfig;  
}

export const dbConfig: Config = {
  development: {
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || '',
    host: process.env.DB_HOST || '',
    dialect: (process.env.DB_DIALECT as DbConfig['dialect']) || 'mysql',
  },
  production: {
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || '',
    host: process.env.DB_HOST || '',
    dialect: (process.env.DB_DIALECT as DbConfig['dialect']) || 'mysql',
  },
};
