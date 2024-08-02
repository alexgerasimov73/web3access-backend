import bcrypt from 'bcrypt'
import uuid from 'uuid'
import { userModel } from '../models/user-model'
import { sendActivationMail } from './mail-service'
import { generateTokens, saveToken } from './token-service'
import { UserDto } from '../dto/user-dto'

export const registerService = async (email: string, password: string) => {
	const candidate = await userModel.findOne({ email })

	if (candidate)
		throw new Error(`The user with this email: ${email} already exists`)

	const hashedPassword = await bcrypt.hash(password, 3)
	const activationLink = uuid.v4()
	const user = await userModel.create({
		email,
		password: hashedPassword,
		activationLink
	})

	await sendActivationMail(email, activationLink)
	const userDto = new UserDto(user)
	const tokens = generateTokens({ ...userDto })

	if (userDto.id) await saveToken(userDto.id, tokens.refreshToken)

	return { ...tokens, user: userDto }
}

export const loginService = async () => {}

export const logoutService = async () => {}

export const activateService = async () => {}

export const refreshService = async () => {}

export const getUsersService = async () => {}
