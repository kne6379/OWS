import express from 'express';
import { authRouter } from './auth.router.js';
import { userRouter } from './user.router.js';
import feedsRouter from './feeds.router.js';
import { likeRouter } from './like.router.js';
import { followRouter } from './follow.router.js';

const apiRouter = express.Router();

apiRouter.use('/users', userRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/feeds', feedsRouter);
apiRouter.use('/feeds', likeRouter);
apiRouter.use('/follow', followRouter);

export { apiRouter };
