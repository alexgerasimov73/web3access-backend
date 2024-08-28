import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { IUser, userModel } from '../models/user-model'
import { sendActivationMail } from './mail-service'
import {
	findToken,
	generateTokens,
	removeToken,
	saveToken,
	validateRefreshToken
} from './token-service'
import { UserDto } from '../dto/user-dto'
import { ApiError } from '../exceptions/api-error'

const getUserData = async (user: IUser) => {
	const userDto = new UserDto(user)
	const tokens = generateTokens({ ...userDto })

	if (userDto.id) await saveToken(userDto.id, tokens.refreshToken)

	return { ...tokens, user: userDto }
}

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

	return getUserData(user)
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

	return getUserData(user)
}

export const logoutService = async (refreshToken: string) =>
	await removeToken(refreshToken)

export const refreshService = async (refreshToken: string) => {
	if (!refreshToken) throw ApiError.UnauthorizedError()

	const userData = validateRefreshToken(refreshToken)
	const tokenFromDb = findToken(refreshToken)
	if (!userData || !tokenFromDb) throw ApiError.UnauthorizedError()

	if (!userData.id) return

	const user = await userModel.findById(userData.id)

	if (!user) return

	return getUserData(user)
}

export const getAllUsersService = async () => await userModel.find()
