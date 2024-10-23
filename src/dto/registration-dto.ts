import { Address } from '../config/types'
import {
	IRegistration,
	RegistrationFlowStep
} from '../models/registration-model'

export interface IRegistrationDto {
	documentsSignedAt: string
	emailAddress: string
	ethAddress: Address
	firstName?: string
	lastName?: string
	linkedIn?: string
	id?: string
	onboardingStep: RegistrationFlowStep
	verificationToken: string
}

export class RegistrationDto<IRegistrationDto> {
	documentsSignedAt
	emailAddress
	ethAddress
	firstName
	lastName
	linkedIn
	id
	onboardingStep
	verificationToken

	constructor(model: IRegistration) {
		this.documentsSignedAt = model.documentsSignedAt
		this.emailAddress = model.emailAddress
		this.ethAddress = model.ethAddress
		this.firstName = model.firstName
		this.lastName = model.lastName
		this.linkedIn = model.linkedIn
		this.id = model._id
		this.onboardingStep = model.onboardingStep
		this.verificationToken = model.verificationToken
	}
}
