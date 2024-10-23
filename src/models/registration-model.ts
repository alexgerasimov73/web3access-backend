import { type Document, Schema, model } from 'mongoose'
import { Address } from '../config/types'

export enum RegistrationFlowStep {
	VerifyEmail,
	YourDetails,
	ConnectWallet,
	Documentation,
	KYCAML,
	Confirmation
}

export interface IRegistration extends Document<string> {
	documentsSignedAt: string
	emailAddress: string
	ethAddress?: Address
	firstName?: string
	lastName?: string
	linkedIn?: string
	id: string
	onboardingStep: RegistrationFlowStep
	verificationToken: string
}

const RegistrationSchema = new Schema<IRegistration>({
	documentsSignedAt: { type: String },
	emailAddress: { type: String, required: true, unique: true },
	ethAddress: { type: String },
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
