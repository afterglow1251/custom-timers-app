declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production';
    readonly PORT: string;

    readonly FRONTEND_URL: string;

    readonly DB_HOST: string;
    readonly DB_PORT: string;
    readonly DB_USERNAME: string;
    readonly DB_PASSWORD: string;
    readonly DB_NAME: string;

    readonly SESSION_SECRET: string;

    readonly ACCESS_SECRET: string;
    readonly REFRESH_SECRET: string;

    readonly ACCESS_TOKEN_EXPIRATION: string;
    readonly REFRESH_TOKEN_EXPIRATION: string;
  }
}
