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
	id: Types.ObjectId
	onboardingStep: RegistrationFlowStep
	verificationToken: string

	// TODO: Remove these fields below.
	password: string
	isActivated?: boolean
	activationLink?: string
}

const UserSchema = new Schema<IUser>({
	emailAddress: { type: String, required: true, unique: true },
	id: { type: Schema.Types.ObjectId, required: true, unique: true },
	onboardingStep: {
		type: Number,
		enum: Object.values(RegistrationFlowStep),
		required: true
	},
	verificationToken: { type: String, required: true },

	// TODO: Remove these fields below.
	password: { type: String, required: true },
	isActivated: { type: Boolean, default: false },
	activationLink: { type: String }
})

export const userModel = model<IUser>('User', UserSchema)
