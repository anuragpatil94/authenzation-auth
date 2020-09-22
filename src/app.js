import express from 'express';
import colors from 'colors';

import config from './config';
import { Logger } from './middleware/logger';

(async () => {
  if (config.env.isDevelopment) {
    Logger.info('App running on Development Environment');
  }

  // Get port from config
  let port = config.port;

  // Initiate express app
  const app = express();

  // Initiate loading middleware
  Logger.info('Initiating Loading Middleware...');
  let middleware = await import('./middleware');
  await middleware.default({ app });
  Logger.info('All Middlewares Loaded!');

  // Start server on open port
  app.listen(port, err => {
    if (err) {
      Logger.error(err);
      process.exit(1);
      return;
    }
    Logger.info(`Server started at http://localhost:${port}`);
  });
})();
