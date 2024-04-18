import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from 'constants/config';
import { SequelizeOptions } from 'sequelize-typescript';

export const SequelizeDBConfig: SequelizeOptions = {
  dialect: 'mysql',
  dialectOptions: { supportBigNumbers: true, decimalNumbers: true },
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  port: +DB_PORT,
  define: { timestamps: false, underscored: true },
};
