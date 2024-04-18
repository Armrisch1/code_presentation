import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from 'constants/config';

export const local = {
  dialect: 'mysql',
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  port: DB_PORT,
  logging: true,
  dialectOptions: {
    multipleStatements: true,
  },
};
