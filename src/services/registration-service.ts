import { v4 as uuidv4 } from 'uuid'
import { ApiError } from '../exceptions/api-error'
import { RegistrationFlowStep, userModel } from '../models/user-model'
import { sendStartRegistrationMail } from './mail-service'
import { generateVerificationToken } from '../config/utils'
import { registrationModel } from '../models/registration-model'
import { RegistrationDto } from '../dto/registration-dto'

export const startRegistrationService = async (emailAddress: string) => {
	const candidate = await userModel.findOne({ emailAddress })
	const foundRegistration = await registrationModel.findOne({ emailAddress })

	if (candidate)
		throw ApiError.BadRequest(
			`The user with this email: ${emailAddress} already exists`
		)

	if (foundRegistration)
		throw ApiError.BadRequest(
			`This email: ${emailAddress} has already been used in the registration process. Please check your email to proceed with the registration process.`
		)

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
		throw ApiError.BadRequest(
			`The registration process with this id: ${id} doesn't exists`
		)

	if (foundRegistration.verificationToken !== verificationToken)
		throw ApiError.BadRequest(
			`This verification code: ${verificationToken} is wrong.`
		)

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
		throw ApiError.BadRequest(
			`The registration process with this id doesn't exists`
		)

	return new RegistrationDto(foundRegistration)
}
