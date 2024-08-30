declare global {
    namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string | undefined;
        PORT: string;
        DATABASE_URL: string;
        DB_USERNAME: string;
        DB_PASSWORD: string;
        DB_DATABASE: string;
        DB_HOST: string;
        DB_DIALECT: string;
        JWT_SECRET: string;
        PORT: string;
        COOKIE_SECRET: string;
      }
    }
  }