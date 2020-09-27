import Joi from '@hapi/joi';
import { constants } from '../../../util';

class Schema {
  constructor(schema, requestDataMapping) {
    this.schema = schema;
    this.requestDataMapping = requestDataMapping;
  }
}

const SignUpSchema = Joi.object({
  FirstName: Joi.string().alphanum().required(),
  LastName: Joi.string().alphanum().required(),
  // middleName: Joi.string().alphanum(),
  Username: Joi.string().alphanum().required(),
  Password: Joi.string().min(6).required().strict(),
  // confirmPassword: Joi.string().valid(Joi.ref('password')).required().strict(),
});

const SignInSchema = Joi.object({
  // authtype: Joi.string().alphanum().valid('JWT', 'SESSION', 'BASIC').required(),
  Username: Joi.string().alphanum().required(),
  Password: Joi.string().required().strict(),
});

export default {
  [constants.APIROUTES.AUTH.SIGNUP]: new Schema(SignUpSchema, {
    body: [
      'FirstName',
      'LastName',
      // 'middleName',
      'Username',
      'Password',
      // 'confirmPassword',
    ],
  }),
  [constants.APIROUTES.AUTH.SIGNIN]: new Schema(SignInSchema, {
    // headers: ['authtype'],
    body: ['Username', 'Password'],
  }),
};
