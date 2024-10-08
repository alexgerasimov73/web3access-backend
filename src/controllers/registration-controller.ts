import type { Response, Request, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { ApiError } from '../exceptions/api-error'
import { startRegistrationService } from '../services/registration-service'

export const startRegistration = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return next(ApiError.BadRequest('Validation error', errors.array() as []))
		}

		const { email } = req.body

		const userData = await startRegistrationService(email)

		return res.json(userData)
	} catch (error) {}
}
