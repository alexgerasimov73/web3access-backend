import type { Response, Request, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import {
	activateService,
	getAllUsersService,
	loginService,
	logoutService,
	refreshService,
	registerService
} from '../services/user-service'
import { ApiError } from '../exceptions/api-error'

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
	res.cookie('refreshToken', refreshToken, {
		maxAge: 30 * 24 * 60 * 60 * 1000,
		httpOnly: true
		// TODO: Enable this.
		// secure: true
	})
}

export const register = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return next(ApiError.BadRequest('Validation error', errors.array() as []))
		}

		const { email, password } = req.body

		const userData = await registerService(email, password)
		setRefreshTokenCookie(res, userData.refreshToken)

		return res.json(userData)
	} catch (error) {
		next(error)
	}
}

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password } = req.body

		const userData = await loginService(email, password)
		setRefreshTokenCookie(res, userData.refreshToken)

		return res.json(userData)
	} catch (error) {
		next(error)
	}
}

export const logout = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { refreshToken } = req.cookies
		const token = logoutService(refreshToken)
		res.clearCookie('refreshToken')

		return res.json(token)
	} catch (error) {
		next(error)
	}
}

export const activate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const activationLink = req.params.link
		await activateService(activationLink)

		return res.redirect(process.env.CLIENT_URL!)
	} catch (error) {
		next(error)
	}
}

export const refresh = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { refreshToken } = req.cookies

		const userData = await refreshService(refreshToken)
		if (userData?.refreshToken) {
			setRefreshTokenCookie(res, userData.refreshToken)
		}

		return res.json(userData)
	} catch (error) {
		next(error)
	}
}

export const getUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const users = await getAllUsersService()

		return res.json(users)
	} catch (error) {
		next(error)
	}
}
