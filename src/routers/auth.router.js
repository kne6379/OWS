import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js'
import { MESSAGES } from '../constants/message.constant.js';
import { signUpValidator } from '../middlewares/validators/sign-up-validator.middleware.js';
import { prisma } from '../utils.prisma.util.js';
import bcrypt, { hash } from 'bcrypt';
import { HASH_SALT_ROUNDS } from '../constants/auth.constant.js';

const authRouter = express.Router();

authRouter.post('/sign-up', signUpValidator, async (req, res, next)=>{
    try {
        const {email, password, nickname,
            introduce, maxweight, weight, height, fat, metabolic, muscleweight, img_url} = req.body;

        const existedUser = await prisma.users.findUnique({where: {email}})

        if (existedUser) {
            return res.status(HTTP_STATUS.CONFLICT).json({message: MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED,
            })
        }
        
        const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS)

        const data = await prisma.users.create({
            data: { email, password: hashedPassword, nickname,
                introduce, maxweight, weight, height, fat, metabolic, muscleweight, img_url
            }
        });

        return res.status(HTTP_STATUS.CREATED).json({
            status: HTTP_STATUS.CREATED,
            message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
            data,
        });
    } catch (error) {
        next(error);
        }
});

export { authRouter };
