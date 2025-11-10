import express, { Application } from 'express';
import { corsMiddleware } from './middleware/cors.middleware';
import { errorHandler } from './middleware/errorHandler.middleware';
import routes from './routes';

export const createApp = (): Application => {
  const app = express();

  app.use(corsMiddleware);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', routes);

  app.use(errorHandler);

  return app;
};
