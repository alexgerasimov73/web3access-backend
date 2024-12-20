import type { Response, Request, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import {
	loginService,
	logoutService,
	refreshService
} from '../services/user-service'
import { ApiError } from '../exceptions/api-error'
import { settings } from '../models/settings-model'

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
	res.cookie('refreshToken', refreshToken, {
		maxAge: 30 * 24 * 60 * 60 * 1000,
		httpOnly: true
		// TODO: Enable this.
		// secure: true
	})
}

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return next(ApiError.BadRequest('Validation error', errors.array() as []))
		}

		const { chainId, ethAddress, ethSignature, transmittedAt } = req.body

		const userData = await loginService(
			chainId,
			ethAddress,
			ethSignature,
			transmittedAt
		)
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

export const getSettings = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		return res.json(settings)
	} catch (error) {
		next(error)
	}
}

export const launchServer = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		return res.json('the server is alive')
	} catch (error) {
		next(error)
	}
}
