import { Router } from 'express';
import { APIControllers, APIMiddlewares } from '..';
import { constants } from '../../util';

const route = Router();

export default app => {
  const {
    SELF,
    SIGNUP,
    SIGNIN,
    TOKEN,
    FORGETPASSWORD,
  } = constants.APIROUTES.AUTH;

  app.use(SELF, route);

  /**
   * Route /signup
   */
  route.post(
    SIGNUP,
    APIMiddlewares.SchemaValidator,
    APIControllers.AuthController.signup,
  );

  /**
   * Route /signin
   */
  route.post(
    SIGNIN,
    APIMiddlewares.SchemaValidator,
    APIControllers.AuthController.signin,
  );

  route.post(
    FORGETPASSWORD,
    APIMiddlewares.SchemaValidator,
    APIControllers.AuthController.forgetPasswordSendMail,
  );

  route.post(
    TOKEN,
    APIMiddlewares.SchemaValidator,
    APIMiddlewares.VerifyToken,
    APIControllers.AuthController.getNewTokens,
  );

  console.log(route.stack.map(r => r.route?.path));
};
