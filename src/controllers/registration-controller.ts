import type { Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { ApiError } from '../exceptions/api-error'
import {
	startRegistrationService,
	submitDetailsService,
	verifyEmailService
} from '../services/registration-service'
import {
	IStartRegistrationBody,
	ISubmitDetailsBody,
	IVerifyEmailBody,
	TRequestBody
} from '../config/types'

export const startRegistration = async (
	req: TRequestBody<IStartRegistrationBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return next(ApiError.BadRequest('Validation error', errors.array() as []))
		}

		const { emailAddress } = req.body

		const registrationData = await startRegistrationService(emailAddress)

		return res.json(registrationData)
	} catch (error) {
		next(error)
	}
}

export const verifyEmail = async (
	req: TRequestBody<IVerifyEmailBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return next(ApiError.BadRequest('Validation error', errors.array() as []))
		}

		const { id, verificationToken } = req.body

		const registrationData = await verifyEmailService(id, verificationToken)

		return res.json(registrationData)
	} catch (error) {
		next(error)
	}
}

export const submitDetails = async (
	req: TRequestBody<ISubmitDetailsBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return next(ApiError.BadRequest('Validation error', errors.array() as []))
		}

		const { id, firstName, lastName, linkedIn } = req.body

		const registrationData = await submitDetailsService(
			id,
			firstName,
			lastName,
			linkedIn
		)

		return res.json(registrationData)
	} catch (error) {
		next(error)
	}
}
