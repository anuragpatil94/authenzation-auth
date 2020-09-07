import _ from 'lodash';

import { Logger } from '../../middleware/logger';
import Schema from './Schema';
import { ErrorHandler } from '../../util';

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
      const keys = SchemaClass.keys;

      // Create a body object based on all the request inputs from body,headers,params
      let body = {};
      for (const key in keys) {
        if (keys.hasOwnProperty(key)) {
          const value = keys[key];
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
    next(
      new ErrorHandler(
        422,
        'Invalid request data. Please review request and try again.',
      ),
    );
  }
};
