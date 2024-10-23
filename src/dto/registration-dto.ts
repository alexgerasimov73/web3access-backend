import {
	IRegistration,
	RegistrationFlowStep
} from '../models/registration-model'

export interface IRegistrationDto {
	emailAddress: string
	id?: string
	onboardingStep: RegistrationFlowStep
	verificationToken: string
}

export class RegistrationDto<IRegistrationDto> {
	emailAddress
	id
	onboardingStep
	verificationToken

	constructor(model: IRegistration) {
		this.emailAddress = model.emailAddress
		this.id = model._id
		this.onboardingStep = model.onboardingStep
		this.verificationToken = model.verificationToken
	}
}
