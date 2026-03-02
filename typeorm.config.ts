import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { config as conf } from './src/Settings/config';

config();

export const TypeormConfig: DataSourceOptions = {
  type: 'postgres',
  // for dev build
  host: conf.PSQL_HOST,
  port: conf.PSQL_PORT,
  username: conf.PSQL_USERNAME,
  password: conf.PSQL_PASSWORD,
  database: conf.PSQL_DB,
  //for staging/production
  url: conf.PSQL_CONNECTION_STRING,
};

export default new DataSource({
  ...TypeormConfig,
  migrations: ['src/migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
});
