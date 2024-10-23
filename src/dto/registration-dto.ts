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
	identityCheckStatus?: boolean
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
	identityCheckStatus
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
		this.identityCheckStatus = model.identityCheckStatus
		this.onboardingStep = model.onboardingStep
		this.verificationToken = model.verificationToken
	}
}
