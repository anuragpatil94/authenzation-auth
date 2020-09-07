import loadExpress from './express';
import loadLoggers, { Logger } from './logger';
import loadRoutes from './routes';
import { databaseConnection } from './database';
export default async ({ app }) => {
  try {
    // Load Database
    const db = await databaseConnection();
    if (db) {
      Logger.info('Loaded And Connected Database!');
    }
    //   Load Model

    // Load Middlewares
    loadExpress({ app });
    Logger.info('Loaded Express Initial Middlewares');
    loadLoggers({ app });
    Logger.info('Loaded Request Logger');
    loadRoutes({ app });
    Logger.info('Loaded Routes');
  } catch (err) {
    Logger.error(err);
  }
};
