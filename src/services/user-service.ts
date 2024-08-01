import bcrypt from 'bcrypt'
import uuid from 'uuid'
import { UserModel } from '../models/user-model'

export const registerService = async (email: string, password: string) => {
	const candidate = await UserModel.findOne({ email })

	if (candidate)
		throw new Error(`The user with this email: ${email} already exists`)

	const hashedPassword = await bcrypt.hash(password, 3)
	const activationLink = uuid.v4()
	const user = await UserModel.create({
		email,
		password: hashedPassword,
		activationLink
	})
}

export const loginService = async () => {}

export const logoutService = async () => {}

export const activateService = async () => {}

export const refreshService = async () => {}

export const getUsersService = async () => {}
