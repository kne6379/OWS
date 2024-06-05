import { REFRESH_TOKEN_SECRET } from "../constants/env.constant.js";
import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js'
import bcrypt from 'bcrypt'

export const requireRefreshToken = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if(!authorization) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: MESSAGES.AUTH.JWT.NO_TOKEN,
            })
        }

        const [ type, refreshToken ] = authorization.split(' ');

        if(type !== 'Bearer'){
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: MESSAGES.AUTH.JWT.NOT_SUPPORTED_TYPE,
        })}
        
        if (!refreshToken){
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: MESSAGES.AUTH.JWT.NO_TOKEN,
        })};

    let payload;
    try {
        payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)
    } catch(error){
        if(error.name === 'TokenExpiredError'){
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: MESSAGES.AUTH.JWT.EXPIRED
            })
        }
        else{
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: MESSAGES.AUTH.JWT.INVALID
        })
        }
    }
    const { email } = payload;

    const existedRefreshToken = await prisma.user.findUnique({ where:{
        email: email
    }})

    const isValidRefreshToken = existedRefreshToken?.refreshToken && 
    bcrypt.compareSync(refreshToken, existedRefreshToken.refreshToken)

    if(!isValidRefreshToken){
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: MESSAGES.AUTH.JWT.NO_USER
        })
    }


    
    const user = prisma.user.findUnique({where: { email: user.email }, omit: {password: true},
    });

    if(!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: MESSAGES.AUTH.JWT.NO_USER,
        })
    }

    req.user = user;
    next();

    }catch(error){
    next(error)
    }
}