import { type Document, Schema, model } from 'mongoose'

export interface IUser extends Document {
	email: string
	password: string
	isActivated?: boolean
	activationLink?: string
}

const UserSchema = new Schema<IUser>({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	isActivated: { type: Boolean, default: false },
	activationLink: { type: String }
})

export const User = model<IUser>('User', UserSchema)
