import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { Logger } from '../../middleware/logger';
import Schema from './Schema';
import { ErrorHandler } from '../../util';
import config from '../../config';

export const SchemaValidator = async (req, res, next) => {
  try {
    Logger.info('Validating Schema');
    // enabled HTTP methods for request data validation
    const _supportedMethods = ['get', 'post', 'put'];

    // Joi validation options
    const _validationOptions = {
      abortEarly: false, // abort after the last validation error
      allowUnknown: true, // allow unknown keys that will be ignored
      stripUnknown: true, // remove unknown keys from the validated data
    };

    // Used as a mapper for retieving schema
    const route = req.route.path;

    const method = req.method.toLowerCase();
    Logger.debug(`Route ${route}`);

    if (_.includes(_supportedMethods, method) && _.has(Schema, route)) {
      // get schema for the current route
      const SchemaClass = _.get(Schema, route);
      const _schema = SchemaClass.schema;

      // data mapping for body, headers, params
      const requestDataMapping = SchemaClass.requestDataMapping;

      // Create a body object based on all the request inputs from
      // body,headers,params
      let body = {};
      for (const key in requestDataMapping) {
        if (requestDataMapping.hasOwnProperty(key)) {
          const value = requestDataMapping[key];
          if (config.env.isDevelopment) {
            Logger.debug(
              `${key} => Required ${JSON.stringify(value)} | ${JSON.stringify(
                _.pick(req[key], value),
              )}`,
            );
          }
          const formattedObject = _.pick(req[key], value);
          body = { ...body, ...formattedObject };
        }
      }

      if (_schema) {
        // Validate req.body using the schema and validation options
        const data = await _schema.validateAsync(body, _validationOptions);

        // Replace req.body with the data after Joi validation
        req.body = data;
        next();
      }
    } else {
      next();
    }
  } catch (err) {
    // TODO: Better Error Handling For example password=confirmPassword
    Logger.error(err.message);
    next(
      new ErrorHandler(
        422,
        'Invalid request data. Please review request and try again.',
      ),
    );
  }
};

export const VerifyToken = async (req, res, next) => {
  try {
    Logger.info('Verifying Token');
    const requestData = req.body;
    const { authorization } = requestData;
    const token = authorization.split(' ')[1];
    // Verify Token
    const user = jwt.verify(token, config.jwt.refreshTokenSecret);

    req.body.token = token;
    req.body.tokenData = user;
    next();
  } catch (error) {
    Logger.error(error.message);
    next(new ErrorHandler(500, 'Unable to Verify Token'));
  }
};
