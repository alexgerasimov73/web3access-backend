import type { Response, Request, NextFunction } from 'express'
import { registerService } from '../services/user-service'

export const register = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password } = req.body

		const userData = await registerService(email, password)
		res.cookie('refreshToken', userData.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true
			// TODO: Enable this.
			// secure: true
		})

		return res.json(userData)
	} catch (error) {
		console.error(error)
	}
}

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
	} catch (error) {}
}

export const logout = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
	} catch (error) {}
}

export const activate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
	} catch (error) {}
}

export const refresh = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
	} catch (error) {}
}

export const getUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
	} catch (error) {}
}
