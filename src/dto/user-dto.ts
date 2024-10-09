import { IUser, RegistrationFlowStep } from '../models/user-model'

export interface IUserDto {
	emailAddress: string
	id?: string
	onboardingStep: RegistrationFlowStep
	verificationToken: string

	isActivated?: boolean
}

export class UserDto<IUserDto> {
	emailAddress
	id
	onboardingStep
	verificationToken
	isActivated

	constructor(model: IUser) {
		this.emailAddress = model.emailAddress
		this.id = model._id
		this.onboardingStep = model.onboardingStep
		this.verificationToken = model.verificationToken

		this.isActivated = model.isActivated
	}
}
