import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL || '',
  externalApiUrl: process.env.EXTERNAL_API_URL || '',
  nodeEnv: process.env.NODE_ENV || 'development',
};