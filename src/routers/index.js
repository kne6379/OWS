import express from 'express';
import { authRouter } from './auth.router.js';
import { userRouter } from './user.router.js';
import feedsRouter from './feeds.router.js';
import { commentRouter } from './comments.router.js';

const apiRouter = express.Router();

apiRouter.use('/users', userRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/feeds', feedsRouter);
apiRouter.use('/feeds/:feedId/comments', commentRouter);

// feedRouter.use('/:feedId/comments', commentRouter);

export { apiRouter };
