declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_PORT: number;
      POSTGRES_DATABASE: string;
      POSTGRES_HOST: string;
      JWT_SECRET: string;
      JWT_REFRESH_SECRET: string;
      CORS_ORIGIN: string;
    }
  }
}

export {};
