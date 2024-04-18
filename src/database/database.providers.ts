import { sequelizeHK } from './connection';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE_HK',
    useFactory: async () => {
      await sequelizeHK.authenticate();

      return sequelizeHK;
    },
  },
];
