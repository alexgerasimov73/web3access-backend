import type { Response, Request, NextFunction } from 'express'
import { ApiError } from '../exceptions/api-error'
import { validateAccessToken } from '../services/token-service'
import { JwtPayload } from 'jsonwebtoken'

declare module 'express-serve-static-core' {
	export interface Request {
		user?: string | JwtPayload
	}
}

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authorizationHeader = req.headers.authorization
		if (!authorizationHeader) throw ApiError.UnauthorizedError()

		const accessToken = authorizationHeader.split(' ').at(-1)
		if (!accessToken) throw ApiError.UnauthorizedError()

		const userData = validateAccessToken(accessToken)
		if (!userData) throw ApiError.UnauthorizedError()

		req.user = userData
		next()
	} catch (error) {
		return next(ApiError.UnauthorizedError())
	}
}
