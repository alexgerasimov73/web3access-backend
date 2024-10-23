import { v4 as uuidv4 } from 'uuid'
import { ApiError } from '../exceptions/api-error'
import { RegistrationFlowStep, userModel } from '../models/user-model'
import { sendStartRegistrationMail } from './mail-service'
import { generateVerificationToken } from '../config/utils'
import { registrationModel } from '../models/registration-model'
import { RegistrationDto } from '../dto/registration-dto'
import { ERRORS } from '../config/constants'

export const startRegistrationService = async (emailAddress: string) => {
	const candidate = await userModel.findOne({ emailAddress })
	const foundRegistration = await registrationModel.findOne({ emailAddress })

	if (candidate) throw ApiError.BadRequest(ERRORS.USER_EXISTS)

	if (foundRegistration) throw ApiError.BadRequest(ERRORS.REGISTRATION_EXISTS)

	const id = uuidv4()
	const verificationToken = generateVerificationToken()

	const registration = await registrationModel.create({
		emailAddress,
		id,
		onboardingStep: RegistrationFlowStep.VerifyEmail,
		verificationToken
	})

	await sendStartRegistrationMail(
		emailAddress,
		`${process.env.CLIENT_URL}/registration?id=${id}`,
		verificationToken
	)

	return new RegistrationDto(registration)
}

export const verifyEmailService = async (
	id: string,
	verificationToken: string
) => {
	const foundRegistration = await registrationModel.findOne({ id })

	if (!foundRegistration)
		throw ApiError.BadRequest(ERRORS.REGISTRATION_NOT_FOUND)

	if (foundRegistration.verificationToken !== verificationToken)
		throw ApiError.BadRequest(ERRORS.INVALID_VERIFICATION_CODE)

	if (foundRegistration.onboardingStep === RegistrationFlowStep.VerifyEmail) {
		foundRegistration.onboardingStep = RegistrationFlowStep.YourDetails
		await foundRegistration.save()
	}

	return new RegistrationDto(foundRegistration)
}

export const submitDetailsService = async (
	id: string,
	firstName: string,
	lastName: string,
	linkedIn?: string
) => {
	const foundRegistration = await registrationModel.findOne({ id })

	if (!foundRegistration)
		throw ApiError.BadRequest(ERRORS.REGISTRATION_NOT_FOUND)

	foundRegistration.firstName = firstName
	foundRegistration.lastName = lastName
	foundRegistration.linkedIn = linkedIn

	await foundRegistration.save()

	return new RegistrationDto(foundRegistration)
}
