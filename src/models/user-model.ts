import { type Document, Types, Schema, model } from 'mongoose'

export enum RegistrationFlowStep {
	VerifyEmail,
	YourDetails,
	ConnectWallet,
	Documentation,
	KYCAML,
	Confirmation
}

export interface IUser extends Document<string> {
	emailAddress: string
	id: string
	onboardingStep: RegistrationFlowStep
	verificationToken: string

	// TODO: Remove these fields below.
	password?: string
	isActivated?: boolean
	activationLink?: string
}

const UserSchema = new Schema<IUser>({
	emailAddress: { type: String, required: true, unique: true },
	id: { type: String, required: true, unique: true },
	onboardingStep: {
		type: Number,
		// enum: Object.values(RegistrationFlowStep),
		enum: [0, 1, 2, 3, 4, 5],
		required: true
	},
	verificationToken: { type: String, required: true },

	// TODO: Remove these fields below.
	password: { type: String },
	isActivated: { type: Boolean, default: false },
	activationLink: { type: String }
})

export const userModel = model<IUser>('User', UserSchema)
