import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { userModel } from '../models/user-model'
import { sendActivationMail } from './mail-service'
import { generateTokens, removeToken, saveToken } from './token-service'
import { UserDto } from '../dto/user-dto'
import { ApiError } from '../exceptions/api-error'

export const registerService = async (email: string, password: string) => {
	const candidate = await userModel.findOne({ email })

	if (candidate)
		throw ApiError.BadRequest(
			`The user with this email: ${email} already exists`
		)

	const hashedPassword = await bcrypt.hash(password, 3)
	const activationLink = uuidv4()
	const user = await userModel.create({
		email,
		password: hashedPassword,
		activationLink
	})

	await sendActivationMail(
		email,
		`${process.env.API_URL}/api/activate/${activationLink}`
	)
	const userDto = new UserDto(user)
	const tokens = generateTokens({ ...userDto })

	if (userDto.id) await saveToken(userDto.id, tokens.refreshToken)

	return { ...tokens, user: userDto }
}

export const activateService = async (activationLink: string) => {
	const user = await userModel.findOne({ activationLink })

	if (!user) throw ApiError.BadRequest('The link is incorrect')

	user.isActivated = true
	await user.save()
}

export const loginService = async (email: string, password: string) => {
	const user = await userModel.findOne({ email })
	if (!user)
		throw ApiError.BadRequest(
			`The user with this email: ${email} doesn't exist`
		)

	const isPasswordEqual = await bcrypt.compare(password, user.password)
	if (!isPasswordEqual) throw ApiError.BadRequest(`The password is wrong`)

	const userDto = new UserDto(user)
	const tokens = generateTokens({ ...userDto })

	if (userDto.id) await saveToken(userDto.id, tokens.refreshToken)

	return { ...tokens, user: userDto }
}

export const logoutService = async (refreshToken: string) =>
	await removeToken(refreshToken)

export const refreshService = async () => {}

export const getUsersService = async () => {}
