import { type Document, Types, Schema, model } from 'mongoose'
import { Address } from '../config/types'

export interface IUser extends Document<string> {
	emailAddress: string
	ethAddress: Address
	id?: string
	firstName: string
	lastName: string
	linkedIn?: string
}

const UserSchema = new Schema<IUser>({
	emailAddress: { type: String, required: true, unique: true },
	ethAddress: { type: String, required: true, unique: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	linkedIn: { type: String }
})

export const userModel = model<IUser>('User', UserSchema)
