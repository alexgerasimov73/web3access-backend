import jwt, { type JwtPayload } from 'jsonwebtoken'
import { tokenModel } from '../models/token-model'
import { IUserDto } from '../dto/user-dto'

export interface TUserJwtPayload extends IUserDto, JwtPayload {}

export const generateTokens = (payload: IUserDto) => {
	const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
		expiresIn: '30m'
	})
	const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
		expiresIn: '30d'
	})

	return { accessToken, refreshToken }
}

export const saveToken = async (userId: string, refreshToken: string) => {
	const tokenData = await tokenModel.findOne({ user: userId })

	if (tokenData) {
		tokenData.refreshToken = refreshToken

		return tokenData.save()
	}

	const token = await tokenModel.create({ user: userId, refreshToken })

	return token
}

export const removeToken = async (refreshToken: string) =>
	await tokenModel.deleteOne({ refreshToken })

export const validateAccessToken = (accessToken: string) => {
	try {
		return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!)
	} catch (error) {
		console.error(error)
		return null
	}
}

export const validateRefreshToken = (refreshToken: string) => {
	try {
		return jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET!
		) as TUserJwtPayload
	} catch (error) {
		console.error(error)
		return null
	}
}

export const findToken = async (refreshToken: string) =>
	await tokenModel.findOne({ refreshToken })
