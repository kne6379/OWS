import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js'
import { MESSAGES } from '../constants/message.constant.js';
import { signUpValidator } from '../middlewares/validators/sign-up-validator.middleware.js';
import { prisma } from '../utils.prisma.util.js';
import bcrypt from 'bcrypt';
import { ACCESS_TOKEN_EXPIRES, HASH_SALT_ROUNDS } from '../constants/auth.constant.js';
import jwt from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET } from '../constants/env.constant.js';
import { signInValidator } from '../middlewares/validators/sign-in-validator.middleware.js';

const authRouter = express.Router();

authRouter.post('/sign-up', signUpValidator, async (req, res, next)=>{
    try {
        const {email, password, nickName,
            introduce, maxweight, weight, height, fat, metabolic, muscleweight, profile_img_url} = req.body;

        const existedUser = await prisma.users.findUnique({where: {email}})

        if (existedUser) {
            return res.status(HTTP_STATUS.CONFLICT).json({message: MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED,
            })
        }
        
        const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS)

        const data = await prisma.users.create({
            data: { email, password: hashedPassword, nickName }
        });
        
        const profileData = await prisma.profile.create({
            introduce, maxweight, weight, height, fat, metabolic, muscleweight, profile_img_url })

        return res.status(HTTP_STATUS.CREATED).json({
            message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
            data,
            profileData
        });
    } catch (error) {
        next(error);
        }
});


authRouter.post('/sign-in', signInValidator, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.users.findUnique({where: email})

        const passwordMatch = user && bcrypt.compareSync(password, user.password)

        if (!passwordMatch) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: MESSAGES.AUTH.SIGN_IN.UNAUTHORIZED
            })
        }

        const payload = { id: user.id };

        const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn:ACCESS_TOKEN_EXPIRES });

        return res.status(HTTP_STATUS.OK).json({
            message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
            data: { accessToken }
        })
    } catch(error){
        next(error)
    }
})

export { authRouter };
