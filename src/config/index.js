import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

let config = dotenv.config();

if (!config) {
  throw new Error('Configurations Not Found');
}

export default {
  port: parseInt(process.env.NODE_SERVER_PORT) || 4000,
  loggerConfig: {
    logLevel: process.env.LOG_LEVEL || 'silly',
    infoColor: process.env.INFO_COLOR || 'blue',
    debugColor: process.env.DEBUG_COLOR || 'magenta',
    warningColor: process.env.WARNING_COLOR || 'yellow',
    errorColor: process.env.ERROR_COLOR || 'red',
  },
  routesConfig: {
    routePrefix: process.env.ROUTE_PREFIX || '/api/v1',
  },
  databaseConfig: {
    mongoURI: process.env.MONGO_URI,
    mongoUser: process.env.MONGO_USERNAME,
    mongoPassword: process.env.MONGO_PASSWORD,
    mongoDbName: process.env.MONGO_DATABASE_NAME,
  },
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  },
};
