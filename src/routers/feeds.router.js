import express from 'express';
import joi from 'joi';
import prisma from '../utils/prisma.util.js';

const feedsRouter = express.Router();

// joi 유효성 검사
const createdFeedsSchema = joi.object({
	title: joi.string().required(),
	content: joi.string().min(150).required(),
	img_url: joi.string().uri()
});

// 게시물 작성 API
feedsRouter.post('/feeds', /*인증*/, async(req, res, next) => {
	try {
		const { userId } = req.user;
		const validation = createdFeedsSchema.validateAsync(req.body);
		const { title, content, img_url } = validation;

		const nickName = await prisma.users.findFirst({
			where: { userId },
			select: {
				nickName: true
			}
		});

		const feed = await prisma.feeds.create({
			data: {
				UserId: userId,
				// FK 외부키로 대문자 U를 하였으나 실제 스키마 적용에따라 수정
				// 현재 ERD 에는 userId 라고 설정되어 있음
				nickName,
				title,
				content,
				img_url,
			},
			select: {
				feedId: true,
				UserId: true,
				title: true,
				nickName: true,
				content: true,
				img_url: true,
				createdAt: true,
				updatedAt: true
			}
		});
		return res.status(201).json({status: 201, message: "게시글 생성에 성공했습니다.", data: feed});

	} catch(error) {
		next(error);
	}
});

export default feedsRouter