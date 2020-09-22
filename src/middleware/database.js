import pgsql from 'pg-promise';
import config from '../config';
import { Logger } from './logger';

export const db = pgsql({
  error(error, e) {
    if (e.cn) {
      Logger.error(`Cannot connect to database`);
      if (config.env.isDevelopment) {
        Logger.debug(error.message);
      }
    }
  },
  query(e) {
    if (config.env.isDevelopment) {
      Logger.debug(`Query: ${e.query}`);
    }
  },
})({
  host: config.databaseConfig.authHost,
  port: config.databaseConfig.authPort,
  database: config.databaseConfig.authDatabaseName,
  user: config.databaseConfig.authUsername,
  password: config.databaseConfig.authPassword,
  max: config.databaseConfig.authMaxConnections,
});
