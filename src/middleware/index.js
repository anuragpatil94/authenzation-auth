import loadExpress from './express';
import loadLoggers, { Logger } from './logger';
import loadRoutes from './routes';
import { db } from './database';
export default async ({ app }) => {
  try {
    // Load Database
    const c = await db.connect();
    c.done();

    if (!c.client.serverVersion) {
      throw new Error('Cannot Connect to Database');
    }
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
