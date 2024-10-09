import { v4 as uuidv4 } from 'uuid'
import { customAlphabet } from 'nanoid'
import { ApiError } from '../exceptions/api-error'
import { RegistrationFlowStep, userModel } from '../models/user-model'
import { sendStartRegistrationMail } from './mail-service'
import { getUserData } from './user-service'

export const startRegistrationService = async (emailAddress: string) => {
	const candidate = await userModel.findOne({ emailAddress })

	if (candidate)
		throw ApiError.BadRequest(
			`The user with this email: ${emailAddress} already exists`
		)

	const id = uuidv4()
	const getToken = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8)
	const verificationToken = getToken()

	const user = await userModel.create({
		emailAddress,
		id,
		onboardingStep: RegistrationFlowStep.VerifyEmail,
		verificationToken
	})

	console.log('user', user)

	await sendStartRegistrationMail(
		emailAddress,
		`${process.env.API_URL}/registration?id=${id}`,
		verificationToken
	)

	return getUserData(user)
}
