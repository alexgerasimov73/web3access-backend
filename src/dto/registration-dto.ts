import {
	IRegistration,
	RegistrationFlowStep
} from '../models/registration-model'

export interface IRegistrationDto {
	emailAddress: string
	firstName?: string
	lastName?: string
	linkedIn?: string
	id?: string
	onboardingStep: RegistrationFlowStep
	verificationToken: string
}

export class RegistrationDto<IRegistrationDto> {
	emailAddress
	firstName
	lastName
	linkedIn
	id
	onboardingStep
	verificationToken

	constructor(model: IRegistration) {
		this.emailAddress = model.emailAddress
		this.firstName = model.firstName
		this.lastName = model.lastName
		this.linkedIn = model.linkedIn
		this.id = model._id
		this.onboardingStep = model.onboardingStep
		this.verificationToken = model.verificationToken
	}
}
