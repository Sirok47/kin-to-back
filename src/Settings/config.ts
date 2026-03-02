import * as process from 'node:process';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  CURRENT_URL: process.env.CURRENT_URL,
  PORT: process.env.PORT || 3000,
  SECRET_KEY: process.env.SECRET_KEY as string,

  accessTokenLifeSpan: +(process.env.ACC_TOKEN_LIFESPAN as string),
  refreshTokenLifeSpan: +(process.env.REF_TOKEN_LIFESPAN as string),
  COOKIE_PATH: '/',

  //-----Supabase-----
  //BucketPath: 'menu',
  SUPABASE_URL: process.env.SUPABASE_URL as string,
  SUPABASE_KEY: process.env.SUPABASE_SECRET_ACCESS_KEY as string,
  SUPABASE_BUCKET: process.env.SUPABASE_BUCKET as string,

  //-----PSQL-----
  PSQL_HOST: process.env.PSQL_HOST || 'localhost',
  PSQL_PORT: 5432,
  PSQL_USERNAME: process.env.PSQL_USERNAME,
  PSQL_PASSWORD: process.env.PSQL_PASSWORD,
  PSQL_DB: 'postgres',
  PSQL_CONNECTION_STRING: process.env.PSQL_CONNECTION_STRING,
};
