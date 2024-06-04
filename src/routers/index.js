import express from 'express';
import { authRouter } from './auth.router.js';
import { feedsRouter } from './feeds.router.js';
const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/feeds', feedsRouter);

export { apiRouter };
