import { Router } from 'express';
import { APIControllers, APIMiddlewares } from '..';
import { constants } from '../../util';

const route = Router();

export default app => {
  const { SELF, SIGNUP, SIGNIN, TOKEN } = constants.APIROUTES.AUTH;

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
    TOKEN,
    APIMiddlewares.SchemaValidator,
    APIMiddlewares.VerifyToken,
    APIControllers.AuthController.getNewTokens,
  );
};
