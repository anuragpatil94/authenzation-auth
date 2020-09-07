import configs from '../config';
import routes from '../api/routes';
import { Logger } from './logger';
import { APIRoutes } from '../api';

export default ({ app }) => {
  app.use(configs.routesConfig.routePrefix, APIRoutes.Routes());

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    Logger.debug('Error Middleware: Route Not Found');

    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by jwt
     */
    if (err.name === 'UnauthorizedError') {
      Logger.debug('Error Middleware: Unauthorized Error');
      return res.status(err.status).send({ message: err.message }).end();
    }
    return next(err);
  });

  app.use((err, req, res, next) => {
    Logger.debug(`Error Middleware: ${err.status} \n ${err.stack}`);
    res.status(err.status || 500).json({
      errors: {
        message: err.message,
      },
    });
  });
};
