import dotenv from 'dotenv';
import path from 'path';

// Node Environment
const ENV = process.env.NODE_ENV || '';
process.env.NODE_ENV = ENV.toLowerCase() || 'development';

// Get Config File
const envFileName = `.env.${process.env.NODE_ENV}`;
let config = dotenv.config({ path: path.resolve(process.cwd(), envFileName) });

if (!config) {
  throw new Error('Configurations Not Found');
}

export default {
  env: {
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
  },
  port: parseInt(config.parsed.NODE_SERVER_PORT) || 4000,
  loggerConfig: {
    logLevel: config.parsed.LOG_LEVEL || 'silly',
    infoColor: config.parsed.INFO_COLOR || 'blue',
    debugColor: config.parsed.DEBUG_COLOR || 'magenta',
    warningColor: config.parsed.WARNING_COLOR || 'yellow',
    errorColor: config.parsed.ERROR_COLOR || 'red',
  },
  routesConfig: {
    routePrefix: config.parsed.ROUTE_PREFIX || '/api/v1',
  },
  databaseConfig: {
    authHost: config.parsed.PGSQL_AUTH_HOST,
    authPort: config.parsed.PGSQL_AUTH_PORT,
    authMaxConnections: config.parsed.PGSQL_AUTH_MAX_CONNECTIONS || 30,
    authUsername: config.parsed.PGSQL_AUTH_USERNAME,
    authPassword: config.parsed.PGSQL_AUTH_PASSWORD,
    authDatabaseName: config.parsed.PGSQL_AUTH_DATABASE_NAME,
  },
  jwt: {
    accessTokenSecret: config.parsed.ACCESS_TOKEN_SECRET,
    accessTokenExpiration: config.parsed.ACCESS_TOKEN_EXPIRATION,
    refreshTokenExpiration: config.parsed.REFRESH_TOKEN_EXPIRATION,
    refreshTokenSecret: config.parsed.REFRESH_TOKEN_SECRET,
  },
};
