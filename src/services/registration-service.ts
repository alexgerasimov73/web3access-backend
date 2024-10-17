import { v4 as uuidv4 } from 'uuid'
import { ApiError } from '../exceptions/api-error'
import { RegistrationFlowStep, userModel } from '../models/user-model'
import { sendStartRegistrationMail } from './mail-service'
import { getUserData } from './user-service'
import { generateVerificationToken } from '../config/utils'

export const startRegistrationService = async (emailAddress: string) => {
	const candidate = await userModel.findOne({ emailAddress })

	if (candidate)
		throw ApiError.BadRequest(
			`The user with this email: ${emailAddress} already exists`
		)

	const id = uuidv4()
	const verificationToken = generateVerificationToken()

	const user = await userModel.create({
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

	return getUserData(user)
}
