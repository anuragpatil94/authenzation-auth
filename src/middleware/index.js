import loadExpress from './express';
import loadLoggers, { Logger } from './logger';
import loadRoutes from './routes';
import { databaseConnection } from './database';
export default async ({ app }) => {
  try {
    // Load Database
    await databaseConnection();
    Logger.info('Database Connection Successful');

    // Load Middlewares
    loadExpress({ app });
    Logger.info('Loaded Express Initial Middlewares');
    loadLoggers({ app });
    Logger.info('Loaded Request Logger');
    loadRoutes({ app });
    Logger.info('Loaded Routes');
  } catch (err) {
    console.dir(err.message);
    // Logger.error(`${fileName}:${lineNumber}: ${message}`);
  }
};
