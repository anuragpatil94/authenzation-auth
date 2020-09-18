import Joi from '@hapi/joi';
import { constants } from '../../../util';

class Schema {
  constructor(schema, requestDataMapping) {
    this.schema = schema;
    this.requestDataMapping = requestDataMapping;
  }
}

const SignUpSchema = Joi.object({
  firstName: Joi.string().alphanum().required(),
  lastName: Joi.string().alphanum().required(),
  // middleName: Joi.string().alphanum(),
  username: Joi.string().alphanum().required(),
  password: Joi.string().min(6).required().strict(),
  // confirmPassword: Joi.string().valid(Joi.ref('password')).required().strict(),
});

const SignInSchema = Joi.object({
  // authtype: Joi.string().alphanum().valid('JWT', 'SESSION', 'BASIC').required(),
  username: Joi.string().alphanum().required(),
  password: Joi.string().required().strict(),
});

export default {
  [constants.APIROUTES.AUTH.SIGNUP]: new Schema(SignUpSchema, {
    body: [
      'firstName',
      'lastName',
      // 'middleName',
      'username',
      'password',
      // 'confirmPassword',
    ],
  }),
  [constants.APIROUTES.AUTH.SIGNIN]: new Schema(SignInSchema, {
    // headers: ['authtype'],
    body: ['username', 'password'],
  }),
};
