import { Sequelize } from 'sequelize';
import { getEnvOrThrow } from '../../../utils/env';

export const sequelize = new Sequelize({
  database: getEnvOrThrow('DB_NAME'),
  username: getEnvOrThrow('DB_USERNAME'),
  password: getEnvOrThrow('DB_PASSWORD'),
  host: getEnvOrThrow('DB_HOST'),
  port: Number(getEnvOrThrow('DB_PORT')),
  dialect: 'postgres',
  logging: false,
});
