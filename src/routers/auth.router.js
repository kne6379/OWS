import express from 'express';
import { prisma } from '../utils/prisma.util.js';

const authRouter = express.Router();

export { authRouter };
