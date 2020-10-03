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
  authtype: Joi.string()
    .alphanum()
    .valid(constants.AUTHTYPE.BASIC, constants.AUTHTYPE.JWT)
    .default(constants.AUTHTYPE.BASIC),
  Username: Joi.string().alphanum().required(),
  Password: Joi.string().required().strict(),
});

const TokenSchema = Joi.object({
  authorization: Joi.string().required(),
});
const SignoutSchema = Joi.object({
  authtype: Joi.string()
    .alphanum()
    .valid(constants.AUTHTYPE.BASIC, constants.AUTHTYPE.JWT)
    .default(constants.AUTHTYPE.BASIC),
  authorization: Joi.string().required(),
});

export default {
  [constants.APIROUTES.AUTH.SIGNUP]: new Schema(SignUpSchema, {
    body: ['FirstName', 'LastName', 'Username', 'Password'],
  }),
  [constants.APIROUTES.AUTH.SIGNIN]: new Schema(SignInSchema, {
    headers: ['authtype'],
    body: ['Username', 'Password'],
  }),
  [constants.APIROUTES.AUTH.TOKEN]: new Schema(TokenSchema, {
    headers: ['authorization'],
  }),
  [constants.APIROUTES.AUTH.SIGNOUT]: new Schema(SignoutSchema, {
    headers: ['authorization', 'authtype'],
  }),
};
