import { Router } from 'express';
import auth from './auth';

export const Routes = () => {
  const app = Router();

  /**
   * Health check of API
   */
  app.get('/', (req, res, next) => {
    res.status(200).json({
      message: 'You are accessing `api/v1` !!',
    });
  });

  auth(app);

  return app;
};
