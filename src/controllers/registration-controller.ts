import type { Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { ApiError } from '../exceptions/api-error'
import {
	confirmWalletService,
	signDocumentService,
	startRegistrationService,
	submitDetailsService,
	verifyCustomerService,
	verifyEmailService
} from '../services/registration-service'
import {
	IConfirmWalletBody,
	ISignDocumentBody,
	IStartRegistrationBody,
	ISubmitDetailsBody,
	IVerifyCustomerBody,
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

export const confirmWallet = async (
	req: TRequestBody<IConfirmWalletBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return next(ApiError.BadRequest('Validation error', errors.array() as []))
		}

		const { id, ethAddress, ethSignature, transmittedAt } = req.body

		const registrationData = await confirmWalletService(
			id,
			ethAddress,
			ethSignature,
			transmittedAt
		)

		return res.json(registrationData)
	} catch (error) {
		next(error)
	}
}

export const signDocument = async (
	req: TRequestBody<ISignDocumentBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return next(ApiError.BadRequest('Validation error', errors.array() as []))
		}

		const { id, documentId, ethSignature, transmittedAt } = req.body

		const registrationData = await signDocumentService(
			id,
			documentId,
			ethSignature,
			transmittedAt
		)

		return res.json(registrationData)
	} catch (error) {
		next(error)
	}
}

export const verifyCustomer = async (
	req: TRequestBody<IVerifyCustomerBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return next(ApiError.BadRequest('Validation error', errors.array() as []))
		}

		const { id, simulatedData } = req.body

		const registrationData = await verifyCustomerService(id, simulatedData)

		return res.json(registrationData)
	} catch (error) {
		next(error)
	}
}
