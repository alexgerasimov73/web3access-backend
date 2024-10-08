import { v4 as uuidv4 } from 'uuid'
import { customAlphabet } from 'nanoid'
import { ApiError } from '../exceptions/api-error'
import { RegistrationFlowStep, userModel } from '../models/user-model'

export const startRegistrationService = async (emailAddress: string) => {
	const candidate = await userModel.findOne({ emailAddress })

	if (candidate)
		throw ApiError.BadRequest(
			`The user with this email: ${emailAddress} already exists`
		)

	const id = uuidv4()
	const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8)
	const verificationToken = nanoid()

	const user = userModel.create({
		emailAddress,
		id,
		onboardingStep: RegistrationFlowStep.VerifyEmail,
		verificationToken
	})

	console.log('user', user)
}
