import { v4 as uuidv4 } from 'uuid'
import { ApiError } from '../exceptions/api-error'
import { userModel } from '../models/user-model'
import { sendStartRegistrationMail } from './mail-service'
import {
	generateVerificationToken,
	verifyWalletSignature
} from '../config/utils'
import {
	RegistrationFlowStep,
	registrationModel
} from '../models/registration-model'
import { RegistrationDto } from '../dto/registration-dto'
import { ERRORS } from '../config/constants'
import { settings } from '../models/settings-model'
import { Address } from '../config/types'
import { getUserData } from './user-service'

export const startRegistrationService = async (emailAddress: string) => {
	const candidate = await userModel.findOne({ emailAddress })
	if (candidate) throw ApiError.BadRequest(ERRORS.USER_EXISTS)

	const foundRegistration = await registrationModel.findOne({ emailAddress })
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
	foundRegistration.onboardingStep = RegistrationFlowStep.ConnectWallet

	await foundRegistration.save()

	return new RegistrationDto(foundRegistration)
}

export const confirmWalletService = async (
	id: string,
	ethAddress: Address,
	ethSignature: string,
	transmittedAt: string
) => {
	const foundUserEthAddress = await userModel.findOne({ ethAddress })
	const foundRegistrationEthAddress = await registrationModel.findOne({
		ethAddress
	})

	if (foundUserEthAddress || foundRegistrationEthAddress)
		throw ApiError.BadRequest(ERRORS.ETH_ADDRESS_EXISTS)

	const foundRegistration = await registrationModel.findOne({ id })

	if (!foundRegistration)
		throw ApiError.BadRequest(ERRORS.REGISTRATION_NOT_FOUND)

	const digest = settings.confirmEthAddressTemplate
		.replace(
			'{{full_name}}',
			`${foundRegistration.firstName} ${foundRegistration.lastName}`
		)
		.replace('{{iso8601_timestamp}}', transmittedAt)
		.replace('{{eth_address}}', ethAddress)

	await verifyWalletSignature(ethAddress, ethSignature, transmittedAt, digest)

	foundRegistration.ethAddress = ethAddress
	foundRegistration.onboardingStep = RegistrationFlowStep.Documentation

	await foundRegistration.save()

	return new RegistrationDto(foundRegistration)
}

export const signDocumentService = async (
	id: string,
	documentId: string,
	ethSignature: string,
	transmittedAt: string
) => {
	const foundRegistration = await registrationModel.findOne({ id })

	if (!foundRegistration)
		throw ApiError.BadRequest(ERRORS.REGISTRATION_NOT_FOUND)

	if (documentId !== settings.licenceAgreement.id)
		throw ApiError.BadRequest(ERRORS.INCORRECT_DOCUMENT)

	const digest = settings.licenseSigningTemplate
		.replace(
			'{{full_name}}',
			`${foundRegistration.firstName} ${foundRegistration.lastName}`
		)
		.replace('{{iso8601_timestamp}}', transmittedAt)

	if (!foundRegistration.ethAddress) return

	await verifyWalletSignature(
		foundRegistration.ethAddress,
		ethSignature,
		transmittedAt,
		digest
	)

	foundRegistration.documentsSignedAt = transmittedAt
	foundRegistration.onboardingStep = RegistrationFlowStep.KYCAML

	await foundRegistration.save()

	return new RegistrationDto(foundRegistration)
}

export const verifyCustomerService = async (
	id: string,
	simulatedData: string
) => {
	const foundRegistration = await registrationModel.findOne({ id })

	if (!foundRegistration)
		throw ApiError.BadRequest(ERRORS.REGISTRATION_NOT_FOUND)

	if (!simulatedData) throw ApiError.BadRequest(ERRORS.NO_DATA)

	foundRegistration.identityCheckStatus = true
	foundRegistration.onboardingStep = RegistrationFlowStep.Confirmation

	await foundRegistration.save()

	const newUser = await userModel.create({
		emailAddress: foundRegistration.emailAddress,
		ethAddress: foundRegistration.ethAddress,
		firstName: foundRegistration.firstName,
		lastName: foundRegistration.lastName,
		linkedIn: foundRegistration.linkedIn
	})

	const user = await getUserData(newUser)
	const registration = new RegistrationDto(foundRegistration)

	return { registration, user }
}
