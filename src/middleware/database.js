import pgsql from 'pg-promise';
import config from '../config';
import { Logger } from './logger';
import { constants } from '../util';

export const databaseConnection = async () => {
  try {
    const dbObj = pgsql({
      query(e) {
        Logger.debug(e.query);
      },
    })({
      host: config.databaseConfig.authHost,
      port: config.databaseConfig.authPort,
      database: config.databaseConfig.authDatabaseName,
      user: config.databaseConfig.authUsername,
      password: config.databaseConfig.authPassword,
      max: config.databaseConfig.authMaxConnections,
    });

    return await dbObj.connect();
  } catch (err) {
    Logger.error(err.message);
    Logger.error('Connection to database failed!!');
    return 0;
  }
};
