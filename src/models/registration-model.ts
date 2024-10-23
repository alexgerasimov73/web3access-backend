import { type Document, Schema, model } from 'mongoose'

export enum RegistrationFlowStep {
	VerifyEmail,
	YourDetails,
	ConnectWallet,
	Documentation,
	KYCAML,
	Confirmation
}

export interface IRegistration extends Document<string> {
	emailAddress: string
	firstName?: string
	lastName?: string
	linkedIn?: string
	id: string
	onboardingStep: RegistrationFlowStep
	verificationToken: string
}

const RegistrationSchema = new Schema<IRegistration>({
	emailAddress: { type: String, required: true, unique: true },
	firstName: { type: String },
	lastName: { type: String },
	linkedIn: { type: String },
	id: { type: String, required: true, unique: true },
	onboardingStep: {
		type: Number,
		enum: [0, 1, 2, 3, 4, 5],
		required: true
	},
	verificationToken: { type: String, required: true }
})

export const registrationModel = model<IRegistration>(
	'Registration',
	RegistrationSchema
)
